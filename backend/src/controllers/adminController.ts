import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User';
import Design from '../models/Design';
// import Order from '../models/Order'; // Order modelini henüz oluşturmadık, şimdilik placeholder

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const totalRevenue = 125000; // Mock data until Order model is ready

  const totalOrders = 1245; // Mock data

  const totalUsers = await User.countDocuments({ role: 'customer' });

  const totalProducts = await Design.countDocuments();

  res.json({
    totalRevenue,
    totalOrders,
    totalUsers,
    totalProducts,
    conversionRate: 3.2,
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({})
    .select('-password')
    .sort({ createdAt: -1 });
  res.json(users);
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { getAdminDashboardStats, getAllUsers, deleteUser };

