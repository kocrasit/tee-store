import Order from '../models/Order';
import Design from '../models/Design';
import Cart from '../models/Cart';
import Coupon, { DiscountType } from '../models/Coupon';
import { ApiError } from '../utils/ApiError';

async function calculateDiscount(cartItems: any[], appliedCouponIds: any[]) {
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  let discountAmount = 0;

  if (!appliedCouponIds || appliedCouponIds.length === 0) {
    return { totalAmount, discountAmount, finalAmount: totalAmount };
  }

  const coupons = await Coupon.find({ _id: { $in: appliedCouponIds } });
  let currentTotal = totalAmount;

  for (const coupon of coupons) {
    if (!coupon.isActive) continue;
    if (coupon.expirationDate < new Date()) continue;
    if (coupon.minPurchaseAmount > totalAmount) continue;

    let currentDiscount = 0;
    if (coupon.discountType === DiscountType.PERCENTAGE) {
      currentDiscount = (currentTotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === DiscountType.FIXED_AMOUNT) {
      currentDiscount = coupon.discountValue;
    }

    if (currentDiscount > currentTotal) currentDiscount = currentTotal;

    discountAmount += currentDiscount;
    currentTotal -= currentDiscount;
  }

  return { totalAmount, discountAmount, finalAmount: currentTotal };
}

export async function createOrderForUser(input: {
  userId: string;
  shippingAddress: any;
  paymentInfo?: any;
}) {
  const cart: any = await Cart.findOne({ user: input.userId }).populate('items.design');
  if (!cart || cart.items.length === 0) throw new ApiError(400, 'No cart items found', { code: 'EMPTY_CART' });

  for (const item of cart.items) {
    const design = await Design.findById(item.design._id);
    if (!design) throw new ApiError(404, `Product not found: ${item.title}`, { code: 'PRODUCT_NOT_FOUND' });
    if (design.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for product: ${design.title}. Available: ${design.stock}`, {
        code: 'INSUFFICIENT_STOCK',
      });
    }
  }

  const { totalAmount, discountAmount, finalAmount } = await calculateDiscount(cart.items, cart.appliedCoupons);

  const orderItems = cart.items.map((item: any) => ({
    design: item.design._id,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    title: item.title || item.design.title,
    price: item.price,
    image: item.image || item.design.images?.original || item.design.images?.[0],
  }));

  const order = await Order.create({
    user: input.userId,
    items: orderItems,
    totalAmount,
    discountAmount,
    finalAmount,
    shippingAddress: input.shippingAddress,
    paymentInfo: input.paymentInfo,
    appliedCoupons: cart.appliedCoupons,
  });

  for (const item of cart.items) {
    await Design.findByIdAndUpdate(item.design._id, { $inc: { stock: -item.quantity, sales: item.quantity } });
  }

  if (cart.appliedCoupons.length > 0) {
    await Coupon.updateMany({ _id: { $in: cart.appliedCoupons } }, { $inc: { usedCount: 1 } });
  }

  cart.items = [] as any;
  cart.appliedCoupons = [];
  cart.totalDiscount = 0;
  await cart.save();

  return order;
}

export async function getOrdersForUser(userId: string) {
  return await Order.find({ user: userId }).sort({ createdAt: -1 });
}

export async function getOrderByIdForUser(input: { orderId: string; userId: string; isAdmin: boolean }) {
  const order: any = await Order.findById(input.orderId).populate('user', 'firstName lastName email');
  if (!order) throw new ApiError(404, 'Order not found', { code: 'ORDER_NOT_FOUND' });

  if (input.isAdmin || order.user._id.toString() === input.userId.toString()) {
    return order;
  }

  throw new ApiError(401, 'Not authorized to view this order', { code: 'FORBIDDEN' });
}

export async function getAllOrdersAdmin() {
  return await Order.find({}).populate('user', 'id firstName lastName email').sort({ createdAt: -1 });
}

export async function updateOrderStatusAdmin(orderId: string, status: string) {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found', { code: 'ORDER_NOT_FOUND' });
  (order as any).status = status || (order as any).status;
  return await order.save();
}


