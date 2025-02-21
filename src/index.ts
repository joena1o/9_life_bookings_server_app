import express, { Request, Response } from 'express';
import cors from 'cors';
import connectToDb from './database/db';
import ImageRoute from './routes/image.route';
import UserRoute from './routes/user.route';
import ProductRoute from './routes/product.routes';
import NotificationRoute from './routes/notification.routes';
import RatingRoute from './routes/rating.route';
import BookmarkRoute from './routes/bookmark.route';
import BankingDetailsRoute  from './routes/bank_account.route';
import AdminCustomerRoute from './routes/admin_routes/admin_customer_route';
import AdminDashboardRoute from './routes/admin_routes/admin_dashboard_route';
import AdminProductRoute from './routes/admin_routes/admin_product_route';
import AdminAuthRoute from './routes/admin_routes/admin_auth_route';
import AdminOrderRoute from './routes/admin_routes/admin_order_route';
import { createHmac } from 'crypto';
import dotenv from 'dotenv';
import OrderModel from './models/order_model';
import { sendNotificationToUser } from './utils/push_notification_util';
import ProductModel from './models/product_model';
import notificationModel from './models/notification_model';
import authenticateToken from './middleware/authenticate_token';
import checkIfAdmin from './middleware/validate_admin';
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors());
app.use(express.json());

connectToDb();

//User Routes
app.use("/image", ImageRoute);
app.use("/user", UserRoute);
app.use("/product", ProductRoute);
app.use("/rating", RatingRoute);
app.use("/bookmark", BookmarkRoute);
app.use("/banking", BankingDetailsRoute);
app.use("/notifications", NotificationRoute);

//Admin Routes
app.use("/admin", AdminAuthRoute);
app.use("/admin/customers", AdminCustomerRoute);
app.use("/admin/dashboard", AdminDashboardRoute);
app.use("/admin/product", AdminProductRoute);
app.use("/admin/sales", authenticateToken, checkIfAdmin, AdminOrderRoute);


app.post('/webhook', async (req: Request, res: Response) => {
  try {
    // Retrieve the Paystack signature from headers
    const signature = req.headers['x-paystack-signature'] as string;

    if (!signature) {
      console.error('Missing Paystack signature');
       res.status(400).send('Missing signature');
    }
    // Compute the HMAC hash using the secret key and request body
    const hash = createHmac('sha512', process.env.TEST_SECRET_KEY!)
      .update(JSON.stringify(req.body)) // Hash the stringified body
      .digest('hex'); // Convert hash to hexadecimal format

    // Compare the computed hash with the signature
    if (hash !== signature) {
      console.error('Invalid Paystack signature');
      res.status(401).send('Unauthorized');
    }
    // Process the event
    const event = req.body;
    console.log('Event received:', event);
    if (event.event === 'charge.success') {
      const transactionData = event.data;
      console.log('Transaction successful:', transactionData);
      const { metadata, amount } = transactionData;
      if (metadata) {
        const { merchantId, userId, productId, quantity, user, purchaseType, startBookingDate, endBookingDate, merchantName, note } = metadata;
        let submitOrder = new OrderModel({
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
        if(submitOrder){
        await ProductModel.findOneAndUpdate({ _id: productId, quantity: { $gte: quantity } }, { $inc: { rentedQuantity: quantity, quantity: -quantity}});
          sendNotificationToUser(
            "Your property has been bought",
            `Hi ${merchantName}, we're thrilled to let you know. Your property has been booked 🚀`,
            merchantId.toString()
          );
          sendNotificationToUser(
            "Your payment has been confirmed",
            `Hi ${user}, we're thrilled to let you know. Your payment for this property has been confirmed. 🚀`,
            userId.toString()
          );
          await notificationModel.create({
            user_id:  merchantId.toString(),
            product_id: productId,
            noticeType: 'sale',
            message: `Hi ${merchantName}, we're thrilled to let you know. Your property has been booked 🚀`,
            title:  "Your property has been bought",
          });
          await notificationModel.create({
            user_id:  userId.toString(),
            product_id: productId,
            noticeType: 'purchase',
            message:  `Hi ${user}, we're thrilled to let you know. Your payment for this property has been confirmed. 🚀`,
            title:  "Your payment has been confirmed",
          });
        }
      } // Perform necessary actions:
    }
    // Acknowledge the webhook event
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Sample route
app.get('/', async (req: Request, res: Response) =>  {
  res.send('Hello, Node.js with TypeScript!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
