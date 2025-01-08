import { Response, Request } from "express";
import mongoose from "mongoose";
import RatingModel from "../models/rating_,model";
import UserModel from "../models/user_model";
import { sendNotificationToUser } from "../utils/push_notification_util";
import ProductModel from "../models/product_model";


export const addRating = async (req: Request, res: Response): Promise<any> => {
    const {userId, creatorUserId, postId, rating, review} = req.body;
    try {
        let createReview = await RatingModel.create(req.body);
        if (createReview) {
            const reviewer = await UserModel.findOne({
                _id: userId,
            });
            const product = await ProductModel.findOne({
                _id: postId,
            });
            if(reviewer && product){
                sendNotificationToUser(
                    "9LifeBookings",
                    `🌟 ${reviewer.firstName} ${reviewer.lastName} just left a ${rating}⭐️ review! 🎉\n\n💬 "${review}"\n\nCheck it out now! 🚀`,
                    creatorUserId.toString(),
                    product.images[0]
                  );
            }
            return res
                .status(201)
                .json({ data: review, message: "Review has been uploaded successfully" });
        } else {
            return res.status(400).json({ error: "An Error Occured while processing your request" });
        }
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}


export const fetchUserRating = async (req: Request, res: Response): Promise<any> => {
    const {creatorUserId} = req.query;
    try{
        let reviews = await RatingModel.find({creatorUserId}).populate(
            [
                { path: "creatorUserId" }, // Populate posts with selected fields
                { path: "userId" }, // Populate comments with selected fields
              ]
        );
        return res.status(200).json({data: reviews});
    }catch(err){
        return res.status(500).json({ error: err });
    }
}

export const deleteReview = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid product ID." });
        }
        const deleteReview = await RatingModel.findByIdAndDelete(id);
        if (!deleteReview) {
            return res.status(404).json({ error: "Review not found." });
        }
        res.status(200).json({ message: "Review has been deleted." });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}