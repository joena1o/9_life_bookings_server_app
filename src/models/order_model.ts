import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
 merchantId: {
    type: String,
    required: true
  },  
  userId: {
    type: String,
    required: true,
    ref: "user"
  },
  purchaseType: {
    type: String,
    required: true,
    enum: ['purchase', 'booking'],
  },
  productId: {
    type: String,
    required: true,
    ref: "product"
  },
  startBookingDate: {
    type: String,
    default: null
  },
  endBookingDate: {
    type: String,
    default: null
  },
  quantity: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    default: null,
  },
  amount: {
    type: Number,
    required: true,
  },
}, {timestamps: true});

const OrderModel = mongoose.model("order", orderSchema);
export default OrderModel;
