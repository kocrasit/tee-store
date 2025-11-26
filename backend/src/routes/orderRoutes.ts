import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
} from '../controllers/orderController';

const router = express.Router();

router.route('/')
    .post(protect, createOrder)
    .get(protect, checkRole(['admin']), getAllOrders);

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/status')
    .put(protect, checkRole(['admin']), updateOrderStatus);

export default router;
