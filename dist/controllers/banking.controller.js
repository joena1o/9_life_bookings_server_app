"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiatePayment = exports.getBankDetails = exports.updateAccountDetails = exports.finalizeDisburseUsersFunds = exports.initiateDisburseUsersFunds = exports.getBankList = exports.addBankDetails = void 0;
const create_paystack_receipants_1 = require("../utils/create_paystack_receipants");
const jwt_service_1 = require("../utils/jwt_service");
const user_model_1 = __importDefault(require("../models/user_model"));
const axios_1 = __importDefault(require("axios"));
const product_model_1 = __importDefault(require("../models/product_model"));
const recipient_model_1 = __importDefault(require("../models/recipient_model"));
const transfer_details_model_1 = __importDefault(require("../models/transfer_details_model"));
const order_model_1 = __importDefault(require("../models/order_model"));
const addBankDetails = async (req, res) => {
    try {
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const user_id = payload.userId;
            const { business_name, bank_code, account_number, } = req.body;
            let createData = await (0, create_paystack_receipants_1.createReceiptCode)(business_name, bank_code, account_number);
            console.log(createData);
            if (createData.status) {
                let accountDetails = await recipient_model_1.default.create({
                    ...createData.data,
                    user_id,
                    business_name
                });
                if (accountDetails) {
                    await user_model_1.default.findByIdAndUpdate(user_id, {
                        $set: {
                            account_id: accountDetails?.id.toString(),
                            sub_account: accountDetails?.recipient_code
                        }
                    });
                    return res
                        .status(201)
                        .json({ data: accountDetails, message: "Your bank details have been added successfully" });
                }
                else {
                    return res.status(400).json({ error: "An Error Occured while processing your request" });
                }
            }
            else {
                return res.status(400).json({ error: "An Error Occured while processing your request" });
            }
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.addBankDetails = addBankDetails;
const getBankList = async (req, res) => {
    const options = {
        method: "GET",
        url: `${process.env.PAYSTACK_API}/bank`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.LIVE_SECRET_KEY}`
        },
    };
    try {
        const response = await (0, axios_1.default)(options);
        return res
            .status(201)
            .json({ data: response.data, message: "Bank List" });
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({ error: `Error retriving banks: ${error}` });
    }
};
exports.getBankList = getBankList;
const initiateDisburseUsersFunds = async (req, res) => {
    try {
        const { reason, amount, reference, recipient, } = req.body;
        let disburseResult = await (0, create_paystack_receipants_1.disburseFund)(reason, amount, reference, recipient);
        console.log(disburseResult.data.data);
        if (disburseResult.status) {
            return res
                .status(201)
                .json({ data: disburseResult, message: disburseResult.status });
        }
        else {
            return res.status(400).json({ error: "An Error Occured while processing your request" });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.initiateDisburseUsersFunds = initiateDisburseUsersFunds;
const finalizeDisburseUsersFunds = async (req, res) => {
    try {
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const user_id = payload.userId;
            const { transfer_code, otp, userId, orderId, } = req.body;
            let disburseResult = await (0, create_paystack_receipants_1.finalizePaystackTransfer)(transfer_code, otp);
            console.log(disburseResult);
            if (disburseResult.status) {
                await order_model_1.default.findOneAndUpdate({ _id: orderId }, {
                    disbursed: disburseResult.message,
                });
                let transferDetails = await transfer_details_model_1.default.create({
                    ...disburseResult,
                    user_id: userId,
                    disbursedBy: user_id,
                    orderId
                });
                return res
                    .status(201)
                    .json({ data: transferDetails, message: disburseResult.message });
            }
            else {
                return res.status(400).json({ error: "An Error Occured while processing your request" });
            }
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.finalizeDisburseUsersFunds = finalizeDisburseUsersFunds;
const updateAccountDetails = async (req, res) => {
    try {
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const user_id = payload.userId;
            const { business_name, bank_code, account_number, } = req.body;
            let createData = await (0, create_paystack_receipants_1.createReceiptCode)(business_name, bank_code, account_number);
            if (createData.status) {
                let accountDetails = await recipient_model_1.default.findOneAndUpdate({ user_id }, {
                    ...createData.data,
                    user_id
                }, { new: true });
                if (accountDetails) {
                    await user_model_1.default.findByIdAndUpdate(user_id, {
                        $set: {
                            account_id: accountDetails?.id.toString(),
                            sub_account: accountDetails?.recipient_code // RECEIPANT CODE
                        }
                    });
                    return res
                        .status(201)
                        .json({ data: accountDetails, message: "Your bank details have been updated successfully" });
                }
                else {
                    return res.status(400).json({ error: "An Error Occured while processing your request" });
                }
            }
            else {
                return res.status(400).json({ error: "An Error Occured while processing your request" });
            }
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.updateAccountDetails = updateAccountDetails;
const getBankDetails = async (req, res) => {
    try {
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const user_id = payload.userId;
            const fetchDetails = await recipient_model_1.default.find({ user_id });
            return res.status(200).json({ data: fetchDetails });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.getBankDetails = getBankDetails;
const initiatePayment = async (req, res) => {
    try {
        const { email, amount, metadata } = req.body;
        const { productId, quantity } = metadata;
        const checkItemAvailabilty = await product_model_1.default.findOne({ _id: productId, quantity: { $gte: quantity } });
        if (checkItemAvailabilty) {
            const response = await axios_1.default.post(`${process.env.PAYSTACK_API}/transaction/initialize`, {
                email,
                amount, // Amount in kobo (₦5000)
                metadata // Specify who bears the Paystack fee
            }, {
                headers: {
                    Authorization: `Bearer ${process.env.LIVE_SECRET_KEY}`,
                },
            });
            return res.status(200).json({ data: response.data });
        }
        else {
            return res.status(400).json({ error: "Item is no longer available" });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};
exports.initiatePayment = initiatePayment;
