import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendSuccess } from '../utils/apiResponse';
import { ApiError } from '../utils/ApiError';
import { createNotification, getNotificationsForUser, markNotificationAsRead } from '../services/notificationService';

// @desc    Send notification (Admin)
// @route   POST /api/notifications
// @access  Private/Admin
export const sendNotification = asyncHandler(async (req: Request, res: Response) => {
    const notification = await createNotification(req.body);
    sendSuccess(res, { statusCode: 201, data: notification });
});

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getUserNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, 'Not authorized', { code: 'NOT_AUTHORIZED' });
    const notifications = await getNotificationsForUser(req.user._id.toString());
    sendSuccess(res, { data: notifications });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, 'Not authorized', { code: 'NOT_AUTHORIZED' });
    const notification = await markNotificationAsRead({ id: req.params.id, userId: req.user._id.toString() });
    sendSuccess(res, { data: notification });
});
