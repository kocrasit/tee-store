import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { errorHandler } from './middlewares/errorHandler';
import { sendSuccess } from './utils/apiResponse';
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
import bannerRoutes from './routes/bannerRoutes';

const app: Application = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Geliştirmede Next portu değişebildiği için ek varyasyonları izinli kıl
const localOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:3003',
  'http://127.0.0.1:5173',
];
const envOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(new Set([...localOrigins, ...envOrigins]));

app.use(cors({
  origin(origin, callback) {
    // allow server-to-server / curl (no Origin header)
    if (!origin) return callback(null, true);
    // allow explicit list
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // allow any Vercel preview/prod domain
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    // allow Render domain itself (health checks)
    if (origin.endsWith('.onrender.com')) return callback(null, true);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
const uploadsDir = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

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
app.use('/api/banners', bannerRoutes);

app.get('/', (req, res) => {
  sendSuccess(res, { data: { message: 'API is running...' } });
});

// Error Middleware
app.use(errorHandler);

export default app;
