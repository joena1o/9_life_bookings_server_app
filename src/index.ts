import express, { Request, Response } from 'express';
import cors from 'cors';
import connectToDb from './database/db';
import ImageRoute from './routes/image.route';
import UserRoute from './routes/user.route';
import ProductRoute from './routes/product.routes';
import RatingRoute from './routes/rating.route';
import BookmarkRoute from './routes/bookmark.route';
import BankingDetailsRoute  from './routes/bank_account.route';
import { createHmac } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Middleware
app.use(cors());
app.use(express.json());

connectToDb();

app.use("/image", ImageRoute);
app.use("/user", UserRoute);
app.use("/product", ProductRoute);
app.use("/rating", RatingRoute);
app.use("/bookmark", BookmarkRoute);
app.use("/banking", BankingDetailsRoute);

app.post('/webhook', (req: Request, res: Response) => {
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

      // Perform necessary actions:
      // - Update database
      // - Send email notifications
      // - Fulfill orders, etc.
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
