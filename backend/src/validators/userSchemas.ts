import { z } from 'zod';

export const updateUserProfileBodySchema = z.object({
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
  phoneNumber: z.string().trim().min(3).optional(),
  influencerProfile: z
    .object({
      bio: z.string().trim().optional(),
      socialLinks: z
        .object({
          twitter: z.string().trim().optional(),
          instagram: z.string().trim().optional(),
          tiktok: z.string().trim().optional(),
        })
        .partial()
        .optional(),
      bankAccount: z.string().trim().optional(),
    })
    .partial()
    .optional(),
});

export const changePasswordBodySchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});


