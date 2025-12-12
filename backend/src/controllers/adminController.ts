import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { sendSuccess } from '../utils/apiResponse';
import { deleteUserById, getDashboardStats, listUsers } from '../services/adminService';

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await getDashboardStats();
  sendSuccess(res, { data: stats });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await listUsers();
  sendSuccess(res, { data: users });
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await deleteUserById(req.params.id);
  sendSuccess(res, { message: 'User removed' });
});

export { getAdminDashboardStats, getAllUsers, deleteUser };

