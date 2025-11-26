import express from 'express';
import { getCart, addToCart, removeFromCart, clearCart, syncCart } from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect); // All cart routes are protected

router.route('/')
    .get(getCart)
    .post(addToCart)
    .delete(clearCart);

router.post('/sync', syncCart);

router.route('/:itemId')
    .delete(removeFromCart);

export default router;
