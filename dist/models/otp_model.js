"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    email: {
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
const otpModel = mongoose_1.default.model("otp_store", otpSchema);
exports.default = otpModel;
