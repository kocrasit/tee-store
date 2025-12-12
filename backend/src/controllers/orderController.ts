import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendSuccess } from '../utils/apiResponse';
import { ApiError } from '../utils/ApiError';
import {
    createOrderForUser,
    getAllOrdersAdmin,
    getOrderByIdForUser,
    getOrdersForUser,
    updateOrderStatusAdmin,
} from '../services/orderService';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, 'Not authorized', { code: 'NOT_AUTHORIZED' });
    const order = await createOrderForUser({
        userId: req.user._id.toString(),
        shippingAddress: req.body.shippingAddress,
        paymentInfo: req.body.paymentInfo,
    });
    sendSuccess(res, { statusCode: 201, data: order });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, 'Not authorized', { code: 'NOT_AUTHORIZED' });
    const orders = await getOrdersForUser(req.user._id.toString());
    sendSuccess(res, { data: orders });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, 'Not authorized', { code: 'NOT_AUTHORIZED' });
    const order = await getOrderByIdForUser({
        orderId: req.params.id,
        userId: req.user._id.toString(),
        isAdmin: req.user?.role === 'admin',
    });
    sendSuccess(res, { data: order });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const orders = await getAllOrdersAdmin();
    sendSuccess(res, { data: orders });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const updatedOrder = await updateOrderStatusAdmin(req.params.id, req.body.status);
    sendSuccess(res, { data: updatedOrder });
});
