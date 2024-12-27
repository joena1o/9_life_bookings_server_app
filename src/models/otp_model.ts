import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "unused",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

const otpModel = mongoose.model("otp_store", otpSchema);
export default otpModel;
