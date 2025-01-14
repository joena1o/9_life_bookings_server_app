import { Response, Request } from "express";
import UserModel from "../../models/user_model";

export const fetchCustomers = async (req: Request, res: Response): Promise<any> =>{
    try{
        let fetchUsers =  await UserModel.find({privileges: "user"});
        return res.status(200).json({message:"Customers", data: fetchUsers});
    }catch(err){
        return res.status(500).json({error: err});
    }
}