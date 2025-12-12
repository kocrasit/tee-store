import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { updateProfile, changePassword } from '../controllers/userController';
import { validate } from '../middlewares/validate';
import { changePasswordBodySchema, updateUserProfileBodySchema } from '../validators/userSchemas';

const router = express.Router();

router.put('/profile', protect, validate({ body: updateUserProfileBodySchema }), updateProfile);
router.put('/password', protect, validate({ body: changePasswordBodySchema }), changePassword);

export default router;
