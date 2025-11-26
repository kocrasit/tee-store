import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order';
import Design from '../models/Design';
import Cart from '../models/Cart';
import Coupon, { DiscountType } from '../models/Coupon';
import { AuthRequest } from '../middleware/authMiddleware';

// Helper to calculate discount
const calculateDiscount = async (cartItems: any[], appliedCouponIds: any[]) => {
    let totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let discountAmount = 0;

    if (!appliedCouponIds || appliedCouponIds.length === 0) {
        return { totalAmount, discountAmount, finalAmount: totalAmount };
    }

    const coupons = await Coupon.find({ _id: { $in: appliedCouponIds } });

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

    return { totalAmount, discountAmount, finalAmount: currentTotal };
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { shippingAddress, paymentInfo } = req.body;
    const userId = req.user?._id;

    const cart = await Cart.findOne({ user: userId }).populate('items.design');

    if (!cart || cart.items.length === 0) {
        res.status(400);
        throw new Error('No cart items found');
    }

    // Check stock availability
    for (const item of cart.items) {
        const design = await Design.findById(item.design._id);
        if (!design) {
            res.status(404);
            throw new Error(`Product not found: ${item.title}`);
        }
        if (design.stock < item.quantity) {
            res.status(400);
            throw new Error(`Insufficient stock for product: ${design.title}. Available: ${design.stock}`);
        }
    }

    // Calculate totals and verify coupons again
    const { totalAmount, discountAmount, finalAmount } = await calculateDiscount(cart.items, cart.appliedCoupons);

    const orderItems = cart.items.map((item: any) => ({
        design: item.design._id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        title: item.title || item.design.title,
        price: item.price,
        image: item.image || item.design.images[0],
    }));

    const order = await Order.create({
        user: userId,
        items: orderItems,
        totalAmount,
        discountAmount,
        finalAmount,
        shippingAddress,
        paymentInfo,
        appliedCoupons: cart.appliedCoupons,
    });

    // Decrement stock
    for (const item of cart.items) {
        await Design.findByIdAndUpdate(item.design._id, { $inc: { stock: -item.quantity, sales: item.quantity } });
    }

    // Increment usage count for coupons
    if (cart.appliedCoupons.length > 0) {
        await Coupon.updateMany(
            { _id: { $in: cart.appliedCoupons } },
            { $inc: { usedCount: 1 } }
        );
    }

    // Clear Cart
    cart.items = [] as any;
    cart.appliedCoupons = [];
    cart.totalDiscount = 0;
    await cart.save();

    res.status(201).json(order);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const orders = await Order.find({ user: req.user?._id }).sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');

    if (order) {
        // Check if admin or order owner
        if (req.user?.role === 'admin' || order.user._id.toString() === req.user?._id.toString()) {
            res.json(order);
        } else {
            res.status(401);
            throw new Error('Not authorized to view this order');
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const orders = await Order.find({})
        .populate('user', 'id firstName lastName email')
        .sort({ createdAt: -1 });
    res.json(orders);
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = req.body.status || order.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
});
