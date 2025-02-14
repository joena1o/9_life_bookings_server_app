import { Request, Response } from "express";
import ProductModel from "../../models/product_model";
import { decodeToken } from "../../utils/jwt_service";
import { JwtPayload } from "jsonwebtoken";
import bookMarkedModel from "../../models/bookmark_model";

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
        }, {new: true}).populate('user_id');
        return res.status(200).json({data: approve, message: `Product has been ${status ? "approved": "disapproved"} successfully`});
    }catch(e){
        return res.status(500).json({error: e});
    }   
};

export const fetchingPendingProducts = async(req: Request,res: Response):Promise<any> =>{
    try{
        const accessToken = decodeToken(req.headers.authorization!);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
            const user_id = payload.userId;
            // Fetch all products
            const products = await ProductModel.find().populate("user_id").sort({ createdAt: -1 }).lean();
            // Fetch all bookmarks for the user
            const bookmarks = await bookMarkedModel.find({ user_id }).lean();
            const bookmarkedProductIds = bookmarks.map(bookmark => bookmark.product_id);
            // Add `isBookmarked` field to products
            const productsWithBookmarkInfo = products.map(product => ({
                ...product,
                isBookmarked: bookmarkedProductIds.includes(product._id.toString())
            }));
            return res.status(200).json({ data: productsWithBookmarkInfo });
        }
    }catch(e){
        return res.status(500).json({error: e});
    }
};