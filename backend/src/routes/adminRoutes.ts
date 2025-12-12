import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware';
import { getAdminDashboardStats, getAllUsers, deleteUser } from '../controllers/adminController';
import { validate } from '../middlewares/validate';
import { adminUserIdParamsSchema } from '../validators/adminSchemas';

const router = express.Router();

router.get('/dashboard', protect, checkRole(['admin']), getAdminDashboardStats);
router.get('/users', protect, checkRole(['admin']), getAllUsers);
router.delete('/users/:id', protect, checkRole(['admin']), validate({ params: adminUserIdParamsSchema }), deleteUser);

export default router;

