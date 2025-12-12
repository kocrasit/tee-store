import express from 'express';
import {
    requestPasswordReset,
    verifyResetToken,
    resetPassword,
} from '../controllers/passwordResetController';
import { validate } from '../middlewares/validate';
import { authLimiter } from '../middlewares/rateLimit';
import { forgotPasswordBodySchema, resetPasswordBodySchema, resetTokenParamsSchema } from '../validators/passwordResetSchemas';

const router = express.Router();

// Request password reset
router.post('/forgot-password', authLimiter, validate({ body: forgotPasswordBodySchema }), requestPasswordReset);

// Verify reset token
router.get('/reset-password/:token', authLimiter, validate({ params: resetTokenParamsSchema }), verifyResetToken);

// Reset password
router.post(
    '/reset-password/:token',
    authLimiter,
    validate({ params: resetTokenParamsSchema, body: resetPasswordBodySchema }),
    resetPassword
);

export default router;
