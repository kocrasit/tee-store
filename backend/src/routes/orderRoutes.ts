import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
} from '../controllers/orderController';
import { validate } from '../middlewares/validate';
import { sensitiveLimiter } from '../middlewares/rateLimit';
import { createOrderBodySchema, orderIdParamsSchema, updateOrderStatusBodySchema } from '../validators/orderSchemas';

const router = express.Router();

router.route('/')
    .post(sensitiveLimiter, protect, validate({ body: createOrderBodySchema }), createOrder)
    .get(protect, checkRole(['admin']), getAllOrders);

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/:id')
    .get(protect, validate({ params: orderIdParamsSchema }), getOrderById);

router.route('/:id/status')
    .put(protect, checkRole(['admin']), validate({ params: orderIdParamsSchema, body: updateOrderStatusBodySchema }), updateOrderStatus);

export default router;
