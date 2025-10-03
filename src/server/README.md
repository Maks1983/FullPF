# OwnCent API Server

Self-hosted Express.js API server for OwnCent personal finance application.

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Configure environment
cp ../.env.example ../.env
# Edit ../.env with your database credentials

# Start development server
npm run dev
```

### Production

```bash
# Build
npm run build

# Start production server
npm start

# Or use PM2
pm2 start dist/index.js --name owncent-api
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

### User
- `GET /api/v1/user` - Get user profile

### Accounts
- `GET /api/v1/accounts` - Get all user accounts
- `GET /api/v1/accounts/:id` - Get account details

### Transactions
- `GET /api/v1/transactions` - Get transactions (with filters)
- `POST /api/v1/transactions/batch` - Batch create/update transactions

### Sync
- `GET /api/v1/sync/status` - Get bank connection sync status

### Health
- `GET /health` - Health check endpoint

## Environment Variables

See `.env.example` for all available configuration options.

### Required Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=owncent
DB_USER=owncent_app
DB_PASSWORD=your_password

# JWT Secrets (MUST be changed in production)
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
```

## Authentication

All protected endpoints require JWT authentication:

```bash
curl -X GET http://localhost:4000/api/v1/accounts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Token Flow

1. **Login**: POST `/api/v1/auth/login` with email/password
2. **Receive**: `accessToken` (15 min) and `refreshToken` (30 days)
3. **Use**: Include `accessToken` in Authorization header
4. **Refresh**: POST `/api/v1/auth/refresh` with `refreshToken` when expired

## Rate Limiting

Rate limits are tier-based (requests per minute):

- **Free**: 30 req/min
- **Advanced**: 90 req/min
- **Premium**: 180 req/min
- **Family**: 180 req/min

## Security Features

- JWT-based authentication with refresh tokens
- Bcrypt password hashing (configurable rounds)
- Tier-based rate limiting
- Helmet.js security headers
- CORS protection
- SQL injection prevention (parameterized queries)
- Audit logging for sensitive operations

## Error Handling

All errors return consistent JSON format:

```json
{
  "error": "Error name",
  "message": "Human-readable message",
  "timestamp": "2025-10-03T12:00:00.000Z",
  "path": "/api/v1/endpoint"
}
```

## Database

Uses MariaDB 10.5+ with connection pooling.

Schema location: `../database/schema/`

## Development

### Project Structure

```
server/
├── index.ts              # Main server entry point
├── config.ts             # Configuration management
├── db.ts                 # Database connection pool
├── middleware/
│   ├── auth.ts          # JWT authentication
│   ├── errorHandler.ts  # Global error handler
│   ├── logger.ts        # Request logger
│   └── rateLimit.ts     # Rate limiting
└── routes/
    ├── auth.ts          # Authentication routes
    ├── accounts.ts      # Accounts routes
    ├── transactions.ts  # Transactions routes
    ├── user.ts          # User routes
    └── sync.ts          # Sync status routes
```

### Adding New Routes

1. Create route file in `routes/`
2. Import and use in `index.ts`
3. Add authentication middleware if needed
4. Add rate limiting if appropriate

Example:

```typescript
// routes/example.ts
import express from 'express';
import { authenticate } from '../middleware/auth';
import { tierBasedRateLimit } from '../middleware/rateLimit';

const router = express.Router();

router.use(authenticate);
router.use(tierBasedRateLimit);

router.get('/', async (req, res) => {
  // Your logic here
});

export default router;
```

```typescript
// index.ts
import exampleRoutes from './routes/example';
app.use('/api/v1/example', exampleRoutes);
```

## Testing

### Manual Testing with curl

**Login:**
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"premium@example.com","password":"Demo123456!"}'
```

**Get Accounts:**
```bash
curl -X GET http://localhost:4000/api/v1/accounts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Get Transactions:**
```bash
curl -X GET "http://localhost:4000/api/v1/transactions?limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Monitoring

### Logs

Development logs show all requests:
```
→ GET /api/v1/accounts {...}
← GET /api/v1/accounts 200 45ms
```

Production logs (with `LOG_LEVEL=warn`) only show errors.

### Health Check

```bash
curl http://localhost:4000/health
```

Returns:
```json
{
  "status": "ok",
  "timestamp": "2025-10-03T12:00:00.000Z",
  "uptime": 123.456,
  "environment": "development"
}
```

### Database Metrics

Check active connections:
```sql
SHOW PROCESSLIST;
```

Check connection pool stats:
```sql
SHOW STATUS LIKE 'Threads%';
```

## Troubleshooting

### Database Connection Failed

Check credentials in `.env` and verify database is running:
```bash
mysql -u owncent_app -p owncent
```

### Port Already in Use

Change port in `.env`:
```bash
PORT=4001
```

Or kill process using port 4000:
```bash
lsof -i :4000
kill -9 <PID>
```

### JWT Errors

Ensure secrets are set in `.env` and match across server restarts.

### Rate Limit Errors

Adjust limits in `.env`:
```bash
RATE_LIMIT_FREE=60
RATE_LIMIT_PREMIUM=300
```

## Production Deployment

See `../MARIADB_MIGRATION_GUIDE.md` for complete deployment instructions.

### Quick Production Checklist

- [ ] Change `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Use production database credentials
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS origins properly
- [ ] Enable SSL/HTTPS
- [ ] Setup process manager (PM2)
- [ ] Configure reverse proxy (Nginx)
- [ ] Setup database backups
- [ ] Configure monitoring

## License

MIT
