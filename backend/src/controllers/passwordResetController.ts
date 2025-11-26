import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User';

// Request password reset
export const requestPasswordReset = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email gereklidir' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            // Güvenlik için kullanıcı bulunamasa bile başarılı mesaj döndür
            return res.status(200).json({
                message: 'Eğer bu email kayıtlıysa, şifre sıfırlama linki gönderildi',
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Save token to user (expires in 1 hour)
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password/${resetToken}`;

        // Simulate email sending (console.log for now)
        console.log('\n========================================');
        console.log('📧 ŞİFRE SIFIRLAMA EMAİLİ');
        console.log('========================================');
        console.log(`Alıcı: ${user.email}`);
        console.log(`İsim: ${user.firstName} ${user.lastName}`);
        console.log(`\nŞifre sıfırlama linki:`);
        console.log(resetUrl);
        console.log(`\nBu link 1 saat geçerlidir.`);
        console.log('========================================\n');

        res.status(200).json({
            message: 'Eğer bu email kayıtlıysa, şifre sıfırlama linki gönderildi',
            resetUrl: resetUrl, // For development/testing convenience
        });
    } catch (error) {
        console.error('Password reset request error:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Verify reset token
export const verifyResetToken = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ message: 'Token gereklidir' });
        }

        // Hash the token to compare with database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: 'Geçersiz veya süresi dolmuş token',
            });
        }

        res.status(200).json({
            message: 'Token geçerli',
            email: user.email,
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: 'Token ve şifre gereklidir' });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Şifre en az 6 karakter olmalıdır',
            });
        }

        // Hash the token to compare with database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: 'Geçersiz veya süresi dolmuş token',
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        console.log(`✅ Şifre sıfırlandı: ${user.email}`);

        res.status(200).json({
            message: 'Şifre başarıyla sıfırlandı',
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
