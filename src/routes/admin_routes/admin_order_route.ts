import {Router} from 'express';
import * as AdminOrderController from '../../controllers/admin_controller/admin.order.controller'; 

const router = Router();

router.get("/sales-order", AdminOrderController.getSalesOrder);

export default router;