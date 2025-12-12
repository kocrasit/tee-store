import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
    sendNotification,
    getUserNotifications,
    markAsRead,
} from '../controllers/notificationController';
import { validate } from '../middlewares/validate';
import { notificationIdParamsSchema, sendNotificationBodySchema } from '../validators/notificationSchemas';

const router = express.Router();

router.route('/')
    .post(protect, admin, validate({ body: sendNotificationBodySchema }), sendNotification)
    .get(protect, getUserNotifications);

router.put('/:id/read', protect, validate({ params: notificationIdParamsSchema }), markAsRead);

export default router;
