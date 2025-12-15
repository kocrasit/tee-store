import express from 'express';
import * as bannerController from '../controllers/bannerController';
import { protect, checkRole } from '../middleware/authMiddleware';
import { designImageUpload } from '../middlewares/upload'; // Reusing image upload middleware

const router = express.Router();

router.get('/', bannerController.getPublicBanners);

// Admin routes
router.use(protect, checkRole(['admin']));

router.get('/admin', bannerController.getAllBanners);
router.post('/', designImageUpload.single('image'), bannerController.createBanner);
router.put('/:id', designImageUpload.single('image'), bannerController.updateBanner);
router.delete('/:id', bannerController.deleteBanner);

export default router;
