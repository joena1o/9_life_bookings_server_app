import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  bathrooms: {type: Number, required: true},
  bedrooms: {type: Number, required: true},
  landArea: {type: Number, required: true},
  images: {type: [String], required: true},
  user_id: {type: String, required: true},
  category: {type: String, required: true},
  //location: {type: [Number], required: true},
  price: {type: Number, required: true},
  rent: {type: Boolean, default: false},
  Duration: {type: Number, default: null},
});

const ProductModel = mongoose.model("product", ProductSchema);
export default ProductModel;