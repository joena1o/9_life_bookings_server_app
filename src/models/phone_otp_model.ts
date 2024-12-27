import mongoose from "mongoose";

const phoneOtpSchema = new mongoose.Schema({
  phone: {
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

const phoneOtpModel = mongoose.model("phone_otp_store", phoneOtpSchema);
export default phoneOtpModel;
