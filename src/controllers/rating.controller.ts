import { Response, Request } from "express";
import mongoose from "mongoose";
import RatingModel from "../models/rating_,model";


export const addRating = async (req: Request, res: Response): Promise<any> => {
    try {
        let review = await RatingModel.create(req.body);
        if (review) {
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