import * as ProductController from '../controllers/product.controller';
import {getBookingAvailability} from '../controllers/orders.controller';
import { Router } from 'express';
import authenticateToken from '../middleware/authenticate_token';

const router = Router();

router.post("/", authenticateToken, ProductController.addProduct);
router.get("/", authenticateToken, ProductController.getProducts);
router.get('/getBookings/:productId', authenticateToken, getBookingAvailability);
router.get("/search", authenticateToken, ProductController.searchAndFilterProducts);
router.get("/users", authenticateToken, ProductController.getUsersProducts);
router.get("/:id", authenticateToken, ProductController.getProduct);
router.patch("/", authenticateToken, ProductController.editProduct);
router.delete("/", authenticateToken, ProductController.deleteProduct);

export default router;
