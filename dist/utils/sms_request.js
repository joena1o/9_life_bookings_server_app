"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = exports.verifyOtp = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyOtp = async (pinId, pin) => {
    const data = {
        api_key: process.env.TERMII_API_KEY,
        pin_id: pinId,
        pin: pin,
    };
    const options = {
        method: "POST",
        url: `${process.env.TERMII_BASE_URL}/api/sms/otp/verify`,
        headers: {
            "Content-Type": "application/json",
        },
        data,
    };
    try {
        const response = await (0, axios_1.default)(options);
        return response.data;
    }
    catch (error) {
        throw new Error(`Error verifying OTP: ${error}`);
    }
};
exports.verifyOtp = verifyOtp;
const sendOtp = async (to, pin) => {
    const data = {
        api_key: process.env.TERMII_API_KEY,
        message_type: "NUMERIC",
        to,
        from: "N-Alert",
        channel: "dnd",
        pin_attempts: 10,
        pin_time_to_live: 5,
        pin_length: 4,
        pin_placeholder: pin,
        message_text: `Your 9LifeBookings Confirmation Code is ${pin}. it expires in 5 minutes.`,
        pin_type: "NUMERIC",
    };
    const options = {
        method: "POST",
        url: `${process.env.TERMII_BASE_URL}/api/sms/otp/send`,
        headers: {
            "Content-Type": "application/json",
        },
        data,
    };
    try {
        const response = await (0, axios_1.default)(options);
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw new Error(`Error verifying OTP: ${error}`);
    }
};
exports.sendOtp = sendOtp;
