"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.addRating = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const rating__model_1 = __importDefault(require("../models/rating_,model"));
const addRating = async (req, res) => {
    try {
        let review = await rating__model_1.default.create(req.body);
        if (review) {
            return res
                .status(201)
                .json({ data: review, message: "Review has been uploaded successfully" });
        }
        else {
            return res.status(400).json({ error: "An Error Occured while processing your request" });
        }
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.addRating = addRating;
const deleteReview = async (req, res) => {
    try {
        const { id } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid product ID." });
        }
        const deleteReview = await rating__model_1.default.findByIdAndDelete(id);
        if (!deleteReview) {
            return res.status(404).json({ error: "Review not found." });
        }
        res.status(200).json({ message: "Review has been deleted." });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.deleteReview = deleteReview;
