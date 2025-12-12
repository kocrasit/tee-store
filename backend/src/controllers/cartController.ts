import { Response } from 'express';
import asyncHandler from 'express-async-handler';
import { AuthRequest } from '../middleware/authMiddleware';
import { sendSuccess } from '../utils/apiResponse';
import {
    addItemToCart,
    clearUserCart,
    getOrCreateCart,
    removeItemFromCart,
    syncUserCart,
} from '../services/cartService';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const cart = await getOrCreateCart(req.user._id.toString());
    sendSuccess(res, { data: cart });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const cart = await addItemToCart(req.user._id.toString(), req.body);
    sendSuccess(res, { data: cart });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const cart = await removeItemFromCart(req.user._id.toString(), req.params.itemId);
    sendSuccess(res, { data: cart });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const cart = await clearUserCart(req.user._id.toString());
    sendSuccess(res, { data: cart });
});

// @desc    Sync local cart with backend
// @route   POST /api/cart/sync
// @access  Private
export const syncCart = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const cart = await syncUserCart(req.user._id.toString(), req.body.items);
    sendSuccess(res, { data: cart });
});
