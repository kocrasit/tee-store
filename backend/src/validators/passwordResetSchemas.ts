import { z } from 'zod';

export const forgotPasswordBodySchema = z.object({
  email: z.string().email(),
});

export const resetTokenParamsSchema = z.object({
  token: z.string().trim().min(1),
});

export const resetPasswordBodySchema = z.object({
  password: z.string().min(6),
});


