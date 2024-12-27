import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        let uploadDir = '../uploads/';

        if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
            uploadDir += 'images/';
          } else if (['application/pdf', 'text/plain'].includes(file.mimetype)) {
            uploadDir += 'documents/';
          } else {
            uploadDir += 'others/';
          }
        
        // Check if directory exists, if not create it
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        cb(null, `${new Date().toISOString()}-` + file.originalname);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
        cb(null, true);
    } else {
        // reject file
        cb(new Error('Unsupported file format') as unknown as null, false);
    }
};

const multer_upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 },
    //fileFilter
});

export default multer_upload;
