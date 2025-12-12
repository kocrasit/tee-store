import { z } from 'zod';
import { zMongoId } from './common';

export const cartItemIdParamsSchema = z.object({
  itemId: zMongoId,
});

export const addToCartBodySchema = z.object({
  designId: zMongoId,
  quantity: z.coerce.number().int().positive(),
  size: z.string().trim().min(1),
  color: z.string().trim().min(1),
  title: z.string().trim().optional(),
  price: z.coerce.number().positive().optional(),
  image: z.string().trim().optional(),
});

export const syncCartBodySchema = z.object({
  items: z.array(
    z.object({
      designId: zMongoId,
      quantity: z.coerce.number().int().positive(),
      size: z.string().trim().min(1),
      color: z.string().trim().min(1),
      title: z.string().trim().optional(),
      price: z.coerce.number().positive().optional(),
      image: z.string().trim().optional(),
    })
  ),
});


