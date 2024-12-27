import { Router } from "express";
import * as UserController from '../controllers/user_auth.controller';
import authenticateToken from "../middleware/authenticate_token";

const router = Router();

router.post('/sign-up', UserController.createUserManualSignUp);
router.post('/login', UserController.LoginUser);
//Email Verification
router.post('/request-otp', UserController.sendEmailOtp);
router.post('/verify-email', authenticateToken, UserController.verifyEmail);
//Phone Verification
router.post('/request-sms-otp',  UserController.sendPhoneOtp);
router.post('/verify-phone',  UserController.verifyPhone);
//Profile Update
router.post("/update-profile", authenticateToken, UserController.updateProfilePic);

export default router;