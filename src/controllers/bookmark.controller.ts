import { Response, Request } from "express";
import ProductModel from "../models/bookmark_model";
import { decodeToken } from "../utils/jwt_service";
import { JwtPayload } from "jsonwebtoken";
import bookMarkedModel from "../models/bookmark_model";

export const bookmarkItem = async (req: Request, res: Response): Promise<any> => {
    try {
        const { user_id, product_id } = req.body;
        if (!user_id || !product_id) {
            return res.status(400).json({ error: "User ID and Item ID are required" });
        }
        // Check if the item already exists in the bookmarks
        const existingBookmark = await bookMarkedModel.findOne({ user_id, product_id });
        if (existingBookmark) {
            // If it exists, remove it
            await bookMarkedModel.deleteOne({ _id: existingBookmark._id });
            return res.status(200).json({ message: "Item removed from bookmark", added: false });
        } else {
            // If it doesn’t exist, add it
            await bookMarkedModel.create({ user_id, product_id });
            return res.status(201).json({
                message: "Item has been added to your bookmark", added: true
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: err,
        });
    }
}


export const getUsersBookmarks = async (req: Request, res: Response): Promise<any> => {
    try {
        const accessToken = decodeToken(req.headers.authorization!);
    if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
      const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
      const user_id = payload.userId;
        const products = await bookMarkedModel.find({user_id}).populate({path: 'product_id',
            populate: {
              path: 'user_id', // Nested field inside product_id
            }}).sort({ createdAt: 1 }); // Fetch all products
        return res.status(200).json({data: products});
    }
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
}
