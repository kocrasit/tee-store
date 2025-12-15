import { z } from 'zod';
import { zMongoId } from './common';

const zTags = z.preprocess((val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    // accept "a,b,c" or JSON-like "[a,b]"
    return trimmed
      .replace(/^\[|\]$/g, '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}, z.array(z.string().trim().min(1)));

export const getDesignsQuerySchema = z.object({
  pageNumber: z.coerce.number().int().positive().optional(),
  keyword: z.string().trim().optional(),
  filter: z.string().trim().optional(),
});

export const designIdParamsSchema = z.object({
  id: zMongoId,
});

export const createDesignBodySchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.coerce.number().positive(),
  category: z.enum(['tshirt', 'hoodie', 'sweatshirt', 'mug', 'poster', 'sticker']),
  tags: zTags.optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  isNewSeason: z.union([z.boolean(), z.string().transform((val) => val === 'true')]).optional(),
  isBestSeller: z.union([z.boolean(), z.string().transform((val) => val === 'true')]).optional(),
  isSale: z.union([z.boolean(), z.string().transform((val) => val === 'true')]).optional(),
});

export const updateDesignBodySchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  price: z.coerce.number().positive().optional(),
  category: z.enum(['tshirt', 'hoodie', 'sweatshirt', 'mug', 'poster', 'sticker']).optional(),
  stock: z.coerce.number().int().nonnegative().optional(),
  status: z.enum(['draft', 'published', 'rejected', 'archived']).optional(),
  isNewSeason: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isSale: z.boolean().optional(),
});

export const updateStockBodySchema = z.object({
  stock: z.coerce.number().int().nonnegative(),
});

export const createReviewBodySchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().trim().min(1),
});


