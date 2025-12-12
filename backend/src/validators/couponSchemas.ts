import { z } from 'zod';
import { zMongoId } from './common';

export const couponIdParamsSchema = z.object({
  id: zMongoId,
});

export const createCouponBodySchema = z.object({
  code: z.string().trim().min(3).transform((s) => s.toUpperCase()),
  discountType: z.enum(['percentage', 'fixed_amount']),
  discountValue: z.coerce.number().min(0),
  minPurchaseAmount: z.coerce.number().min(0).optional(),
  expirationDate: z.coerce.date(),
  usageLimit: z.coerce.number().int().positive().optional(),
  assignedToUser: zMongoId.optional(),
});

export const applyCouponBodySchema = z.object({
  code: z.string().trim().min(1).transform((s) => s.toUpperCase()),
});


