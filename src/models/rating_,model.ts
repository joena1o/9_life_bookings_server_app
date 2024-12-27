import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    postId: {type: String, required: true},
    rating: {type: Number, required: true},
    comment: {type: String, default: null}
});

const RatingModel = mongoose.model("ratings", RatingSchema);
export default RatingModel;