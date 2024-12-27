import { Request, Response } from 'express';
import cloudinary from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  url: string;
  id: string;
}

const cloudinary_upload = (file: string, folder: string): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      {
        resource_type: 'raw',
        folder: folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result?.url || '',
            id: result?.public_id || '',
          });
        }
      }
    );
  });
};

const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {

    const uploader = async (path: string, folder: string): Promise<CloudinaryUploadResult> => {
      return await cloudinary_upload(path, folder);
    };

    if (req.method === 'POST') {
      const urls: CloudinaryUploadResult[] = [];
      const files = req.files as Express.Multer.File[]; // Type assertion for req.files

      for (const file of files) {
        const { path, mimetype } = file;

        // Dynamically decide folder based on MIME type
        let folder = 'Others'; // Default folder
        if (['image/jpeg', 'image/png', 'image/jpg'].includes(mimetype)) {
          folder = 'Images';
        } else if (['application/pdf', 'text/plain'].includes(mimetype)) {
          folder = 'Documents';
        }

        const newPath = await uploader(path, folder);
        urls.push(newPath);

        // Delete the file locally after uploading to Cloudinary
        fs.unlinkSync(path);
        
      }
      res.status(200).json({
        message: 'Images uploaded successfully',
        data: urls,
      });
    } else {
      res.status(405).json({
        err: `${req.method} method not allowed`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error uploading images' });
  }
};

export default uploadImage;
