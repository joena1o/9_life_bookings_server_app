import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  bathrooms: {type: Number, required: true},
  bedrooms: {type: Number, required: true},
  toilets: {type: Number, required: true, default: 0},
  parkingSpace: {type: Number, required: true, default: 0},
  isAvailable: {type: Boolean, required: true, default: true},
  landArea: {type: Number, required: true},
  images: {type: [String], required: true},
  user_id: {type: String, required: true, ref: "user"},
  quantity: {type: Number, required: true, default: 1},
  kitchenAccess: {type: Boolean, default: false},
  availability: {type: Number, default: 7},
  delisted: {type: Boolean, default: false},
  approved: {type: Boolean, default: null},
  type:{
    type: String,
    enum: ['Residential', 'Commercial', 'Land', 'Hospitality', 'Industrial', 'Specialty'],
    required: true
  },
  category: {type: String, required: true},
  approvedBy: {type: String, default: null},
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  address: {type: String, required: true},
  price: {type: Number, required: true},
  rent: {type: Boolean, default: false},
  durationType: {type: String, default: null},
  Duration: {type: Number, default: null},
}, { timestamps: true });

const ProductModel = mongoose.model("product", ProductSchema);
export default ProductModel;