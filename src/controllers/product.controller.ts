import { Response, Request } from "express";
import ProductModel from "../models/product_model";
import mongoose from "mongoose";
import { decodeToken } from "../utils/jwt_service";
import { JwtPayload } from "jsonwebtoken";
import bookMarkedModel from "../models/bookmark_model";


export const addProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        let product = await ProductModel.create(req.body);
        if (product) {
            return res
                .status(201)
                .json({ added: true, message: "Product Uploaded Successfully" });
        } else {
            return res.status(400).json({ error: "An Error Occured while processing your request" });
        }
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

export const getProducts = async (req: Request, res: Response): Promise<any> => {
    try {
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
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
}

export const getUsersProducts = async (req: Request, res: Response): Promise<any> => {
    try {
        const accessToken = decodeToken(req.headers.authorization!);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
            const user_id = payload.userId;
            const products = await ProductModel.find({ user_id }).populate("user_id").sort({ createdAt: -1 }); // Fetch all products
            return res.status(200).json({ data: products });
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
}

export const editProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { user_id, product_id } = req.body;
        const updatedData = req.body;
        let product = await ProductModel.findOneAndUpdate({ _id: product_id, user_id}, {
            $set: updatedData
        });
        if (product) {
            return res
                .status(201)
                .json({ data: product, message: "Product Uploaded Successfully" });
        } else {
            return res.status(400).json({ error: "An Error Occured while processing your request" });
        }
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}

export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid product ID." });
        }
        const deleteBookmarks = await bookMarkedModel.deleteMany({product_id: id});
        if(deleteBookmarks){
            const deletedProduct = await ProductModel.findByIdAndDelete(id);
            if (!deletedProduct) {
                return res.status(401).json({ error: "Product not found." });
            }
            return res.status(200).json({ message: "Product deleted successfully." });
        }
        return res.status(401).json({ error: "An error occured while processing your request." });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}