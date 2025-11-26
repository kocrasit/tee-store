import mongoose, { Document, Schema } from 'mongoose';

export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: {
        design: mongoose.Types.ObjectId;
        quantity: number;
        size: string;
        color: string;
        title: string;
        price: number;
        image: string;
    }[];
    totalAmount: number; // Subtotal before discount
    discountAmount: number;
    finalAmount: number; // Total after discount
    status: OrderStatus;
    shippingAddress: {
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    paymentInfo?: {
        id: string;
        status: string;
    };
    appliedCoupons: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: [
            {
                design: { type: Schema.Types.ObjectId, ref: 'Design', required: true },
                quantity: { type: Number, required: true, min: 1 },
                size: { type: String, required: true },
                color: { type: String, required: true },
                title: String,
                price: Number,
                image: String,
            },
        ],
        totalAmount: { type: Number, required: true },
        discountAmount: { type: Number, default: 0 },
        finalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
        },
        shippingAddress: {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentInfo: {
            id: String,
            status: String,
        },
        appliedCoupons: [{ type: Schema.Types.ObjectId, ref: 'Coupon' }],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
