"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController = __importStar(require("../controllers/user_auth.controller"));
const authenticate_token_1 = __importDefault(require("../middleware/authenticate_token"));
const OrderController = __importStar(require("../controllers/orders.controller"));
const router = (0, express_1.Router)();
router.post('/sign-up', UserController.createUserManualSignUp);
router.post('/login', UserController.LoginUser);
router.post('/sign-up-google', UserController.createUserGoogleSignUp);
router.post('/login-google', UserController.LoginUserGoogle);
//Email Verification
router.post('/request-otp', UserController.requestEmailOtp);
router.post('/verify-email', authenticate_token_1.default, UserController.verifyEmail);
//Phone Verification
router.post('/request-sms-otp', UserController.sendPhoneOtp);
router.post('/verify-phone', UserController.verifyPhone);
//Profile Update
router.post("/update-profile", authenticate_token_1.default, UserController.updateProfilePic);
router.patch("/firebase-token", authenticate_token_1.default, UserController.updateFirebaseToken);
//Forgotten Password
router.post("/forgot-password", UserController.forgotPassword);
router.post("/confirm-password-otp", authenticate_token_1.default, UserController.confirmPasswordOTP);
router.patch("/reset-password", authenticate_token_1.default, UserController.resetPassword);
//Change Password
router.patch("/change-password", authenticate_token_1.default, UserController.changePassword);
//User's Order
router.get("/orders", authenticate_token_1.default, OrderController.fetchCustomerOrders);
exports.default = router;
