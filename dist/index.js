"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./database/db"));
const image_route_1 = __importDefault(require("./routes/image.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const rating_route_1 = __importDefault(require("./routes/rating.route"));
const bookmark_route_1 = __importDefault(require("./routes/bookmark.route"));
const bank_account_route_1 = __importDefault(require("./routes/bank_account.route"));
const admin_customer_route_1 = __importDefault(require("./routes/admin_routes/admin_customer_route"));
const admin_dashboard_route_1 = __importDefault(require("./routes/admin_routes/admin_dashboard_route"));
const admin_product_route_1 = __importDefault(require("./routes/admin_routes/admin_product_route"));
const admin_auth_route_1 = __importDefault(require("./routes/admin_routes/admin_auth_route"));
const admin_order_route_1 = __importDefault(require("./routes/admin_routes/admin_order_route"));
const crypto_1 = require("crypto");
const dotenv_1 = __importDefault(require("dotenv"));
const order_model_1 = __importDefault(require("./models/order_model"));
const push_notification_util_1 = require("./utils/push_notification_util");
const product_model_1 = __importDefault(require("./models/product_model"));
const notification_model_1 = __importDefault(require("./models/notification_model"));
const authenticate_token_1 = __importDefault(require("./middleware/authenticate_token"));
const validate_admin_1 = __importDefault(require("./middleware/validate_admin"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.default)();
//User Routes
app.use("/image", image_route_1.default);
app.use("/user", user_route_1.default);
app.use("/product", product_routes_1.default);
app.use("/rating", rating_route_1.default);
app.use("/bookmark", bookmark_route_1.default);
app.use("/banking", bank_account_route_1.default);
app.use("/notifications", notification_routes_1.default);
//Admin Routes
app.use("/admin", admin_auth_route_1.default);
app.use("/admin/customers", admin_customer_route_1.default);
app.use("/admin/dashboard", admin_dashboard_route_1.default);
app.use("/admin/product", admin_product_route_1.default);
app.use("/admin/sales", authenticate_token_1.default, validate_admin_1.default, admin_order_route_1.default);
app.post('/webhook', async (req, res) => {
    try {
        // Retrieve the Paystack signature from headers
        const signature = req.headers['x-paystack-signature'];
        if (!signature) {
            console.error('Missing Paystack signature');
            return res.status(400).send('Missing signature'); // Add return
        }
        const hash = (0, crypto_1.createHmac)('sha512', process.env.TEST_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');
        if (hash !== signature) {
            console.error('Invalid Paystack signature');
            return res.status(401).send('Unauthorized'); // Add return
        }
        // Process the event
        const event = req.body;
        console.log('Event received:', event);
        if (event.event === 'charge.success') {
            const transactionData = event.data;
            const { metadata, amount } = transactionData;
            if (metadata) {
                const { merchantId, userId, productId, quantity, user, purchaseType, startBookingDate, endBookingDate, merchantName, note } = metadata;
                let submitOrder = new order_model_1.default({
                    merchantId,
                    userId,
                    productId,
                    amount,
                    note,
                    quantity,
                    startBookingDate,
                    endBookingDate,
                    purchaseType
                });
                await submitOrder.save(); // Middleware will encrypt "disbursed"
                if (submitOrder) {
                    await product_model_1.default.findOneAndUpdate({ _id: productId, quantity: { $gte: quantity } }, { $inc: { rentedQuantity: quantity, quantity: -quantity } });
                    (0, push_notification_util_1.sendNotificationToUser)("Your property has been bought", `Hi ${merchantName}, we're thrilled to let you know. Your property has been booked 🚀`, merchantId.toString());
                    (0, push_notification_util_1.sendNotificationToUser)("Your payment has been confirmed", `Hi ${user}, we're thrilled to let you know. Your payment for this property has been confirmed. 🚀`, userId.toString());
                    await notification_model_1.default.create({
                        user_id: merchantId.toString(),
                        product_id: productId,
                        noticeType: 'sale',
                        message: `Hi ${merchantName}, we're thrilled to let you know. Your property has been booked 🚀`,
                        title: "Your property has been bought",
                    });
                    await notification_model_1.default.create({
                        user_id: userId.toString(),
                        product_id: productId,
                        noticeType: 'purchase',
                        message: `Hi ${user}, we're thrilled to let you know. Your payment for this property has been confirmed. 🚀`,
                        title: "Your payment has been confirmed",
                    });
                }
            } // Perform necessary actions:
        }
        else {
            res.status(200).send('Transfer not successful');
        }
        res.status(200).send('Webhook received');
    }
    catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Sample route
app.get('/', async (req, res) => {
    res.send('Hello, Server app is running');
});
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
