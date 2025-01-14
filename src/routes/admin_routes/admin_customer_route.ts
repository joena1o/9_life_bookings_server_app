import {Router} from 'express';
import authenticateToken from '../../middleware/authenticate_token';
import checkIfAdmin from '../../middleware/validate_admin';
import * as  CustomerController from '../../controllers/admin_controller/customer.controller';


const router = Router();

router.get("/", authenticateToken, checkIfAdmin, CustomerController.fetchCustomers);


export default router;