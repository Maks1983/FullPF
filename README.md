# OwnCent - Personal Finance Management Platform

A comprehensive, self-hosted personal finance management application with a React frontend and Express API backend, fully integrated into a single deployment.

## Quick Start

### Prerequisites
- Node.js 18+
- MariaDB database (configured at maria.alfcent.com)
- npm or yarn

### Development

```bash
# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run frontend (with hot reload)
npm run dev

# In another terminal, run API server
npm run dev:server
```

### Production Build

```bash
# Build both frontend and API
npm run build

# Start production server
npm start

# Or use the start script
./start.sh
```

## Project Structure

```
owncent/
├── src/
│   ├── components/         # React components
│   ├── server/            # Express API server
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth, rate limiting, etc.
│   │   ├── config.ts      # Server configuration
│   │   ├── db.ts          # Database connection
│   │   └── index.ts       # Server entry point
│   ├── api/               # API client
│   ├── hooks/             # React hooks
│   ├── services/          # Business logic
│   ├── types/             # TypeScript types
│   └── ...
├── database/
│   ├── schema/            # Database schema files
│   └── mock_data/         # Sample data
├── dist/                  # Built frontend (after build)
├── dist-server/           # Compiled API (after build)
├── package.json           # Dependencies and scripts
├── tsconfig.server.json   # Server TypeScript config
├── start.sh               # Production start script
├── owncent.service        # Systemd service file
└── README.md              # This file
```

## Deployment

The application is designed to be deployed to **personal.alfcent.com** with the API accessible at **/api** path.

### Domain Structure
- **Main App**: https://personal.alfcent.com
- **API Endpoints**: https://personal.alfcent.com/api/v1/*
- **Health Check**: https://personal.alfcent.com/health
- **Database**: maria.alfcent.com:3306

### Deployment Options

1. **Systemd Service** (Recommended for production)
2. **PM2** (Process manager)
3. **Docker** (Containerized deployment)
4. **Direct Node** (Simple deployment)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## Key Features

### Frontend
- Dashboard with financial overview
- Transaction management
- Account tracking
- Budget planning
- Savings goals
- Investment tracking
- Debt management
- Responsive design

### API
- JWT-based authentication
- Tier-based rate limiting
- Session management
- Audit logging
- Batch transaction processing
- Account synchronization
- Secure password handling
- MariaDB integration

### Security
- Bcrypt password hashing
- JWT token authentication
- Rate limiting per user tier
- Helmet security headers
- CORS configuration
- Request logging
- Audit trail

## Environment Configuration

Create a `.env` file in the project root:

```env
# Database
DB_HOST=maria.alfcent.com
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE=owncent

# Server
PORT=3000
NODE_ENV=production

# JWT Secrets (use strong, random values)
JWT_ACCESS_SECRET=your-access-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# CORS
CORS_ORIGINS=https://personal.alfcent.com,http://localhost:3000
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout

### User Management
- `GET /api/v1/user/info` - Get user information and rate limits

### Accounts
- `GET /api/v1/accounts` - Get user's financial accounts

### Transactions
- `POST /api/v1/transactions/batch` - Batch insert transactions

### Synchronization
- `GET /api/v1/sync/status` - Get sync status and pending changes

### Health
- `GET /health` - Server health check

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## Database Setup

1. Ensure MariaDB is running at maria.alfcent.com
2. Create the database: `CREATE DATABASE owncent;`
3. Run schema migrations from `database/schema/`:
   ```bash
   mysql -h maria.alfcent.com -u username -p owncent < database/schema/01_create_users_and_auth.sql
   mysql -h maria.alfcent.com -u username -p owncent < database/schema/02_create_financial_tables.sql
   mysql -h maria.alfcent.com -u username -p owncent < database/schema/03_create_admin_tables.sql
   ```
4. (Optional) Load mock data from `database/mock_data/`

## Architecture

This application uses a unified architecture where the Express server serves both the React frontend and API endpoints:

- **Frontend**: React SPA built with Vite
- **API**: Express.js REST API
- **Database**: MariaDB with connection pooling
- **Authentication**: JWT-based with refresh tokens
- **Deployment**: Single server process, single domain

Benefits:
- No CORS issues (same origin)
- Simplified deployment
- Single codebase
- Better performance
- Easier maintenance

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## Integration Details

The application has been integrated from separate frontend and API packages into a unified codebase. See [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md) for:

- Migration details
- Architecture changes
- Benefits of integration
- Before/after comparison

## Scripts

### Development
- `npm run dev` - Start Vite dev server (frontend)
- `npm run dev:server` - Start API server in watch mode

### Production
- `npm run build` - Build both frontend and API
- `npm run build:client` - Build frontend only
- `npm run build:server` - Build API only
- `npm start` - Start production server
- `./start.sh` - Start with environment validation

### Utilities
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Monitoring

### Health Check
```bash
curl https://personal.alfcent.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-03T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### Logs
- **PM2**: `pm2 logs owncent`
- **Systemd**: `journalctl -u owncent -f`
- **Direct**: Check console output

## Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment instructions
- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Integration details and changes
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API reference and examples
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture overview
- **[database/README.md](./database/README.md)** - Database schema documentation

## Troubleshooting

### Build Issues
```bash
# Clean build
rm -rf dist dist-server node_modules
npm install
npm run build
```

### Database Connection
```bash
# Test connection
mysql -h maria.alfcent.com -u username -p
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Frontend Not Loading
1. Check that `dist/` directory exists
2. Verify server is running: `curl http://localhost:3000/health`
3. Check browser console for errors
4. Ensure API calls use relative paths

### API Errors
1. Verify `.env` configuration
2. Check database connectivity
3. Review server logs
4. Test endpoints with curl

## Security Best Practices

- Use strong, unique JWT secrets in production
- Enable HTTPS (via Nginx or reverse proxy)
- Regularly update dependencies
- Configure firewall rules
- Restrict database access
- Enable audit logging
- Set up monitoring and alerts
- Implement backup strategy
- Use environment variables for secrets
- Never commit `.env` files

## Performance Optimization

- Enable Gzip compression
- Set up caching headers for static assets
- Use CDN for static files (optional)
- Optimize database queries with indexes
- Enable connection pooling (already configured)
- Monitor API response times
- Implement rate limiting (already configured)

## Contributing

This is a private, self-hosted application. For issues or improvements:

1. Document the issue clearly
2. Test proposed changes locally
3. Ensure all builds pass: `npm run build`
4. Update relevant documentation
5. Test in production-like environment

## License

Private/Proprietary - Not for public distribution

## Support

For issues or questions, refer to the documentation files:
- Deployment issues: `DEPLOYMENT_GUIDE.md`
- API questions: `API_DOCUMENTATION.md`
- Architecture questions: `ARCHITECTURE.md`
- Integration details: `INTEGRATION_SUMMARY.md`

---

**OwnCent** - Your personal finance, your control.
