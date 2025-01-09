import { Response, Request } from "express";
import dotenv from "dotenv";
import argon2 from 'argon2';
import jwt, { JwtPayload } from "jsonwebtoken";
import UserModel from "../models/user_model";
import otpModel from "../models/otp_model";
import { isExpired } from "../utils/time_util";
import { sendEmailOtp, sendVerifyEmailOtp, sendWelcomeEmail } from "../utils/email_request";
import { sendOtp, verifyOtp } from '../utils/sms_request';
import { decodeToken } from "../utils/jwt_service";
import forgotPasswordModel from "../models/forgot_password_model";
import { sendNotificationToUser } from "../utils/push_notification_util";

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
    const token = jwt.sign({ userId: user._id, name: user.firstName }, jwtSecret);
    const sortedUser = Object.fromEntries(
      Object.entries(user.toObject()).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );
    sendWelcomeEmail(email, "9lifeBookings", firstName);
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
      const token = jwt.sign({ userId: user._id, name: user.firstName }, jwtSecret);
      sendNotificationToUser(
        "Welcome Back to 9LifeBookings!",
        `Hi ${user.firstName}, we're thrilled to have you back. Let's make your experience amazing! 🚀`,
        user._id.toString()
      );
      return res.status(200).json({ data: user, message: "Login successful", token });
    }
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};


export const requestEmailOtp = async (req: Request, res: Response): Promise<any> => {
  try {
    const accessToken = decodeToken(req.headers.authorization!);
    if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
      const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
      const user = payload.name;
      const { email } = req.body;
      await otpModel.deleteMany({ email, status: "unused" });
      const otp = Math.floor(1000 + Math.random() * 9000);
      await otpModel.create({ email, code: otp });
      sendVerifyEmailOtp(email, "OTP", otp, user);
      return res.status(200).json({ message: "Request sent" });
    }
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
    const response = await otpModel.findOne({ email, code: otp });
    if (response) {
      if (isExpired(response.createdAt.toString())) {
        await otpModel.deleteOne({ email: email, code: otp });
        return res.status(400).json({ error: "Otp has expired, send another" })
      }
      await otpModel.deleteOne({ email, code: otp });
      const user = await UserModel.findOneAndUpdate({ email }, { emailVerified: true }, { new: true });
      return res.status(200).json({ message: "Email verified Successfully", data: user });
    } else {
      return res.status(400).json({ error: "Invalid code sent" });
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

export const verifyPhone = async (req: Request, res: Response): Promise<any> => {
  try {
    const { pinId, pin, newPhoneNumber } = req.body;
    const accessToken = decodeToken(req.headers.authorization!);
    if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
      const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
      const user_id = payload.userId;
      const result = await verifyOtp(pinId, pin);
      if (result.verified) {
        const updatePhoneNumber = await UserModel.findOneAndUpdate(
          { _id: user_id }, // Find the user by their unique ID
          { "profile.phone": newPhoneNumber }, // Update the phone field
          { new: true } // Return the updated document
        );
        if(updatePhoneNumber){
          return res.status(200).json({ message: "Phone Verified successfully", data: updatePhoneNumber });
        }else{
          return res.status(400).json({ error: "An Error occured when updating your phone number", data: result });
        }
      } else {
        return res.status(400).json({ error: "Incorrect Pin", data: result });
      }
    }
  } catch (e) {
    res.status(500).json({ error: e });
  }
};



export const updateProfilePic = async (req: Request, res: Response): Promise<any> => {
  try {
    const { imageUrl, id } = req.body;
    const user = await UserModel.findOneAndUpdate({ _id: id }, { picture: imageUrl }, { new: true });
    if (user) {
      const sortedUser = Object.fromEntries(
        Object.entries(user.toObject()).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      );
      return res.status(200).json({ message: "Profile Picture Updated Successfully", data: sortedUser })
    }
    return res.status(400).json({ message: "Unable to process your request" })
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

export const updateFirebaseToken = async (req: Request, res: Response): Promise<any> => {
  try {
    const accessToken = decodeToken(req.headers.authorization!);
    if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
      const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
      const user_id = payload.userId;
      const { fcmToken } = req.body;
      const user = await UserModel.findOneAndUpdate({ _id: user_id }, { fcmToken: fcmToken }, { new: true });
      if (user) {
        return res.status(200).json({ message: "Firebase Token Updated Successfully" })
      }
    }
    return res.status(400).json({ message: "Unable to process your request" })
  } catch (e) {
    res.status(500).json({ error: e });
  }
}


//Forgot Password
export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    const checkUser = await UserModel.findOne({ email });
    if (checkUser) {
      const otp = Math.floor(1000 + Math.random() * 9000);
      const createRequest = await forgotPasswordModel.create({
        email,
        otp,
      });
      createRequest.save();
      sendEmailOtp(email, "OTP", otp);
      const token = jwt.sign({ email }, jwtSecret);
      return res
        .status(200)
        .json({
          data: createRequest,
          message: "Forgot password request has been sent",
          token,
        });
    }
    return res.status(400).json({ error: "User does not exists" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" }); // Provide a generic error message
  }
};

export const confirmPasswordOTP = async (req: Request, res: Response): Promise<any> => {
  try {
    const { otp } = req.body;
    const accessToken = decodeToken(req.headers.authorization!);
    if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
      const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
      const email = payload.email;
      const checkOtp = await forgotPasswordModel.findOne({ otp, email });
      if (checkOtp) {
        if (isExpired(checkOtp.createdAt.toString())) {
          await forgotPasswordModel.deleteOne({ email, otp });
          return res
            .status(400)
            .json({ error: "Otp has expired, send another" });
        }
        await forgotPasswordModel.deleteOne({ email, code: otp });
        return res.status(200).json({ message: "Otp has been confirmed" });
      }
      return res.status(400).json({ error: "Code is not correct" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" }); // Provide a generic error message
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { password } = req.body;
    const accessToken = decodeToken(req.headers.authorization!);
    if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
      const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
      const email = payload.email;
      const hashedPassword = await argon2.hash(password.toString());
      const resetPassword = await UserModel.findOneAndUpdate(
        { email },
        { password: hashedPassword }
      ); if (resetPassword) {
        return res
          .status(200)
          .json({ message: "Your password has been reset" });
      } else {
        return res.status(400).json({ error: "Password reset failed" });
      }
    }
    return res
      .status(400)
      .json({ error: "An error occurred while processing your request" });
  } catch (e) {

    console.error(e);
    res.status(500).json({ error: "Internal server error" }); // Provide a generic error message
  }
};


export const changePassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { password, newPassword } = req.body;
    const accessToken = decodeToken(req.headers.authorization!);
    if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
      const payload = accessToken.payload as JwtPayload; // Cast to JwtPayload
      const userId = payload.userId;
      //Check if user exists
      const userDetails = await UserModel.findById(userId);
      //Check if password is valid
      const doesPasswordExist = await argon2.verify(userDetails?.password!, password);
      if (!doesPasswordExist) {
        console.log(doesPasswordExist);
        return res.status(400).json({ error: "Password entered is not correct" });
      }
      //Encrypt Entered Passwords
      const hashedPassword = await argon2.hash(password.toString());
      const hashedNewPassword = await argon2.hash(newPassword.toString());

      console.log(userDetails?.email!);
      console.log(userDetails?.password! + " " + hashedPassword);
      //Change Users Password
      const resetPassword = await UserModel.findOneAndUpdate(
        { email: userDetails?.email! },
        { password: hashedNewPassword }
      );
      if (resetPassword) {
        return res
          .status(200)
          .json({ message: "Your password has been reset" });
      } else {
        return res.status(400).json({ error: "Failed to change your password." });
      }
    }
    return res
      .status(400)
      .json({ error: "An error occurred while processing your request" });
  } catch (e) {

    console.error(e);
    res.status(500).json({ error: "Internal server error" }); // Provide a generic error message
  }
};

