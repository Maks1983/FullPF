import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/environment';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { authMiddleware } from './middleware/authMiddleware';

// Import route modules
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import accountRoutes from './routes/accounts';
import transactionRoutes from './routes/transactions';
import categoryRoutes from './routes/categories';
import goalRoutes from './routes/goals';
import budgetRoutes from './routes/budgets';
import analyticsRoutes from './routes/analytics';
import dashboardRoutes from './routes/dashboard';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Compression and parsing
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan(config.logging.format));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.env,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/accounts', authMiddleware, accountRoutes);
app.use('/api/transactions', authMiddleware, transactionRoutes);
app.use('/api/categories', authMiddleware, categoryRoutes);
app.use('/api/goals', authMiddleware, goalRoutes);
app.use('/api/budgets', authMiddleware, budgetRoutes);
app.use('/api/analytics', authMiddleware, analyticsRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`🚀 Personal Finance API running on port ${PORT}`);
  console.log(`📊 Environment: ${config.env}`);
  console.log(`🔗 CORS enabled for: ${config.cors.allowedOrigins.join(', ')}`);
  console.log(`📈 Health check: http://localhost:${PORT}/health`);
});

export default app;