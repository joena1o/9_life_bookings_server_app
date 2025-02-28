import {Router} from 'express';
import * as AdminOrderController from '../../controllers/admin_controller/admin.order.controller'; 
import * as BankController from '../../controllers/banking.controller';

const router = Router();

router.get("/sales-order", AdminOrderController.getSalesOrder);
router.post("/disburse-payment", BankController.initiateDisburseUsersFunds);
router.post("/finalize-payment", BankController.finalizeDisburseUsersFunds);


export default router;