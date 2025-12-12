import { z } from 'zod';
import { zMongoId } from './common';

export const orderIdParamsSchema = z.object({
  id: zMongoId,
});

export const createOrderBodySchema = z.object({
  shippingAddress: z.object({
    address: z.string().trim().min(1),
    city: z.string().trim().min(1),
    postalCode: z.string().trim().min(1),
    country: z.string().trim().min(1),
  }),
  paymentInfo: z
    .object({
      id: z.string().trim().min(1),
      status: z.string().trim().min(1),
    })
    .partial()
    .optional(),
});

export const updateOrderStatusBodySchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
});


