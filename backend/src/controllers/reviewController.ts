import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Design from '../models/Design';

// @desc    Create new review
// @route   POST /api/designs/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req: any, res: Response) => {
    const { rating, comment } = req.body;

    const design = await Design.findById(req.params.id);

    if (design) {
        const alreadyReviewed = design.reviews.find(
            (r) => r.userId.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Bu ürünü zaten değerlendirdiniz');
        }

        const review = {
            userId: req.user._id,
            rating: Number(rating),
            comment,
            createdAt: new Date(),
        };

        design.reviews.push(review);

        // design.reviewsCount = design.reviews.length;
        design.rating =
            design.reviews.reduce((acc, item) => item.rating + acc, 0) /
            design.reviews.length;

        await design.save();
        res.status(201).json({ message: 'Değerlendirme eklendi' });
    } else {
        res.status(404);
        throw new Error('Tasarım bulunamadı');
    }
});
