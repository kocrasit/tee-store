import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware';
import { getAdminDashboardStats, getAllUsers, deleteUser } from '../controllers/adminController';

const router = express.Router();

router.get('/dashboard', protect, checkRole(['admin']), getAdminDashboardStats);
router.get('/users', protect, checkRole(['admin']), getAllUsers);
router.delete('/users/:id', protect, checkRole(['admin']), deleteUser);

export default router;

