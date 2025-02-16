import OrderModel from "../models/order_model";
import cron from "node-cron";
import ProductModel from "../models/product_model";


export const startExpiredBookingCron = () => {
    // Run every hour
    cron.schedule("0 * * * *", async () => {
        console.log("Running cron job: Checking expired bookings...");

        try {

            const now = new Date();

            // Find all orders where endBookingDate has passed
            const expiredOrders = await OrderModel.find({
                endBookingDate: { $ne: null, $lte: now }, // Check if date exists & has elapsed
            });

            if (expiredOrders.length === 0) {
                console.log("No expired bookings found.");
                return;
            }

            for (const order of expiredOrders) {
                const product = await ProductModel.findById(order.productId);
                if (!product) continue;

                product.rentedQuantity = Math.max(0, product.rentedQuantity - order.quantity);
                product.quantity += order.quantity;

                await product.save();
                console.log(`Updated Product ${order.productId}: Decreased rentedQuantity & increased quantity.`);
            }

            console.log("Expired bookings processed successfully.");
        } catch (error) {
            console.error("Error processing expired bookings:", error);
        }
    });

    console.log("✅ Expired booking cron job scheduled.");
};