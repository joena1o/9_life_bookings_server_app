import { Router } from "express";
import multer_upload from "../utils/multer_config";
import uploadImage from "../controllers/image.controller";

const router = Router();

router.post('/upload-image', multer_upload.array('image'), uploadImage);

export default router;