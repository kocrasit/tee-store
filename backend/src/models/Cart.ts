import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        unique: true // One cart per user
    },
    items: [
        {
            design: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Design'
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1
            },
            size: {
                type: String,
                required: true
            },
            color: {
                type: String,
                required: true
            },
            title: String, // Snapshot of title
            price: Number, // Snapshot of price
            image: String  // Snapshot of image
        }
    ],
    appliedCoupons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon'
    }],
    totalDiscount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
