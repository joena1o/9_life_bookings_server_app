import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema({
    userId: {type: String, required: true, ref: "user" },
    creatorUserId: {type: String, required: true, ref: "user"},
    postId: {type: String, required: true},
    rating: {type: Number, required: true},
    review: {type: String, default: null, required: true}
});

const RatingModel = mongoose.model("ratings", RatingSchema);
export default RatingModel;