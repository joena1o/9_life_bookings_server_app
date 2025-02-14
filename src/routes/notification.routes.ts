import { Router } from "express";
import authenticateToken from "../middleware/authenticate_token";
import * as NotificationController from '../controllers/notification.controller';

const router = Router();

router.get("/", authenticateToken, NotificationController.getNotifications);

export default router;