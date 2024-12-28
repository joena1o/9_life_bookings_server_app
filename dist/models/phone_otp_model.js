"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const phoneOtpSchema = new mongoose_1.default.Schema({
    phone: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "unused",
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    },
});
const phoneOtpModel = mongoose_1.default.model("phone_otp_store", phoneOtpSchema);
exports.default = phoneOtpModel;
