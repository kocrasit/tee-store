import User from '../models/User';
import Design from '../models/Design';
import { ApiError } from '../utils/ApiError';

export async function getDashboardStats() {
  const totalRevenue = 125000; // placeholder until order revenue is implemented fully
  const totalOrders = 1245; // placeholder
  const totalUsers = await User.countDocuments({ role: 'customer' });
  const totalProducts = await Design.countDocuments();
  return { totalRevenue, totalOrders, totalUsers, totalProducts, conversionRate: 3.2 };
}

export async function listUsers() {
  return await User.find({}).select('-password').sort({ createdAt: -1 });
}

export async function deleteUserById(id: string) {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found', { code: 'USER_NOT_FOUND' });
  await user.deleteOne();
}


