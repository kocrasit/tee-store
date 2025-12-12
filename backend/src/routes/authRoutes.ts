import express from 'express';
import { registerUser, loginUser, logoutUser, updateProfile, refreshToken } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middlewares/validate';
import { authLimiter } from '../middlewares/rateLimit';
import { loginSchema, refreshSchema, registerSchema, updateAuthProfileSchema } from '../validators/authSchemas';

const router = express.Router();

router.post('/register', authLimiter, validate({ body: registerSchema }), registerUser);
router.post('/login', authLimiter, validate({ body: loginSchema }), loginUser);
router.post('/refresh', authLimiter, validate({ body: refreshSchema }), refreshToken);
router.post('/logout', logoutUser);
router.put('/profile', protect, validate({ body: updateAuthProfileSchema }), updateProfile);

export default router;

