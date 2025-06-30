"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserGoogle = exports.LoginUser = void 0;
const user_model_1 = __importDefault(require("../../models/user_model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const argon2_1 = __importDefault(require("argon2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await user_model_1.default.findOne({ email, privileges: "admin" });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        if (user.googleId && !user.password) {
            return res
                .status(400)
                .json({
                error: "The credentials you entered are incorrect. Please try again or use Google to sign in."
            });
        }
        if (user.password) {
            const isMatch = await argon2_1.default.verify(user.password, password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Login credentials" });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id, name: user.firstName }, jwtSecret);
            return res.status(200).json({ data: user, message: "Login successful", token });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};
exports.LoginUser = LoginUser;
const LoginUserGoogle = async (req, res) => {
    const { email, googleId } = req.body;
    try {
        const user = await user_model_1.default.findOne({ email, privileges: "admin" });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        if (!user.googleId && user.password) {
            return res
                .status(400)
                .json({
                error: "We detected an existing account with this email. Please log in using your email and password"
            });
        }
        if (user.googleId) {
            const isMatch = await argon2_1.default.verify(user.googleId, googleId);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Login credentials" });
            }
            const token = jsonwebtoken_1.default.sign({ userId: user._id, name: user.firstName }, jwtSecret);
            return res.status(200).json({ data: user, message: "Login successful", token });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};
exports.LoginUserGoogle = LoginUserGoogle;
