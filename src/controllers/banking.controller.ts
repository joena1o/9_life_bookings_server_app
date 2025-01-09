import bank_details_model from "../models/bank_details_model";
import { Request, Response } from 'express';
import { createPayStackAccount } from "../utils/create_paystack_sub_account";
import { decodeToken } from "../utils/jwt_service";
import { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/user_model";

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
            percentage_charge,
        } = req.body;
        console.log(req.body);
        let createData = await createPayStackAccount(
            business_name, bank_code, account_number, percentage_charge,
        );
        console.log(createData);
        if (createData.status) {
            let accountDetails = await bank_details_model.create({...createData.data,
                user_id
            });
            if (accountDetails) {
                const userDetails = await UserModel.findByIdAndUpdate(user_id, { $set: {account_id: accountDetails?._id!.toString()} },       // Update data
                    { new: true } )
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


export const updateAccountDetails = async (req: Request, res: Response):Promise<any> =>{
    try { 
        const accessToken = decodeToken(req.headers.authorization!);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
          const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
          const user_id = payload.userId;
        const {
            business_name,
            bank_code,
            account_number,
            percentage_charge,
        } = req.body;
        console.log(req.body);
        let createData = await createPayStackAccount(
            business_name, bank_code, account_number, percentage_charge,
        );
        console.log(createData);
        if (createData.status) {
            let accountDetails = await bank_details_model.findOneAndUpdate({user_id}, {...createData.data,
                user_id
            }, {new: true});
            if (accountDetails) {
               await UserModel.findByIdAndUpdate(user_id, { $set: {account_id: accountDetails?._id!.toString()} },       // Update data
                    { new: true } )
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
  

export const getBankDetails = async(req: Request, res: Response): Promise<any>=>{
    try{
        const accessToken = decodeToken(req.headers.authorization!);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
          const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
          const user_id = payload.userId;
          const fetchDetails = await bank_details_model.find({user_id});
          return res.status(200).json({data: fetchDetails});
        }
    }catch(err){
        return res.status(500).json({ error: err });
    }
}