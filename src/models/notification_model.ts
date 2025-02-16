import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  product_id: {
    type: String,
    ref: "product",
    default: null
  },
  noticeType: {
    type: String,
    enum: ['notice','purchase','sale','review'],
    default: "notice"
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  extra: {
    type: String,
    default: null
  },
  read: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

const notificationModel = mongoose.model("notification", notificationSchema);
export default notificationModel;
