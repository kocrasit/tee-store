import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
import Coupon, { DiscountType } from '../models/Coupon';

// Helper to calculate discount
const calculateCartDiscount = async (cart: any) => {
    if (!cart.items || cart.items.length === 0) {
        return 0;
    }

    let totalAmount = cart.items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
    let discountAmount = 0;

    if (!cart.appliedCoupons || cart.appliedCoupons.length === 0) {
        return 0;
    }

    // Populate coupons if not already populated
    // In getCart we will populate, but let's be safe or assume populated
    // Actually, let's fetch them here to be sure
    const coupons = await Coupon.find({ _id: { $in: cart.appliedCoupons } });

    let currentTotal = totalAmount;

    for (const coupon of coupons) {
        if (!coupon.isActive) continue;
        if (coupon.expirationDate < new Date()) continue;
        if (coupon.minPurchaseAmount > totalAmount) continue;

        let currentDiscount = 0;

        if (coupon.discountType === DiscountType.PERCENTAGE) {
            currentDiscount = (currentTotal * coupon.discountValue) / 100;
        } else if (coupon.discountType === DiscountType.FIXED_AMOUNT) {
            currentDiscount = coupon.discountValue;
        }

        if (currentDiscount > currentTotal) {
            currentDiscount = currentTotal;
        }

        discountAmount += currentDiscount;
        currentTotal -= currentDiscount;
    }

    return discountAmount;
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }

    let cart: any = await Cart.findOne({ user: req.user._id }).populate('appliedCoupons');

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Calculate and update discount
    const totalDiscount = await calculateCartDiscount(cart);
    cart.totalDiscount = totalDiscount;
    await cart.save();

    res.json(cart);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const { designId, quantity, size, color, title, price, image } = req.body;

    let cart: any = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if item exists
    const existingItemIndex = cart.items.findIndex(
        (item: any) =>
            item.design.toString() === designId &&
            item.size === size &&
            item.color === color
    );

    if (existingItemIndex > -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        // Add new item
        cart.items.push({
            design: designId,
            quantity,
            size,
            color,
            title,
            price,
            image
        });
    }

    await cart.save();
    res.json(cart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const cart: any = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.items = cart.items.filter((item: any) => item._id.toString() !== req.params.itemId);
        await cart.save();
        res.json(cart);
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const cart: any = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.items = [];
        await cart.save();
        res.json(cart);
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
});

// @desc    Sync local cart with backend
// @route   POST /api/cart/sync
// @access  Private
export const syncCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const { items } = req.body; // Items from local storage

    let cart: any = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Merge logic: Add local items to DB cart if they don't exist or update quantity
    for (const localItem of items) {
        const existingItemIndex = cart.items.findIndex(
            (item: any) =>
                item.design.toString() === localItem.designId &&
                item.size === localItem.size &&
                item.color === localItem.color
        );

        if (existingItemIndex > -1) {
            // Optional: Decide strategy. Here we can keep the DB one or add. 
            // Let's add quantities? Or just ensure it exists?
            // For simplicity, let's just ensure it's there.
        } else {
            cart.items.push({
                design: localItem.designId,
                quantity: localItem.quantity,
                size: localItem.size,
                color: localItem.color,
                title: localItem.title,
                price: localItem.price,
                image: localItem.image
            });
        }
    }

    await cart.save();
    res.json(cart);
});
