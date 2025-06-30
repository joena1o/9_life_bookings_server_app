"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const notificationSchema = new mongoose_1.default.Schema({
    user_id: {
        type: String,
        required: true,
    },
    product_id: {
        type: String,
        ref: "product",
        default: null
    },
    noticeType: {
        type: String,
        enum: ['notice', 'purchase', 'sale', 'review', 'admin'],
        default: "notice"
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    extra: {
        type: String,
        default: null
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const notificationModel = mongoose_1.default.model("notification", notificationSchema);
exports.default = notificationModel;
