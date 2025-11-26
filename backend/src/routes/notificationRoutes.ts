import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
    sendNotification,
    getUserNotifications,
    markAsRead,
} from '../controllers/notificationController';

const router = express.Router();

router.route('/')
    .post(protect, admin, sendNotification)
    .get(protect, getUserNotifications);

router.put('/:id/read', protect, markAsRead);

export default router;
