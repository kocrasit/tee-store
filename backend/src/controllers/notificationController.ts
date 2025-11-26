import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Notification from '../models/Notification';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Send notification (Admin)
// @route   POST /api/notifications
// @access  Private/Admin
export const sendNotification = asyncHandler(async (req: Request, res: Response) => {
    const { userId, title, message, type } = req.body;

    const notification = await Notification.create({
        user: userId,
        title,
        message,
        type,
    });

    res.status(201).json(notification);
});

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getUserNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
    const notifications = await Notification.find({ user: req.user?._id }).sort({ createdAt: -1 });
    res.json(notifications);
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    if (notification.user.toString() !== req.user?._id.toString()) {
        res.status(401);
        throw new Error('Not authorized');
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
});
