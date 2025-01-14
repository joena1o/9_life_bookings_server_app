import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
 merchantId: {
    type: String,
    required: true
  },  
  userId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
    ref: "product"
  },
  amount: {
    type: Number,
    required: true,
  },


}, {timestamps: true});

const OrderModel = mongoose.model("order", orderSchema);
export default OrderModel;
