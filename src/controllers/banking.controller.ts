import { Request, Response } from 'express';
import { createReceiptCode, disburseFund, finalizePaystackTransfer, updateReceiptCode } from "../utils/create_paystack_receipants";
import { decodeToken } from "../utils/jwt_service";
import { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/user_model";
import axios, { AxiosRequestConfig } from "axios";
import ProductModel from "../models/product_model";
import RecipientModel from "../models/recipient_model";
import TransferDetailsModel from "../models/transfer_details_model";
import OrderModel from '../models/order_model';

export const addBankDetails = async (req: Request, res: Response): Promise<any> => {
    try {
        const accessToken = decodeToken(req.headers.authorization!);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
            const user_id = payload.userId;
            const {
                business_name,
                bank_code,
                account_number,
            } = req.body;
            let createData = await createReceiptCode(
                business_name, bank_code, account_number,
            );
            console.log(createData);
            if (createData.status) {
                let accountDetails = await RecipientModel.create({
                    ...createData.data,
                    user_id,
                    business_name
                });
                if (accountDetails) {
                    await UserModel.findByIdAndUpdate(user_id, {
                        $set: {
                            account_id: accountDetails?.id.toString(),
                            sub_account: accountDetails?.recipient_code
                        }
                    },)
                    return res
                        .status(201)
                        .json({ data: accountDetails, message: "Your bank details have been added successfully" });
                } else {
                    return res.status(400).json({ error: "An Error Occured while processing your request" });
                }
            } else {
                return res.status(400).json({ error: "An Error Occured while processing your request" });
            }
        }
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

export const getBankList = async (req: Request, res: Response): Promise<any> => {
    const options: AxiosRequestConfig = {
        method: "GET",
        url: `${process.env.PAYSTACK_API}/bank`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.TEST_SECRET_KEY}`
        },
    };
    try {
        const response = await axios(options);
        return res
            .status(201)
            .json({ data: response.data, message: "Bank List" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ error: `Error retriving banks: ${error}` });
    }
};


export const initiateDisburseUsersFunds = async (req: Request, res: Response): Promise<any> => {
    try {
        const {
            reason,
            amount,
            reference,
            recipient,
        } = req.body;
        let disburseResult = await disburseFund(reason, amount, reference, recipient);
        if (disburseResult.status) {
            return res
                .status(201)
                .json({ data: disburseResult, message: disburseResult.status });
        } else {
            return res.status(400).json({ error: "An Error Occured while processing your request" });
        }

    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

export const finalizeDisburseUsersFunds = async (req: Request, res: Response): Promise<any> => {
    try {
        const accessToken = decodeToken(req.headers.authorization!);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
            const user_id = payload.userId;
            const {
                transfer_code,
                otp,
                userId,
                orderId,
            } = req.body;
            let disburseResult = await finalizePaystackTransfer(transfer_code, otp);
            console.log(disburseResult);
            if (disburseResult.status) {
                await OrderModel.findOneAndUpdate({ _id: orderId }, {
                    disbursed: disburseResult.message,
                });
                let transferDetails = await TransferDetailsModel.create({
                    ...disburseResult,
                    user_id: userId,
                    disbursedBy: user_id,
                    orderId
                });
                return res
                    .status(201)
                    .json({ data: transferDetails, message: disburseResult.message });
            } else {
                return res.status(400).json({ error: "An Error Occured while processing your request" });
            }
        }
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}


export const updateAccountDetails = async (req: Request, res: Response): Promise<any> => {
    try {
        const accessToken = decodeToken(req.headers.authorization!);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
            const user_id = payload.userId;
            const {
                business_name,
                bank_code,
                account_number,
                recipient_code
            } = req.body;
            let createData = await createReceiptCode(
                business_name, bank_code, account_number
            );
            if (createData.status) {
                let accountDetails = await RecipientModel.findOneAndUpdate({ user_id }, {
                    ...createData.data,
                    user_id
                }, { new: true });
                if (accountDetails) {
                    await UserModel.findByIdAndUpdate(user_id, {
                        $set: {
                            account_id: accountDetails?.id.toString(),
                            sub_account: accountDetails?.recipient_code // RECEIPANT CODE
                        }
                    },)
                    return res
                        .status(201)
                        .json({ data: accountDetails, message: "Your bank details have been updated successfully" });
                } else {
                    return res.status(400).json({ error: "An Error Occured while processing your request" });
                }
            } else {
                return res.status(400).json({ error: "An Error Occured while processing your request" });
            }
        }
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}


export const getBankDetails = async (req: Request, res: Response): Promise<any> => {
    try {
        const accessToken = decodeToken(req.headers.authorization!);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
            const user_id = payload.userId;
            const fetchDetails = await RecipientModel.find({ user_id });
            return res.status(200).json({ data: fetchDetails });
        }
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

export const initiatePayment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, amount, metadata } = req.body;
        const { productId, quantity } = metadata;
        const checkItemAvailabilty = await ProductModel.findOne({ _id: productId, quantity: { $gte: quantity } });
        if (checkItemAvailabilty) {
            const response = await axios.post(
                `${process.env.PAYSTACK_API}/transaction/initialize`,
                {
                    email,
                    amount, // Amount in kobo (₦5000)
                    metadata // Specify who bears the Paystack fee
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.TEST_SECRET_KEY}`,
                    },
                }
            );
            return res.status(200).json({ data: response.data });
        } else {
            return res.status(400).json({ error: "Item is no longer available" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};
