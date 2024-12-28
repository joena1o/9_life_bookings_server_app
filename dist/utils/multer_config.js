"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let uploadDir = './uploads/';
        if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
            uploadDir += 'images/';
        }
        else if (['application/pdf', 'text/plain'].includes(file.mimetype)) {
            uploadDir += 'documents/';
        }
        else {
            uploadDir += 'others/';
        }
        // Check if directory exists, if not create it
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Replace invalid characters in the timestamp
        const sanitizedTimestamp = new Date().toISOString().replace(/:/g, '-');
        cb(null, `${sanitizedTimestamp}-${file.originalname}`);
    }
});
const fileFilter = (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        // reject file
        cb(new Error('Unsupported file format'), false);
    }
};
const multer_upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    //fileFilter
});
exports.default = multer_upload;
