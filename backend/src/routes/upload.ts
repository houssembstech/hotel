import { Router } from 'express';
import multer from 'multer';
import { uploadToCloudinary } from '../config/cloudinary';

const router = Router();

// Store files in memory so we can upload a stream to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/upload
// The client will send FormData with a 'photo' field
router.post('/', upload.single('photo'), async (req, res): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo provided' });
    }

    // You can pass the subfolder as a query param or body field (e.g. ?type=rooms)
    const type = req.query.type || req.body.type || 'general';

    // Upload to Cloudinary inside "hotel_pms/<type>"
    const result = await uploadToCloudinary(req.file.buffer, type as string);

    // Return the specific Cloudinary URL back
    return res.status(200).json({
      message: 'Upload successful',
      url: result.secure_url,
      format: result.format,
      publicId: result.public_id,
    });
  } catch (error: any) {
    console.error('Cloudinary Upload Error:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
});

export default router;
