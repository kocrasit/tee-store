import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
    createCoupon,
    getCoupons,
    applyCoupon,
    removeCoupon,
    deleteCoupon,
} from '../controllers/couponController';
import { validate } from '../middlewares/validate';
import { applyCouponBodySchema, couponIdParamsSchema, createCouponBodySchema } from '../validators/couponSchemas';

const router = express.Router();

router.route('/')
    .get(protect, getCoupons)
    .post(protect, admin, validate({ body: createCouponBodySchema }), createCoupon);

router.post('/apply', protect, validate({ body: applyCouponBodySchema }), applyCoupon);
router.delete('/remove/:id', protect, validate({ params: couponIdParamsSchema }), removeCoupon);

router.route('/:id')
    .delete(protect, admin, validate({ params: couponIdParamsSchema }), deleteCoupon);

export default router;
