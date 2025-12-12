import { z } from 'zod';
import { zMongoId } from './common';

export const notificationIdParamsSchema = z.object({
  id: zMongoId,
});

export const sendNotificationBodySchema = z.object({
  userId: zMongoId,
  title: z.string().trim().min(1),
  message: z.string().trim().min(1),
  type: z.enum(['info', 'order', 'coupon']).optional(),
});


