import express from 'express';
import { getDesigns, getDesignById, createDesign, getAllDesignsAdmin, deleteDesign, updateDesignStock, updateDesign } from '../controllers/designController';
import { createProductReview } from '../controllers/reviewController';
import { protect, checkRole } from '../middleware/authMiddleware';
import { validate } from '../middlewares/validate';
import { validateUploadedDesignImage, designImageUpload } from '../middlewares/upload';
import { sensitiveLimiter } from '../middlewares/rateLimit';
import {
    createDesignBodySchema,
    createReviewBodySchema,
    designIdParamsSchema,
    getDesignsQuerySchema,
    updateDesignBodySchema,
    updateStockBodySchema,
} from '../validators/designSchemas';

const router = express.Router();

console.log('Design Routes Loaded - Roles: influencer, designer, admin');

// Admin routes
router.route('/admin')
    .get(protect, checkRole(['admin']), getAllDesignsAdmin);

router.route('/')
    .get(validate({ query: getDesignsQuerySchema }), getDesigns)
    .post(
        sensitiveLimiter,
        protect,
        checkRole(['influencer', 'designer', 'admin']),
        designImageUpload.single('image'),
        validateUploadedDesignImage,
        validate({ body: createDesignBodySchema }),
        createDesign
    );

router.route('/:id/reviews').post(
    protect,
    validate({ params: designIdParamsSchema, body: createReviewBodySchema }),
    createProductReview
);

router.route('/:id/stock')
    .put(protect, checkRole(['admin']), validate({ params: designIdParamsSchema, body: updateStockBodySchema }), updateDesignStock);

router.route('/:id')
    .get(validate({ params: designIdParamsSchema }), getDesignById)
    .put(protect, validate({ params: designIdParamsSchema, body: updateDesignBodySchema }), updateDesign)
    .delete(protect, checkRole(['admin']), deleteDesign);

export default router;

