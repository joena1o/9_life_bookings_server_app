import mongoose from "mongoose";

const bookmarkedSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  product_id: {
    type: String,
    required: true,
    ref: "product"
  },
}, {timestamps: true});

const bookMarkedModel = mongoose.model("bookmark", bookmarkedSchema);
export default bookMarkedModel;
