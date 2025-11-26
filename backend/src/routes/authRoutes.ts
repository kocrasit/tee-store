import express from 'express';
import { registerUser, loginUser, logoutUser, updateProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.put('/profile', protect, updateProfile);

export default router;

