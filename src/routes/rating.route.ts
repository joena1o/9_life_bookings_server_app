import { Router } from "express";
import authenticateToken from "../middleware/authenticate_token";
import * as RatingController from '../controllers/rating.controller';

const router = Router();

router.post("/", authenticateToken, RatingController.addRating);
router.delete("/", authenticateToken, RatingController.deleteReview);

export default router;