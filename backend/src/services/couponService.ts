import Coupon from '../models/Coupon';
import Cart from '../models/Cart';
import { ApiError } from '../utils/ApiError';

export async function createCoupon(input: any) {
  const couponExists = await Coupon.findOne({ code: input.code });
  if (couponExists) throw new ApiError(400, 'Coupon already exists', { code: 'COUPON_EXISTS' });
  return await Coupon.create(input);
}

export async function getCouponsForUser(input: { userId: string; role: string }) {
  if (input.role === 'admin') {
    return await Coupon.find({}).sort({ createdAt: -1 });
  }

  return await Coupon.find({
    isActive: true,
    expirationDate: { $gt: new Date() },
    $or: [{ assignedToUser: { $exists: false } }, { assignedToUser: null }, { assignedToUser: input.userId }],
  }).sort({ createdAt: -1 });
}

export async function applyCouponToCart(input: { userId: string; code: string }) {
  const coupon = await Coupon.findOne({ code: input.code, isActive: true });
  if (!coupon) throw new ApiError(404, 'Coupon not found or inactive', { code: 'COUPON_NOT_FOUND' });
  if (coupon.expirationDate < new Date()) throw new ApiError(400, 'Coupon expired', { code: 'COUPON_EXPIRED' });
  if (coupon.usageLimit <= coupon.usedCount) throw new ApiError(400, 'Coupon usage limit reached', { code: 'COUPON_LIMIT' });
  if (coupon.assignedToUser && coupon.assignedToUser.toString() !== input.userId.toString()) {
    throw new ApiError(403, 'This coupon is not valid for your account', { code: 'COUPON_FORBIDDEN' });
  }

  const cart: any = await Cart.findOne({ user: input.userId });
  if (!cart) throw new ApiError(404, 'Cart not found', { code: 'CART_NOT_FOUND' });
  if (cart.appliedCoupons.includes(coupon._id as any)) {
    throw new ApiError(400, 'Coupon already applied', { code: 'COUPON_ALREADY_APPLIED' });
  }

  cart.appliedCoupons.push(coupon._id as any);
  await cart.save();
  return cart;
}

export async function removeCouponFromCart(input: { userId: string; couponId: string }) {
  const cart: any = await Cart.findOne({ user: input.userId });
  if (!cart) throw new ApiError(404, 'Cart not found', { code: 'CART_NOT_FOUND' });

  cart.appliedCoupons = cart.appliedCoupons.filter((id: any) => id.toString() !== input.couponId);
  await cart.save();
  return cart;
}

export async function deleteCouponById(couponId: string) {
  const coupon = await Coupon.findById(couponId);
  if (!coupon) throw new ApiError(404, 'Coupon not found', { code: 'COUPON_NOT_FOUND' });
  await coupon.deleteOne();
}


