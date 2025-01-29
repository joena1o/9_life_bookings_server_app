import { Request, Response } from "express";
import ProductModel from "../../models/product_model";

export const delistProduct = async(req: Request, res: Response):Promise<any> =>{
    try{
        const {productId, status} = req.body; 
        const delist = await ProductModel.findOneAndUpdate({_id: productId }, {
            delisted: status
        }, {new: true});
        return res.status(200).json({data: delist, message: "Product has been delisted successfully"});
    }catch(e){
        return res.status(500).json({error: e});
    }
};

export const approveProduct = async(req: Request, res: Response):Promise<any> =>{
    try{
        const {productId, userId, status} = req.body; 
        const approve = await ProductModel.findOneAndUpdate({_id: productId }, {
            approved: status,
            approvedBy: userId
        }, {new: true});
        return res.status(200).json({data: approve, message: `Product has been ${status ? "approved": "disapproved"} successfully`});
    }catch(e){
        return res.status(500).json({error: e});
    }
};

export const fetchingPendingProducts = async(res: Response):Promise<any> =>{
    try{
        const pendingProducts = await ProductModel.find({approved: null});
        return res.status(200).json({data: pendingProducts});
    }catch(e){
        return res.status(500).json({error: e});
    }
};