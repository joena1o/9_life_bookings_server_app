"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = __importDefault(require("cloudinary"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure Cloudinary
cloudinary_1.default.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const cloudinary_upload = (file, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.default.v2.uploader.upload(file, {
            resource_type: 'raw',
            folder: folder,
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve({
                    url: result?.url || '',
                    id: result?.public_id || '',
                });
            }
        });
    });
};
const uploadImage = async (req, res) => {
    try {
        const uploader = async (path, folder) => {
            return await cloudinary_upload(path, folder);
        };
        if (req.method === 'POST') {
            const urls = [];
            const files = req.files; // Type assertion for req.files
            for (const file of files) {
                const { path, mimetype } = file;
                // Dynamically decide folder based on MIME type
                let folder = 'Others'; // Default folder
                if (['image/jpeg', 'image/png', 'image/jpg'].includes(mimetype)) {
                    folder = 'Images';
                }
                else if (['application/pdf', 'text/plain'].includes(mimetype)) {
                    folder = 'Documents';
                }
                const newPath = await uploader(path, folder);
                urls.push(newPath);
                // Delete the file locally after uploading to Cloudinary
                fs_1.default.unlinkSync(path);
            }
            res.status(200).json({
                message: 'Images uploaded successfully',
                data: urls,
            });
        }
        else {
            res.status(405).json({
                err: `${req.method} method not allowed`,
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error uploading images' });
    }
};
exports.default = uploadImage;
