import bcrypt from 'bcryptjs';
import User from '../models/User';
import { ApiError } from '../utils/ApiError';

export async function updateUserProfile(
  userId: string,
  input: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    influencerProfile?: any;
  }
) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found', { code: 'USER_NOT_FOUND' });

  if (input.firstName !== undefined) user.firstName = input.firstName || user.firstName;
  if (input.lastName !== undefined) user.lastName = input.lastName || user.lastName;
  if (input.phoneNumber !== undefined) user.phoneNumber = input.phoneNumber || user.phoneNumber;

  if (user.role === 'influencer' && input.influencerProfile) {
    user.influencerProfile = {
      ...user.influencerProfile,
      bio: input.influencerProfile.bio ?? user.influencerProfile?.bio,
      socialLinks: input.influencerProfile.socialLinks ?? user.influencerProfile?.socialLinks,
      bankAccount: input.influencerProfile.bankAccount ?? user.influencerProfile?.bankAccount,
      commissionRate: user.influencerProfile?.commissionRate || 10,
      totalEarnings: user.influencerProfile?.totalEarnings || 0,
      monthlySales: user.influencerProfile?.monthlySales || 0,
    };
  }

  const updated = await user.save();
  return {
    _id: updated._id,
    firstName: updated.firstName,
    lastName: updated.lastName,
    email: updated.email,
    role: updated.role,
    phoneNumber: updated.phoneNumber,
    influencerProfile: updated.influencerProfile,
  };
}

export async function changePassword(userId: string, input: { currentPassword: string; newPassword: string }) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found', { code: 'USER_NOT_FOUND' });

  const isMatch = await bcrypt.compare(input.currentPassword, user.password);
  if (!isMatch) throw new ApiError(401, 'Current password is incorrect', { code: 'INVALID_PASSWORD' });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(input.newPassword, salt);
  await user.save();
}

export async function updateAuthProfile(
  userId: string,
  input: {
    firstName?: string;
    lastName?: string;
    password?: string;
    bio?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  }
) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found', { code: 'USER_NOT_FOUND' });

  if (input.firstName !== undefined) user.firstName = input.firstName || user.firstName;
  if (input.lastName !== undefined) user.lastName = input.lastName || user.lastName;

  if (input.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(input.password, salt);
  }

  if (user.role === 'influencer') {
    const currentProfile: any = user.influencerProfile || {};
    user.influencerProfile = {
      ...currentProfile,
      bio: input.bio ?? currentProfile.bio,
      socialLinks: {
        instagram: input.instagram ?? currentProfile.socialLinks?.instagram,
        twitter: input.twitter ?? currentProfile.socialLinks?.twitter,
        tiktok: input.tiktok ?? currentProfile.socialLinks?.tiktok,
      },
      commissionRate: currentProfile.commissionRate || 10,
      totalEarnings: currentProfile.totalEarnings || 0,
      monthlySales: currentProfile.monthlySales || 0,
      bankAccount: currentProfile.bankAccount,
    };
  }

  const updated = await user.save();
  return {
    _id: updated._id,
    email: updated.email,
    firstName: updated.firstName,
    lastName: updated.lastName,
    role: updated.role,
    influencerProfile: updated.influencerProfile,
  };
}


