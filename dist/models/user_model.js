"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    googleId: { type: String, unique: true, sparse: true }, // For Google-authenticated users
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String }, // Only manual sign-up users will have this
    picture: { type: String, default: null },
    referralCode: { type: String, default: null },
    privileges: { type: String, default: "user" },
    emailVerified: { type: Boolean, default: false },
    phoneNumber: { type: Boolean, default: false },
    suspended: { type: Boolean, default: false },
    profile: {
        address: { type: String, default: null },
        dateOfBirth: { type: String, default: null },
        phone: { type: String, default: null }
    },
    location: {
        coordinates: {
            type: [Number],
            index: "2dsphere",
            default: []
        }
    },
    account_id: { type: String, default: null, ref: "SubAccount" },
    sub_account: { type: String, default: null },
    fcmToken: { type: String, default: null }
});
const UserModel = mongoose_1.default.model("user", UserSchema);
exports.default = UserModel;
