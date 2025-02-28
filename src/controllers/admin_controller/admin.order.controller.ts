import { Response, Request } from "express";
import OrderModel from "../../models/order_model";


export const getSalesOrder = async(req: Request, res: Response): Promise<any>=>{
    try{
        let salesOrder = await OrderModel.find().populate('userId').populate("merchantId").populate("productId").sort({ createdAt: -1 });
        return res.status(200).json({data: salesOrder});
    }catch(err){
        return res.status(500).json({ error: err });
    }
}