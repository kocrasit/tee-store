import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user?._id);

    if (user) {
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

        // Update influencer profile if exists
        if (user.role === 'influencer' && req.body.influencerProfile) {
            user.influencerProfile = {
                ...user.influencerProfile,
                bio: req.body.influencerProfile.bio || user.influencerProfile?.bio,
                socialLinks: req.body.influencerProfile.socialLinks || user.influencerProfile?.socialLinks,
                bankAccount: req.body.influencerProfile.bankAccount || user.influencerProfile?.bankAccount,
                commissionRate: user.influencerProfile?.commissionRate || 10,
                totalEarnings: user.influencerProfile?.totalEarnings || 0,
                monthlySales: user.influencerProfile?.monthlySales || 0,
            };
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            role: updatedUser.role,
            phoneNumber: updatedUser.phoneNumber,
            influencerProfile: updatedUser.influencerProfile,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error('Please provide current and new password');
    }

    const user = await User.findById(req.user?._id);

    if (user) {
        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            res.status(401);
            throw new Error('Current password is incorrect');
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();

        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});
