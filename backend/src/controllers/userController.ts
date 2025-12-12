import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendSuccess } from '../utils/apiResponse';
import { changePassword as changePasswordService, updateUserProfile } from '../services/userService';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const updatedUser = await updateUserProfile(req.user._id.toString(), req.body);
    sendSuccess(res, { data: updatedUser });
});

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    await changePasswordService(req.user._id.toString(), req.body);
    sendSuccess(res, { message: 'Password updated successfully' });
});
