import { z } from 'zod';

export const zMongoId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const zNonEmptyString = z.string().trim().min(1);


