import { Router } from "express";
import * as UserController from '../controllers/user_auth.controller';
import authenticateToken from "../middleware/authenticate_token";
import * as OrderController from '../controllers/orders.controller';

const router = Router();

router.post('/sign-up', UserController.createUserManualSignUp);
router.post('/login', UserController.LoginUser);
router.post('/sign-up-google', UserController.createUserGoogleSignUp);
router.post('/login-google', UserController.LoginUserGoogle);
//Email Verification
router.post('/request-otp', UserController.requestEmailOtp);
router.post('/verify-email', authenticateToken, UserController.verifyEmail);
//Phone Verification
router.post('/request-sms-otp',  UserController.sendPhoneOtp);
router.post('/verify-phone',  UserController.verifyPhone);
//Profile Update
router.post("/update-profile", authenticateToken, UserController.updateProfilePic);
router.patch("/firebase-token", authenticateToken, UserController.updateFirebaseToken);
//Forgotten Password
router.post("/forgot-password", UserController.forgotPassword);
router.post("/confirm-password-otp", authenticateToken, UserController.confirmPasswordOTP);
router.patch("/reset-password", authenticateToken, UserController.resetPassword);
//Change Password
router.patch("/change-password", authenticateToken, UserController.changePassword);
//User's Order
router.get("/orders", authenticateToken, OrderController.fetchCustomerOrders);

export default router;