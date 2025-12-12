import express from 'express';
import { getCart, addToCart, removeFromCart, clearCart, syncCart } from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middlewares/validate';
import { addToCartBodySchema, cartItemIdParamsSchema, syncCartBodySchema } from '../validators/cartSchemas';

const router = express.Router();

router.use(protect); // All cart routes are protected

router.route('/')
    .get(getCart)
    .post(validate({ body: addToCartBodySchema }), addToCart)
    .delete(clearCart);

router.post('/sync', validate({ body: syncCartBodySchema }), syncCart);

router.route('/:itemId')
    .delete(validate({ params: cartItemIdParamsSchema }), removeFromCart);

export default router;
