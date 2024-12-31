import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  bathrooms: {type: Number, required: true},
  bedrooms: {type: Number, required: true},
  toilets: {type: Number, required: true, default: 1},
  parkingSpace: {type: Number, required: true, default: 1},
  landArea: {type: Number, required: true},
  images: {type: [String], required: true},
  user_id: {type: String, required: true, ref: "user"},
  category: {type: String, required: true},
  //location: {type: [Number], required: true},
  price: {type: Number, required: true},
  rent: {type: Boolean, default: false},
  Duration: {type: Number, default: null},
}, { timestamps: true });

const ProductModel = mongoose.model("product", ProductSchema);
export default ProductModel;