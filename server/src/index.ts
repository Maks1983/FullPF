import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { extractTenantMiddleware } from './middleware/tenantMiddleware';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import bankRoutes from './routes/bankRoutes';
import tenantRoutes from './routes/tenantRoutes';
import { config } from './config';

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Global tenant extraction for API routes
app.use('/api', extractTenantMiddleware);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount API routes with tenant context
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/tenants', tenantRoutes);

// Legacy routes for backward compatibility (will be deprecated)
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/bank', bankRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`OwnCent auth service listening on port ${config.port}`);
  console.log(`Multi-tenant API available at /api/*`);
  console.log(`Legacy endpoints available at /*`);
});


