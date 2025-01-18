import {Router} from 'express';
import authenticateToken from '../../middleware/authenticate_token';
import checkIfAdmin from '../../middleware/validate_admin';
import * as AdminProductController from '../../controllers/admin_controller/admin.product.controller';


const router = Router();

router.delete("/delist", authenticateToken, checkIfAdmin, AdminProductController.delistProduct);

export default router;