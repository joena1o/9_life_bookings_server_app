import { Router } from "express";
import * as BookMarkController from '../controllers/bookmark.controller';
import authenticateToken from "../middleware/authenticate_token";


const router = Router();

router.post("/", authenticateToken, BookMarkController.bookmarkItem);
router.get("/", authenticateToken, BookMarkController.getUsersBookmarks);

export default router;
