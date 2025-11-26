import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { updateProfile, changePassword } from '../controllers/userController';

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

export default router;
