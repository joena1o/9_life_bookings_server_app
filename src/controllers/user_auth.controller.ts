import { Response, Request } from "express";
import dotenv from "dotenv";
import argon2 from 'argon2';
import jwt from "jsonwebtoken";
import UserModel from "../models/user_model";
import otpModel from "../models/otp_model";
import { isExpired } from "../utils/time_util";
import { sendVerifyEmailOtp } from "../utils/email_request";
import {sendOtp, verifyOtp} from '../utils/sms_request';

dotenv.config();
const jwtSecret: any = process.env.JWT_SECRET;

export const createUserManualSignUp = async (req: Request, res: Response): Promise<any> => {
  const { email, password, firstName, picture, lastName, referralCode } = req.body;
  try {
    let user = await UserModel.findOne({ email: email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await argon2.hash(password.toString());
    user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      picture,
      referralCode,
    });
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    const sortedUser = Object.fromEntries(
      Object.entries(user.toObject()).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );
    return res
      .status(201)
      .json({ data: sortedUser, message: "User registered successfully", token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

export const LoginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    if (user.googleId && !user.password) {
      return res
        .status(400)
        .send(
          "This account was created using Google. Please log in with Google."
        );
    }
    if (user.password) {
      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid Login credentials" });
      }
      const token = jwt.sign({ userId: user._id }, jwtSecret);
      return res.status(200).json({ data: user, message: "Login successful", token });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};


export const sendEmailOtp = async (req: Request, res: Response): Promise<any> => {
  try {
      const { email } = req.body;
      const otp = Math.floor(1000 + Math.random() * 9000);
      await otpModel.create({email, code: otp });
      sendVerifyEmailOtp(email, "OTP", otp);
      return res.status(200).json({ message: "Request sent" });
  } catch (e) {
      res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};

export const sendPhoneOtp = async (req: Request, res: Response): Promise<any> => {
  try {
      const { phone } = req.body;
      const otp = Math.floor(1000 + Math.random() * 9000);
      const result = await sendOtp(phone, otp);
      return res.status(200).json({ message: "Request sent", data: result });
  } catch (e) {
      res.status(500).json({ error: e });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
  try {
      const { email, otp } = req.body;
      const response = await otpModel.findOne({email, code: otp});
      if(response){
        if(isExpired(response.createdAt.toString())){
          await otpModel.deleteOne({email: email, code: otp});
          return res.status(400).json({error: "Otp has expired, send another"})
        }
        await otpModel.deleteOne({email, code: otp});
        await UserModel.findOneAndUpdate({email}, {emailVerified: true});
        return res.status(200).json({ message: "Email verified Successfully" });
      }else{
        return res.status(400).json({ error: "Invalid code sent" });
      }
  } catch (e) {
      res.status(500).json({ error: e });
  }
};

export const verifyPhone = async (req: Request, res: Response): Promise<any> => {
  try {
      const { pinId, pin } = req.body;
      const result = await verifyOtp(pinId, pin);
      if(result.verified){
        return res.status(200).json({ message: "Phone Verified successfully", data: result });
      }else{
        return res.status(400).json({ error: "Incorrect Pin", data: result });
      }
  } catch (e) {
      res.status(500).json({ error: e });
  }
};



export const updateProfilePic = async (req: Request, res: Response): Promise<any> => {
    try{
      const {imageUrl, id} = req.body;
      const user = await UserModel.findOneAndUpdate({_id: id}, {picture: imageUrl},{new: true});
      if(user){
        const sortedUser = Object.fromEntries(
          Object.entries(user.toObject()).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        );
        return res.status(200).json({message: "Profile Picture Updated Successfully", data: sortedUser})
      }
      return res.status(400).json({message: "Unable to process your request"})
    }catch(e){
      res.status(500).json({ error: e });
    }
}
