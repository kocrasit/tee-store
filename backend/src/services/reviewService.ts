import Design from '../models/Design';
import { ApiError } from '../utils/ApiError';

export async function createReview(input: { designId: string; userId: string; rating: number; comment: string }) {
  const design = await Design.findById(input.designId);
  if (!design) throw new ApiError(404, 'Tasarım bulunamadı', { code: 'DESIGN_NOT_FOUND' });

  const alreadyReviewed = design.reviews.find((r) => r.userId.toString() === input.userId.toString());
  if (alreadyReviewed) throw new ApiError(400, 'Bu ürünü zaten değerlendirdiniz', { code: 'ALREADY_REVIEWED' });

  design.reviews.push({
    userId: (input.userId as any) as any,
    rating: Number(input.rating),
    comment: input.comment,
    createdAt: new Date(),
  } as any);

  design.rating = design.reviews.reduce((acc, item) => item.rating + acc, 0) / design.reviews.length;
  await design.save();
}


