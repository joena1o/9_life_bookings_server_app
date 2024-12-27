import express, { Request, Response } from 'express';
import cors from 'cors';
import connectToDb from './database/db';
import ImageRoute from './routes/image.route';
import UserRoute from './routes/user.route';
import ProductRoute from './routes/product.routes';
import RatingRoute from './routes/rating.route';

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

// Sample route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Node.js with TypeScript!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
