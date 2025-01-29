import {Router} from 'express';
import * as AdminAuthController from '../../controllers/admin_controller/admin.auth.controller'; 

const router = Router();

router.post('/login', AdminAuthController.LoginUser);
router.post('/login-google', AdminAuthController.LoginUserGoogle);

export default router;