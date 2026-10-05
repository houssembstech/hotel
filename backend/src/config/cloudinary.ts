import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import streamifier from 'streamifier';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary, ensuring it's stored inside the "hotel_pms" main folder
 * to avoid mixing with other projects.
 * 
 * @param fileBuffer The file buffer (e.g., from Multer)
 * @param subFolder Optional subfolder (e.g., 'rooms', 'guests_ids')
 * @returns Promise with Cloudinary upload result
 */
export const uploadToCloudinary = (fileBuffer: Buffer, subFolder: string = 'general'): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `hotel_pms/${subFolder}`, // ALL photos go into "hotel_pms/..."
        format: 'webp', // Optimize to WebP automatically
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export default cloudinary;
