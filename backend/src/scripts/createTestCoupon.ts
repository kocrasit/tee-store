import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Coupon, { DiscountType } from '../models/Coupon';
import connectDB from '../config/db';

dotenv.config();

const createTestCoupon = async () => {
    await connectDB();

    const code = 'TEST10';

    // Delete if exists
    await Coupon.deleteOne({ code });

    const coupon = await Coupon.create({
        code,
        discountType: DiscountType.PERCENTAGE,
        discountValue: 10,
        minPurchaseAmount: 0,
        expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        usageLimit: 100,
        isActive: true
    });

    console.log(`Coupon created: ${coupon.code}`);
    console.log(`Type: ${coupon.discountType}`);
    console.log(`Value: ${coupon.discountValue}`);

    process.exit();
};

createTestCoupon();
