import { z } from 'zod';
import { zMongoId } from './common';

export const adminUserIdParamsSchema = z.object({
  id: zMongoId,
});


