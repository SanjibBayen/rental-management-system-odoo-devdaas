import { Router } from 'express';
import multer from 'multer';
import { uploadToCloudinary } from '../utils/cloudinary';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';

const router = Router();

// Configure multer to store in memory (temporary)
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/upload/product
router.post(
  '/product',
  authMiddleware,
  rbacMiddleware(['admin']),
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Convert buffer to base64
      const base64 = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(dataUri, 'rentals/products');

      res.json({
        success: true,
        data: { imageUrl },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// POST /api/upload/avatar
router.post(
  '/avatar',
  authMiddleware,
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const base64 = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;

      const avatarUrl = await uploadToCloudinary(dataUri, 'rentals/avatars');

      // Update user profile with avatar URL
      const user = (req as any).user;
      await query(
        `UPDATE user_profiles SET avatar_url = $1 WHERE id = $2`,
        [avatarUrl, user.id]
      );

      res.json({
        success: true,
        data: { avatarUrl },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export { router as uploadRoutes };