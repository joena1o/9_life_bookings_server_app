"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfilePic = exports.verifyPhone = exports.verifyEmail = exports.sendPhoneOtp = exports.sendEmailOtp = exports.LoginUser = exports.createUserManualSignUp = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user_model"));
const otp_model_1 = __importDefault(require("../models/otp_model"));
const time_util_1 = require("../utils/time_util");
const email_request_1 = require("../utils/email_request");
const sms_request_1 = require("../utils/sms_request");
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
const createUserManualSignUp = async (req, res) => {
    const { email, password, firstName, picture, lastName, referralCode } = req.body;
    try {
        let user = await user_model_1.default.findOne({ email: email });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedPassword = await argon2_1.default.hash(password.toString());
        user = await user_model_1.default.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picture,
            referralCode,
        });
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, jwtSecret);
        const sortedUser = Object.fromEntries(Object.entries(user.toObject()).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)));
        return res
            .status(201)
            .json({ data: sortedUser, message: "User registered successfully", token });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};
exports.createUserManualSignUp = createUserManualSignUp;
const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        if (user.googleId && !user.password) {
            return res
                .status(400)
                .send("This account was created using Google. Please log in with Google.");
        }
        if (user.password) {
            const isMatch = await argon2_1.default.verify(user.password, password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Login credentials" });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, jwtSecret);
            return res.status(200).json({ data: user, message: "Login successful", token });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};
exports.LoginUser = LoginUser;
const sendEmailOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(1000 + Math.random() * 9000);
        await otp_model_1.default.create({ email, code: otp });
        (0, email_request_1.sendVerifyEmailOtp)(email, "OTP", otp);
        return res.status(200).json({ message: "Request sent" });
    }
    catch (e) {
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};
exports.sendEmailOtp = sendEmailOtp;
const sendPhoneOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        const otp = Math.floor(1000 + Math.random() * 9000);
        const result = await (0, sms_request_1.sendOtp)(phone, otp);
        return res.status(200).json({ message: "Request sent", data: result });
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
};
exports.sendPhoneOtp = sendPhoneOtp;
const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const response = await otp_model_1.default.findOne({ email, code: otp });
        if (response) {
            if ((0, time_util_1.isExpired)(response.createdAt.toString())) {
                await otp_model_1.default.deleteOne({ email: email, code: otp });
                return res.status(400).json({ error: "Otp has expired, send another" });
            }
            await otp_model_1.default.deleteOne({ email, code: otp });
            await user_model_1.default.findOneAndUpdate({ email }, { emailVerified: true });
            return res.status(200).json({ message: "Email verified Successfully" });
        }
        else {
            return res.status(400).json({ error: "Invalid code sent" });
        }
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
};
exports.verifyEmail = verifyEmail;
const verifyPhone = async (req, res) => {
    try {
        const { pinId, pin } = req.body;
        const result = await (0, sms_request_1.verifyOtp)(pinId, pin);
        if (result.verified) {
            return res.status(200).json({ message: "Phone Verified successfully", data: result });
        }
        else {
            return res.status(400).json({ error: "Incorrect Pin", data: result });
        }
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
};
exports.verifyPhone = verifyPhone;
const updateProfilePic = async (req, res) => {
    try {
        const { imageUrl, id } = req.body;
        const user = await user_model_1.default.findOneAndUpdate({ _id: id }, { picture: imageUrl });
        if (user) {
            return res.status(200).json({ message: "Profile Picture Updated Successfully", data: user });
        }
        return res.status(400).json({ message: "Unable to process your request" });
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
};
exports.updateProfilePic = updateProfilePic;
