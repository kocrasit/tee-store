import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { sendSuccess } from '../utils/apiResponse';
import { createReview } from '../services/reviewService';

// @desc    Create new review
// @route   POST /api/designs/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req: any, res: Response) => {
    await createReview({
        designId: req.params.id,
        userId: req.user._id.toString(),
        rating: req.body.rating,
        comment: req.body.comment,
    });
    sendSuccess(res, { statusCode: 201, message: 'Değerlendirme eklendi' });
});
