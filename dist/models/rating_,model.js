"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RatingSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true, ref: "user" },
    creatorUserId: { type: String, required: true, ref: "user" },
    postId: { type: String, required: true },
    rating: { type: Number, required: true },
    review: { type: String, default: null, required: true }
});
const RatingModel = mongoose_1.default.model("ratings", RatingSchema);
exports.default = RatingModel;
