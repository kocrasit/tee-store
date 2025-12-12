import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { sendSuccess } from '../utils/apiResponse';
import {
    requestPasswordReset as requestPasswordResetService,
    verifyResetToken as verifyResetTokenService,
    resetPassword as resetPasswordService,
} from '../services/passwordResetService';

// Request password reset
export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
    const result = await requestPasswordResetService(req.body.email);
    if ((result as any).resetUrl) {
        console.log('\n========================================');
        console.log('📧 ŞİFRE SIFIRLAMA EMAİLİ');
        console.log('========================================');
        console.log(`Alıcı: ${(result as any).email}`);
        console.log(`İsim: ${(result as any).firstName} ${(result as any).lastName}`);
        console.log(`\nŞifre sıfırlama linki:`);
        console.log((result as any).resetUrl);
        console.log(`\nBu link 1 saat geçerlidir.`);
        console.log('========================================\n');
    }
    sendSuccess(res, { data: result });
});

// Verify reset token
export const verifyResetToken = asyncHandler(async (req: Request, res: Response) => {
    const result = await verifyResetTokenService(req.params.token);
    sendSuccess(res, { data: result });
});

// Reset password
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await resetPasswordService(req.params.token, req.body.password);
    sendSuccess(res, { data: result });
});
