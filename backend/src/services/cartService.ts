import Cart from '../models/Cart';
import Coupon, { DiscountType } from '../models/Coupon';
import { ApiError } from '../utils/ApiError';

async function calculateCartDiscount(cart: any) {
  if (!cart.items || cart.items.length === 0) return 0;

  const totalAmount = cart.items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);

  if (!cart.appliedCoupons || cart.appliedCoupons.length === 0) return 0;

  const coupons = await Coupon.find({ _id: { $in: cart.appliedCoupons } });
  let currentTotal = totalAmount;
  let discountAmount = 0;

  for (const coupon of coupons) {
    if (!coupon.isActive) continue;
    if (coupon.expirationDate < new Date()) continue;
    if (coupon.minPurchaseAmount > totalAmount) continue;

    let currentDiscount = 0;
    if (coupon.discountType === DiscountType.PERCENTAGE) currentDiscount = (currentTotal * coupon.discountValue) / 100;
    if (coupon.discountType === DiscountType.FIXED_AMOUNT) currentDiscount = coupon.discountValue;

    if (currentDiscount > currentTotal) currentDiscount = currentTotal;
    discountAmount += currentDiscount;
    currentTotal -= currentDiscount;
  }

  return discountAmount;
}

export async function getOrCreateCart(userId: string) {
  let cart: any = await Cart.findOne({ user: userId }).populate('appliedCoupons');
  if (!cart) cart = await Cart.create({ user: userId, items: [] });

  const totalDiscount = await calculateCartDiscount(cart);
  cart.totalDiscount = totalDiscount;
  await cart.save();

  return cart;
}

export async function addItemToCart(userId: string, input: any) {
  let cart: any = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });

  const { designId, quantity, size, color, title, price, image } = input;

  const existingItemIndex = cart.items.findIndex(
    (item: any) => item.design.toString() === designId && item.size === size && item.color === color
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({ design: designId, quantity, size, color, title, price, image });
  }

  await cart.save();
  return cart;
}

export async function removeItemFromCart(userId: string, itemId: string) {
  const cart: any = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found', { code: 'CART_NOT_FOUND' });

  cart.items = cart.items.filter((item: any) => item._id.toString() !== itemId);
  await cart.save();
  return cart;
}

export async function clearUserCart(userId: string) {
  const cart: any = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found', { code: 'CART_NOT_FOUND' });
  cart.items = [];
  await cart.save();
  return cart;
}

export async function syncUserCart(userId: string, items: any[]) {
  let cart: any = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });

  for (const localItem of items) {
    const existingItemIndex = cart.items.findIndex(
      (item: any) => item.design.toString() === localItem.designId && item.size === localItem.size && item.color === localItem.color
    );

    if (existingItemIndex === -1) {
      cart.items.push({
        design: localItem.designId,
        quantity: localItem.quantity,
        size: localItem.size,
        color: localItem.color,
        title: localItem.title,
        price: localItem.price,
        image: localItem.image,
      });
    }
  }

  await cart.save();
  return cart;
}


