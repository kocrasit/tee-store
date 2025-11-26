import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Coupon, { ICoupon } from '../models/Coupon';
import Cart from '../models/Cart';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
    const { code, discountType, discountValue, minPurchaseAmount, expirationDate, usageLimit, assignedToUser } = req.body;

    const couponExists = await Coupon.findOne({ code });

    if (couponExists) {
        res.status(400);
        throw new Error('Coupon already exists');
    }

    const coupon = await Coupon.create({
        code,
        discountType,
        discountValue,
        minPurchaseAmount,
        expirationDate,
        usageLimit,
        assignedToUser,
    });

    res.status(201).json(coupon);
});

// @desc    Get all coupons (Admin sees all, User sees public + assigned)
// @route   GET /api/coupons
// @access  Private
export const getCoupons = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = req.user;

    if (user?.role === 'admin') {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        res.json(coupons);
    } else {
        // User sees active public coupons OR coupons assigned specifically to them
        const coupons = await Coupon.find({
            isActive: true,
            expirationDate: { $gt: new Date() },
            $or: [
                { assignedToUser: { $exists: false } }, // Public
                { assignedToUser: null }, // Public
                { assignedToUser: user?._id } // Assigned to user
            ]
        }).sort({ createdAt: -1 });
        res.json(coupons);
    }
});

// @desc    Apply coupon to cart
// @route   POST /api/coupons/apply
// @access  Private
export const applyCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { code } = req.body;
    const userId = req.user?._id;

    const coupon = await Coupon.findOne({ code, isActive: true });

    if (!coupon) {
        res.status(404);
        throw new Error('Coupon not found or inactive');
    }

    if (coupon.expirationDate < new Date()) {
        res.status(400);
        throw new Error('Coupon expired');
    }

    if (coupon.usageLimit <= coupon.usedCount) {
        res.status(400);
        throw new Error('Coupon usage limit reached');
    }

    if (coupon.assignedToUser && coupon.assignedToUser.toString() !== userId?.toString()) {
        res.status(403);
        throw new Error('This coupon is not valid for your account');
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    // Check if already applied
    if (cart.appliedCoupons.includes(coupon._id as any)) {
        res.status(400);
        throw new Error('Coupon already applied');
    }

    // Add coupon to cart
    cart.appliedCoupons.push(coupon._id as any);

    // Recalculate totals (Simplified logic here, full calculation should be in a shared utility or pre-save hook)
    // For now, we just save. The Cart calculation logic usually happens when fetching cart or checkout.
    // But we should probably update totalDiscount here or let the frontend/cart fetch handle it.
    // Let's assume we just save the reference for now.

    await cart.save();

    res.json({ message: 'Coupon applied', cart });
});

// @desc    Remove coupon from cart
// @route   DELETE /api/coupons/remove/:id
// @access  Private
export const removeCoupon = asyncHandler(async (req: AuthRequest, res: Response) => {
    const couponId = req.params.id;
    const userId = req.user?._id;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    cart.appliedCoupons = cart.appliedCoupons.filter((id) => id.toString() !== couponId);

    await cart.save();

    res.json({ message: 'Coupon removed', cart });
});

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req: Request, res: Response) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        await coupon.deleteOne();
        res.json({ message: 'Coupon removed' });
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
});
