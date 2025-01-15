import {Response, Request} from 'express';
import ProductModel from '../../models/product_model';
import UserModel from '../../models/user_model';
import OrderModel from '../../models/order_model';

export const numberCounts = async(req: Request, res: Response): Promise<any> =>{
    try{
        let productCount = await ProductModel.collection.count();
        let customerCount = await UserModel.collection.count();
        return res.status(200).json({products: productCount, 
            sales: 0, revenue: 0,
            customers: customerCount});
    }catch(err){
        return res.status(500).json({error: err});
    }
}

export const fetchCustomersOrders = async (req: Request, res: Response): Promise<any> =>{
    try{
        const letOrders = await OrderModel.find().populate("productId").populate("userId");
        return res.status(200).json({data: letOrders});
    }catch(err){
        return res.status(500).json({error: err});
    }
}