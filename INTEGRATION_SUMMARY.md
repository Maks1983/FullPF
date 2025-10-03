# OwnCent Integration Summary

## What Changed

The OwnCent application has been successfully integrated into a single, unified codebase. Previously, the API and frontend were separate packages with different build processes and deployment requirements. Now they are combined into one cohesive application.

## Architecture Changes

### Before Integration
```
project/
├── frontend/          # Separate React app
│   ├── package.json
│   └── src/
└── server/            # Separate Express API
    ├── package.json
    └── src/
```

**Issues:**
- CORS configuration required
- Two separate deployments
- Two separate build processes
- Different port management
- Complex configuration

### After Integration
```
project/
├── package.json       # Single package file
├── src/
│   ├── components/    # React frontend
│   ├── server/        # Express API
│   └── ...
├── dist/              # Built frontend
└── dist-server/       # Compiled API
```

**Benefits:**
- No CORS issues (same origin)
- Single deployment
- Unified build process
- Single domain/port
- Simplified configuration

## Key Changes

### 1. Package Management
- **Merged** all dependencies into root `package.json`
- **Removed** separate `server/package.json`
- **Unified** build scripts:
  ```json
  {
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "tsc -p tsconfig.server.json"
  }
  ```

### 2. Server Configuration
- **Updated** `src/server/index.ts` to serve both API and frontend
- **Added** static file serving for React build
- **Configured** SPA fallback routing
- **Maintained** API routes at `/api/v1/*`

### 3. API Client
- **Changed** base URL from absolute to relative: `/api/v1`
- **Removed** Supabase function references
- **Updated** endpoint paths to match Express routes:
  - `/api-login` → `/auth/login`
  - `/api-user` → `/user/info`
  - `/api-accounts` → `/accounts`
  - `/api-transactions` → `/transactions/batch`
  - `/api-sync-status` → `/sync/status`

### 4. Build Configuration
- **Created** `tsconfig.server.json` for API compilation
- **Configured** separate output directories:
  - `dist/` for frontend (Vite output)
  - `dist-server/` for API (TypeScript output)

## URL Structure

All traffic is served from `https://personal.alfcent.com`:

| Path | Handler | Purpose |
|------|---------|---------|
| `/api/v1/*` | Express API | All API endpoints |
| `/health` | Express API | Health check |
| `/*` | Static Files → SPA | React frontend |

## Environment Configuration

Single `.env` file at project root:

```env
# Database (MariaDB at maria.alfcent.com)
DB_HOST=maria.alfcent.com
DB_PORT=3306
DB_USER=username
DB_PASSWORD=password
DB_DATABASE=owncent

# Server
PORT=3000
NODE_ENV=production

# JWT
JWT_ACCESS_SECRET=secret
JWT_REFRESH_SECRET=secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# CORS (same origin, but keeping for API flexibility)
CORS_ORIGINS=https://personal.alfcent.com
```

## Deployment Workflow

### Development
```bash
# Terminal 1: Frontend dev server (HMR)
npm run dev

# Terminal 2: API server (watch mode)
npm run dev:server
```

### Production Build
```bash
# Build everything
npm run build

# Outputs:
# - dist/ (React app)
# - dist-server/ (API server)
```

### Production Deployment
```bash
# Option 1: Direct start
npm start

# Option 2: Using start script
./start.sh

# Option 3: PM2
pm2 start dist-server/index.js --name owncent

# Option 4: Systemd
sudo cp owncent.service /etc/systemd/system/
sudo systemctl enable owncent
sudo systemctl start owncent
```

## Benefits of Integration

### 1. No CORS Issues
- Frontend and API on same origin
- No preflight OPTIONS requests
- Simplified security configuration

### 2. Simplified Deployment
- Single build command
- Single server process
- One domain to manage
- Easier SSL/TLS setup

### 3. Better Development Experience
- Consistent environment
- Easier debugging
- Single codebase to maintain

### 4. Production Benefits
- Lower infrastructure costs
- Simpler monitoring
- Unified logging
- Single point of failure (but easier to manage)

### 5. Self-Hosted
- No Supabase dependency
- Full control over infrastructure
- Direct MariaDB connection
- Custom API implementation

## Database Connection

Direct connection to MariaDB:
- **Host**: maria.alfcent.com
- **Port**: 3306
- **Database**: owncent
- **Connection Pool**: Managed by `src/server/db.ts`

No intermediate services or edge functions required.

## API Endpoints

All endpoints accessible at `https://personal.alfcent.com/api/v1/`:

### Authentication
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

### User
- `GET /api/v1/user/info`

### Accounts
- `GET /api/v1/accounts`

### Transactions
- `POST /api/v1/transactions/batch`

### Sync
- `GET /api/v1/sync/status`

### Health
- `GET /health`

## Security Features

### Already Implemented
- JWT-based authentication
- Password hashing (bcrypt)
- Rate limiting (tier-based)
- Helmet security headers
- Request logging
- Audit trail
- Session management

### Recommended Additions
- HTTPS (via Nginx or reverse proxy)
- Firewall rules
- Database access restrictions
- Regular security updates
- Backup strategy

## Testing the Integration

### 1. Health Check
```bash
curl https://personal.alfcent.com/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "2025-10-03T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### 2. Frontend Loading
```bash
curl https://personal.alfcent.com/
```

Should return the React app's `index.html`.

### 3. API Request
```bash
curl -X POST https://personal.alfcent.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

Should return authentication response or error.

## Migration Checklist

- [x] Merged package dependencies
- [x] Moved server code to `src/server/`
- [x] Updated API client to use relative paths
- [x] Configured unified build process
- [x] Updated server to serve static files
- [x] Removed separate server package
- [x] Created deployment documentation
- [ ] Deploy to production server
- [ ] Configure Nginx/reverse proxy
- [ ] Set up SSL certificates
- [ ] Configure systemd service
- [ ] Test all endpoints
- [ ] Set up monitoring
- [ ] Configure backups

## Files Created/Modified

### New Files
- `tsconfig.server.json` - Server TypeScript configuration
- `DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- `INTEGRATION_SUMMARY.md` - This file
- `start.sh` - Production start script
- `owncent.service` - Systemd service file

### Modified Files
- `package.json` - Updated scripts and dependencies
- `src/server/index.ts` - Added static file serving
- `src/api/client.ts` - Changed to relative paths

### Removed
- `server/` directory - Moved to `src/server/`
- `server/package.json` - Merged into root
- `server/tsconfig.json` - Replaced with `tsconfig.server.json`

## Next Steps

1. **Test Locally**
   ```bash
   npm run build
   npm start
   ```
   Visit `http://localhost:3000`

2. **Deploy to Server**
   - Follow `DEPLOYMENT_GUIDE.md`
   - Configure domain and SSL
   - Set up systemd service

3. **Configure Monitoring**
   - Application logs
   - Database performance
   - API response times
   - Error tracking

4. **Set Up Backups**
   - Database dumps
   - Application configuration
   - User data

## Support Resources

- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **API Documentation**: `API_DOCUMENTATION.md`
- **Architecture**: `ARCHITECTURE.md`
- **Database Schema**: `database/schema/`

## Troubleshooting

Common issues and solutions documented in `DEPLOYMENT_GUIDE.md`.

For integration-specific issues:
- Verify build output in `dist/` and `dist-server/`
- Check console logs for API connection errors
- Ensure `.env` is properly configured
- Verify database connectivity
