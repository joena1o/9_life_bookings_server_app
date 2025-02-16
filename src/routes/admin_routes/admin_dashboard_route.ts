import {Router} from 'express';
import authenticateToken from '../../middleware/authenticate_token';
import * as DashboardController from '../../controllers/admin_controller/admin.dashboard.controller';
import checkIfAdmin from '../../middleware/validate_admin';

const router = Router();

router.get("/count", authenticateToken, checkIfAdmin, DashboardController.numberCounts);
router.get("/orders", authenticateToken, checkIfAdmin, DashboardController.fetchCustomersOrders);
router.get("/sales-by-week", authenticateToken, checkIfAdmin, DashboardController.fetchSalesChartReport);

export default router;