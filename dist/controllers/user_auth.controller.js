"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.confirmPasswordOTP = exports.forgotPassword = exports.updateFirebaseToken = exports.updateProfilePic = exports.verifyPhone = exports.verifyEmail = exports.sendPhoneOtp = exports.requestEmailOtp = exports.LoginUserGoogle = exports.LoginUser = exports.createUserGoogleSignUp = exports.createUserManualSignUp = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const argon2_1 = __importDefault(require("argon2"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user_model"));
const otp_model_1 = __importDefault(require("../models/otp_model"));
const time_util_1 = require("../utils/time_util");
const email_request_1 = require("../utils/email_request");
const sms_request_1 = require("../utils/sms_request");
const jwt_service_1 = require("../utils/jwt_service");
const forgot_password_model_1 = __importDefault(require("../models/forgot_password_model"));
dotenv_1.default.config();
const jwtSecret = process.env.JWT_SECRET;
const createUserManualSignUp = async (req, res) => {
    const { email, password, firstName, picture, lastName, referralCode, privileges } = req.body;
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
            privileges,
            password: hashedPassword,
            picture,
            referralCode,
        });
        const token = jsonwebtoken_1.default.sign({ userId: user._id, name: user.firstName }, jwtSecret);
        const sortedUser = Object.fromEntries(Object.entries(user.toObject()).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)));
        (0, email_request_1.sendWelcomeEmail)(email, "9lifeBookings", firstName);
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
const createUserGoogleSignUp = async (req, res) => {
    const { email, googleId, firstName, picture, lastName, referralCode, privileges } = req.body;
    try {
        let user = await user_model_1.default.findOne({ email: email });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }
        const hashedgoogleId = await argon2_1.default.hash(googleId.toString());
        user = await user_model_1.default.create({
            firstName,
            lastName,
            email,
            googleId: hashedgoogleId,
            privileges,
            picture,
            referralCode,
        });
        const token = jsonwebtoken_1.default.sign({ userId: user._id, name: user.firstName }, jwtSecret);
        const sortedUser = Object.fromEntries(Object.entries(user.toObject()).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)));
        (0, email_request_1.sendWelcomeEmail)(email, "9lifeBookings", firstName);
        return res
            .status(201)
            .json({ data: sortedUser, message: "User registered successfully", token });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};
exports.createUserGoogleSignUp = createUserGoogleSignUp;
const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        if (user.suspended == true) {
            return res.status(400).json({ error: "Your account has been suspend, Please contact services" });
        }
        if (user.googleId && !user.password) {
            return res
                .status(400)
                .json({ error: "The credentials you entered are incorrect. Please try again or use Google to sign in."
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
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        if (user.suspended == true) {
            return res.status(400).json({ error: "Your account has been suspend, Please contact service" });
        }
        if (!user.googleId && user.password) {
            return res
                .status(400)
                .json({ error: "We detected an existing account with this email. Please log in using your email and password" });
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
const requestEmailOtp = async (req, res) => {
    try {
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const user = payload.name;
            const { email } = req.body;
            await otp_model_1.default.deleteMany({ email, status: "unused" });
            const otp = Math.floor(1000 + Math.random() * 9000);
            await otp_model_1.default.create({ email, code: otp });
            (0, email_request_1.sendVerifyEmailOtp)(email, "OTP", otp, user);
            return res.status(200).json({ message: "Request sent" });
        }
    }
    catch (e) {
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};
exports.requestEmailOtp = requestEmailOtp;
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
            const user = await user_model_1.default.findOneAndUpdate({ email }, { emailVerified: true }, { new: true });
            return res.status(200).json({ message: "Email verified Successfully", data: user });
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
        const { pinId, pin, newPhoneNumber } = req.body;
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const user_id = payload.userId;
            const result = await (0, sms_request_1.verifyOtp)(pinId, pin);
            if (result.verified) {
                const updatePhoneNumber = await user_model_1.default.findOneAndUpdate({ _id: user_id }, // Find the user by their unique ID
                { "profile.phone": newPhoneNumber }, // Update the phone field
                { new: true } // Return the updated document
                );
                if (updatePhoneNumber) {
                    return res.status(200).json({ message: "Phone Verified successfully", data: updatePhoneNumber });
                }
                else {
                    return res.status(400).json({ error: "An Error occured when updating your phone number", data: result });
                }
            }
            else {
                return res.status(400).json({ error: "Incorrect Pin", data: result });
            }
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
        const user = await user_model_1.default.findOneAndUpdate({ _id: id }, { picture: imageUrl }, { new: true });
        if (user) {
            const sortedUser = Object.fromEntries(Object.entries(user.toObject()).sort(([keyA], [keyB]) => keyA.localeCompare(keyB)));
            return res.status(200).json({ message: "Profile Picture Updated Successfully", data: sortedUser });
        }
        return res.status(400).json({ message: "Unable to process your request" });
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
};
exports.updateProfilePic = updateProfilePic;
const updateFirebaseToken = async (req, res) => {
    try {
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const user_id = payload.userId;
            const { fcmToken } = req.body;
            const user = await user_model_1.default.findOneAndUpdate({ _id: user_id }, { fcmToken: fcmToken }, { new: true });
            if (user) {
                return res.status(200).json({ message: "Firebase Token Updated Successfully" });
            }
        }
        return res.status(400).json({ message: "Unable to process your request" });
    }
    catch (e) {
        res.status(500).json({ error: e });
    }
};
exports.updateFirebaseToken = updateFirebaseToken;
//Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const checkUser = await user_model_1.default.findOne({ email });
        if (checkUser) {
            const otp = Math.floor(1000 + Math.random() * 9000);
            const createRequest = await forgot_password_model_1.default.create({
                email,
                otp,
            });
            createRequest.save();
            (0, email_request_1.sendEmailOtp)(email, "OTP", otp);
            const token = jsonwebtoken_1.default.sign({ email }, jwtSecret);
            return res
                .status(200)
                .json({
                data: createRequest,
                message: "Forgot password request has been sent",
                token,
            });
        }
        return res.status(400).json({ error: "User does not exists" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" }); // Provide a generic error message
    }
};
exports.forgotPassword = forgotPassword;
const confirmPasswordOTP = async (req, res) => {
    try {
        const { otp } = req.body;
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const email = payload.email;
            const checkOtp = await forgot_password_model_1.default.findOne({ otp, email });
            if (checkOtp) {
                if ((0, time_util_1.isExpired)(checkOtp.createdAt.toString())) {
                    await forgot_password_model_1.default.deleteOne({ email, otp });
                    return res
                        .status(400)
                        .json({ error: "Otp has expired, send another" });
                }
                await forgot_password_model_1.default.deleteOne({ email, code: otp });
                return res.status(200).json({ message: "Otp has been confirmed" });
            }
            return res.status(400).json({ error: "Code is not correct" });
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" }); // Provide a generic error message
    }
};
exports.confirmPasswordOTP = confirmPasswordOTP;
const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const email = payload.email;
            const hashedPassword = await argon2_1.default.hash(password.toString());
            const resetPassword = await user_model_1.default.findOneAndUpdate({ email }, { password: hashedPassword });
            if (resetPassword) {
                return res
                    .status(200)
                    .json({ message: "Your password has been reset" });
            }
            else {
                return res.status(400).json({ error: "Password reset failed" });
            }
        }
        return res
            .status(400)
            .json({ error: "An error occurred while processing your request" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" }); // Provide a generic error message
    }
};
exports.resetPassword = resetPassword;
const changePassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;
        const accessToken = (0, jwt_service_1.decodeToken)(req.headers.authorization);
        if (accessToken && typeof accessToken !== "string" && accessToken.payload) {
            const payload = accessToken.payload; // Cast to JwtPayload
            const userId = payload.userId;
            //Check if user exists
            const userDetails = await user_model_1.default.findById(userId);
            //Check if password is valid
            const doesPasswordExist = await argon2_1.default.verify(userDetails?.password, password);
            if (!doesPasswordExist) {
                console.log(doesPasswordExist);
                return res.status(400).json({ error: "Password entered is not correct" });
            }
            //Encrypt Entered Passwords
            const hashedPassword = await argon2_1.default.hash(password.toString());
            const hashedNewPassword = await argon2_1.default.hash(newPassword.toString());
            console.log(userDetails?.email);
            console.log(userDetails?.password + " " + hashedPassword);
            //Change Users Password
            const resetPassword = await user_model_1.default.findOneAndUpdate({ email: userDetails?.email }, { password: hashedNewPassword });
            if (resetPassword) {
                return res
                    .status(200)
                    .json({ message: "Your password has been reset" });
            }
            else {
                return res.status(400).json({ error: "Failed to change your password." });
            }
        }
        return res
            .status(400)
            .json({ error: "An error occurred while processing your request" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" }); // Provide a generic error message
    }
};
exports.changePassword = changePassword;
