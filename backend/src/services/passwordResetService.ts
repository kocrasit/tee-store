import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { ApiError } from '../utils/ApiError';

export async function requestPasswordReset(email: string) {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return { message: 'Eğer bu email kayıtlıysa, şifre sıfırlama linki gönderildi' };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password/${resetToken}`;

  // dev visibility
  return {
    message: 'Eğer bu email kayıtlıysa, şifre sıfırlama linki gönderildi',
    resetUrl,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

export async function verifyResetToken(token: string) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) throw new ApiError(400, 'Geçersiz veya süresi dolmuş token', { code: 'INVALID_RESET_TOKEN' });
  return { message: 'Token geçerli', email: user.email };
}

export async function resetPassword(token: string, password: string) {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) throw new ApiError(400, 'Geçersiz veya süresi dolmuş token', { code: 'INVALID_RESET_TOKEN' });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return { message: 'Şifre başarıyla sıfırlandı' };
}


