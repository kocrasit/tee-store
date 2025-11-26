import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { errorMiddleware } from './middleware/errorMiddleware';
import authRoutes from './routes/authRoutes';
import passwordResetRoutes from './routes/passwordResetRoutes';
import designRoutes from './routes/designRoutes';
import adminRoutes from './routes/adminRoutes';
import influencerRoutes from './routes/influencerRoutes';
import cartRoutes from './routes/cartRoutes';
import couponRoutes from './routes/couponRoutes';
import notificationRoutes from './routes/notificationRoutes';
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';

const app: Application = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], // Allow Next.js and Vite
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', passwordResetRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/influencer', influencerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Middleware
app.use(errorMiddleware);

export default app;
