import * as ProductController from '../controllers/product.controller';
import { Router } from 'express';
import authenticateToken from '../middleware/authenticate_token';

const router = Router();

router.post("/", authenticateToken, ProductController.addProduct);
router.get("/", authenticateToken, ProductController.getProducts);
router.patch("/", authenticateToken, ProductController.editProduct);
router.delete("/", authenticateToken, ProductController.deleteProduct);

export default router;
