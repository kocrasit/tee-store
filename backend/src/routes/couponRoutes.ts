import express from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
    createCoupon,
    getCoupons,
    applyCoupon,
    removeCoupon,
    deleteCoupon,
} from '../controllers/couponController';

const router = express.Router();

router.route('/')
    .get(protect, getCoupons)
    .post(protect, admin, createCoupon);

router.post('/apply', protect, applyCoupon);
router.delete('/remove/:id', protect, removeCoupon);

router.route('/:id')
    .delete(protect, admin, deleteCoupon);

export default router;
