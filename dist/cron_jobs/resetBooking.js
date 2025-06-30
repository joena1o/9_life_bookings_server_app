"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startExpiredBookingCron = void 0;
const order_model_1 = __importDefault(require("../models/order_model"));
const node_cron_1 = __importDefault(require("node-cron"));
const product_model_1 = __importDefault(require("../models/product_model"));
const startExpiredBookingCron = () => {
    // Run every hour
    node_cron_1.default.schedule("0 * * * *", async () => {
        console.log("Running cron job: Checking expired bookings...");
        try {
            const now = new Date();
            // Find all orders where endBookingDate has passed
            const expiredOrders = await order_model_1.default.find({
                endBookingDate: { $ne: null, $lte: now }, // Check if date exists & has elapsed
            });
            if (expiredOrders.length === 0) {
                console.log("No expired bookings found.");
                return;
            }
            for (const order of expiredOrders) {
                const product = await product_model_1.default.findById(order.productId);
                if (!product)
                    continue;
                product.rentedQuantity = Math.max(0, product.rentedQuantity - order.quantity);
                product.quantity += order.quantity;
                await product.save();
                console.log(`Updated Product ${order.productId}: Decreased rentedQuantity & increased quantity.`);
            }
            console.log("Expired bookings processed successfully.");
        }
        catch (error) {
            console.error("Error processing expired bookings:", error);
        }
    });
    console.log("✅ Expired booking cron job scheduled.");
};
exports.startExpiredBookingCron = startExpiredBookingCron;
