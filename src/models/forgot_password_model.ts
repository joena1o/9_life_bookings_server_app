import mongoose from "mongoose";

const forgotPasswordSchema = new mongoose.Schema({
  email: {type: String, required: true},
  otp: {type: String, required: true},
  status: {type: String, default: "unused"},
  createdAt: {type: Date, default: Date.now, expires: 3600}
});

const forgotPasswordModel = mongoose.model("forgot_password", forgotPasswordSchema);
export default forgotPasswordModel;