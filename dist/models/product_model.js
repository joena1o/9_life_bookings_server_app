"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    bathrooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    landArea: { type: Number, required: true },
    images: { type: [String], required: true },
    user_id: { type: String, required: true },
    category: { type: String, required: true },
    //location: {type: [Number], required: true},
    price: { type: Number, required: true },
    rent: { type: Boolean, default: false },
    Duration: { type: Number, default: null },
});
const ProductModel = mongoose_1.default.model("product", ProductSchema);
exports.default = ProductModel;
