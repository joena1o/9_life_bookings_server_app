"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReview = exports.fetchUserRating = exports.addRating = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const rating__model_1 = __importDefault(require("../models/rating_,model"));
const user_model_1 = __importDefault(require("../models/user_model"));
const push_notification_util_1 = require("../utils/push_notification_util");
const product_model_1 = __importDefault(require("../models/product_model"));
const notification_model_1 = __importDefault(require("../models/notification_model"));
const addRating = async (req, res) => {
    const { userId, creatorUserId, postId, rating, review } = req.body;
    try {
        let createReview = await rating__model_1.default.create(req.body);
        if (createReview) {
            const reviewer = await user_model_1.default.findOne({
                _id: userId,
            });
            const product = await product_model_1.default.findOne({
                _id: postId,
            });
            if (reviewer && product) {
                (0, push_notification_util_1.sendNotificationToUser)("9LifeBookings", `🌟 ${reviewer.firstName} ${reviewer.lastName} just left a ${rating}⭐️ review! 🎉\n\n💬 "${review}"\n\nCheck it out now! 🚀`, creatorUserId.toString(), product.images[0]);
                await notification_model_1.default.create({
                    user_id: userId.toString(),
                    product_id: postId,
                    noticeType: 'review',
                    message: `${reviewer.firstName} ${reviewer.lastName} just left a ${rating}⭐️ review! 🎉\n\n💬 ${review}`,
                    title: `New review dropped`,
                    extra: creatorUserId
                });
            }
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
const fetchUserRating = async (req, res) => {
    const { creatorUserId } = req.query;
    try {
        let reviews = await rating__model_1.default.find({ creatorUserId }).populate([
            { path: "creatorUserId" }, // Populate posts with selected fields
            { path: "userId" }, // Populate comments with selected fields
        ]);
        return res.status(200).json({ data: reviews });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }
};
exports.fetchUserRating = fetchUserRating;
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
