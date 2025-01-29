import { Request, Response } from "express";
import UserModel from "../../models/user_model";
import jwt from "jsonwebtoken";
import argon2 from 'argon2';
import dotenv from "dotenv";


dotenv.config();
const jwtSecret: any = process.env.JWT_SECRET;

export const LoginUser = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.findOne({ email, privileges: "admin" });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        if (user.googleId && !user.password) {
            return res
                .status(400)
                .json({
                    error:
                        "The credentials you entered are incorrect. Please try again or use Google to sign in."
                });
        }
        if (user.password) {
            const isMatch = await argon2.verify(user.password, password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Login credentials" });
            }
            const token = jwt.sign({ userId: user._id, name: user.firstName }, jwtSecret)
            return res.status(200).json({ data: user, message: "Login successful", token });
        }
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
};

export const LoginUserGoogle = async (req: Request, res: Response): Promise<any> => {
    const { email, googleId } = req.body;
    try {
        const user = await UserModel.findOne({ email, privileges: "admin" });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        if (!user.googleId && user.password) {
            return res
                .status(400)
                .json({
                    error:
                        "We detected an existing account with this email. Please log in using your email and password"
                });
        }
        if (user.googleId) {
            const isMatch = await argon2.verify(user.googleId, googleId);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Login credentials" });
            }
            const token = jwt.sign({ userId: user._id, name: user.firstName }, jwtSecret);
            return res.status(200).json({ data: user, message: "Login successful", token });
        }
    } catch (error) {
        return res.status(500).json({ error: "Server error" });
    }
}