import { Response, Request } from "express";
import UserModel from "../../models/user_model";
import { request } from "http";
import { sendEmail } from "../../utils/email_request";

export const fetchCustomers = async (req: Request, res: Response): Promise<any> =>{
    try{
        let fetchUsers =  await UserModel.find();
        return res.status(200).json({message:"Customers", data: fetchUsers});
    }catch(err){
        return res.status(500).json({error: err});
    }
}

export const suspendUser = async (req: Request, res: Response): Promise<any> =>{
    try{
        const {id, status} = req.body;
        let suspendUser =  await UserModel.findOneAndUpdate({_id: id },
             {suspended: status}, {new: true});
        return res.status(200).json({message:"Customers",
             data: suspendUser});
    }catch(err){
        return res.status(500).json({error: err});
    }
}

export const sendUserAnEmail = async (req: Request, res: Response): Promise<any> =>{
    try{
        const {content, title, email} = req.body;
        await sendEmail(email, title, content);
        return res.status(200).json({message: "Email sent successfully"});
    }catch(err){
        return res.status(500).json({error: err});
    }
} 