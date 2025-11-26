import mongoose, { Document, Schema } from 'mongoose';

export enum DiscountType {
    PERCENTAGE = 'percentage',
    FIXED_AMOUNT = 'fixed_amount',
}

export interface ICoupon extends Document {
    code: string;
    discountType: DiscountType;
    discountValue: number;
    minPurchaseAmount: number;
    expirationDate: Date;
    usageLimit: number; // Total times coupon can be used globally
    usedCount: number;
    isActive: boolean;
    assignedToUser?: mongoose.Types.ObjectId; // If set, only this user can use it
    createdAt: Date;
    updatedAt: Date;
}

const CouponSchema: Schema = new Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true, trim: true },
        discountType: {
            type: String,
            enum: Object.values(DiscountType),
            required: true,
        },
        discountValue: { type: Number, required: true, min: 0 },
        minPurchaseAmount: { type: Number, default: 0, min: 0 },
        expirationDate: { type: Date, required: true },
        usageLimit: { type: Number, default: 1000000 }, // Default high limit
        usedCount: { type: Number, default: 0 },
        isActive: { type: Boolean, default: true },
        assignedToUser: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ICoupon>('Coupon', CouponSchema);
