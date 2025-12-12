import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendSuccess } from '../utils/apiResponse';
import { ApiError } from '../utils/ApiError';
import {
    applyCouponToCart,
    createCoupon as createCouponService,
    deleteCouponById,
    getCouponsForUser,
    removeCouponFromCart,
} from '../services/couponService';

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await createCouponService(req.body);
    sendSuccess(res, { statusCode: 201, data: coupon });
});

// @desc    Get all coupons (Admin sees all, User sees public + assigned)
// @route   GET /api/coupons
// @access  Private
export const getCoupons = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, 'Not authorized', { code: 'NOT_AUTHORIZED' });
    const coupons = await getCouponsForUser({ userId: req.user._id.toString(), role: req.user.role as any });
    sendSuccess(res, { data: coupons });
});

// @desc    Apply coupon to cart
// @route   POST /api/coupons/apply
// @access  Private
export const applyCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, 'Not authorized', { code: 'NOT_AUTHORIZED' });
    const cart = await applyCouponToCart({ userId: req.user._id.toString(), code: req.body.code });
    sendSuccess(res, { message: 'Coupon applied', data: { cart } });
});

// @desc    Remove coupon from cart
// @route   DELETE /api/coupons/remove/:id
// @access  Private
export const removeCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, 'Not authorized', { code: 'NOT_AUTHORIZED' });
    const cart = await removeCouponFromCart({ userId: req.user._id.toString(), couponId: req.params.id });
    sendSuccess(res, { message: 'Coupon removed', data: { cart } });
});

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
    await deleteCouponById(req.params.id);
    sendSuccess(res, { message: 'Coupon removed' });
});
