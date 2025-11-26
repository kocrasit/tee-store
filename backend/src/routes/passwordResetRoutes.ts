import express from 'express';
import {
    requestPasswordReset,
    verifyResetToken,
    resetPassword,
} from '../controllers/passwordResetController';

const router = express.Router();

// Request password reset
router.post('/forgot-password', requestPasswordReset);

// Verify reset token
router.get('/reset-password/:token', verifyResetToken);

// Reset password
router.post('/reset-password/:token', resetPassword);

export default router;
