"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookmarkedSchema = new mongoose_1.default.Schema({
    user_id: {
        type: String,
        required: true,
    },
    product_id: {
        type: String,
        required: true,
        ref: "product"
    },
}, { timestamps: true });
const bookMarkedModel = mongoose_1.default.model("bookmark", bookmarkedSchema);
exports.default = bookMarkedModel;
