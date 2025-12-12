import Notification from '../models/Notification';
import { ApiError } from '../utils/ApiError';

export async function createNotification(input: { userId: string; title: string; message: string; type?: string }) {
  return await Notification.create({
    user: input.userId,
    title: input.title,
    message: input.message,
    type: input.type,
  });
}

export async function getNotificationsForUser(userId: string) {
  return await Notification.find({ user: userId }).sort({ createdAt: -1 });
}

export async function markNotificationAsRead(input: { id: string; userId: string }) {
  const notification: any = await Notification.findById(input.id);
  if (!notification) throw new ApiError(404, 'Notification not found', { code: 'NOTIFICATION_NOT_FOUND' });
  if (notification.user.toString() !== input.userId.toString()) throw new ApiError(401, 'Not authorized', { code: 'FORBIDDEN' });
  notification.isRead = true;
  await notification.save();
  return notification;
}


