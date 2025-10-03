# OwnCent Unified Deployment Guide

This guide covers deploying the unified OwnCent application (frontend + API) to a single domain.

## Architecture

The application has been integrated into a single codebase:
- **Frontend**: React application built with Vite (located in `src/`)
- **API**: Express server (located in `src/server/`)
- **Database**: MariaDB (self-hosted at https://maria.alfcent.com)

Both frontend and API are served from the same Express server, eliminating CORS issues and simplifying deployment.

## Build Process

### Development

```bash
# Run frontend development server
npm run dev

# Run API server in development mode
npm run dev:server
```

### Production Build

```bash
# Build both frontend and API
npm run build

# This runs:
# 1. npm run build:client - Builds React app to dist/
# 2. npm run build:server - Compiles TypeScript server to dist-server/
```

### Start Production Server

```bash
npm start
```

This starts the Express server which:
- Serves API endpoints at `/api/v1/*`
- Serves the React frontend for all other routes
- Handles SPA routing (all non-API routes serve `index.html`)

## Deployment Structure

```
project/
├── dist/                    # Built React frontend
│   ├── index.html
│   └── assets/
├── dist-server/             # Compiled Express server
│   ├── index.js            # Server entry point
│   ├── config.js
│   ├── db.js
│   ├── middleware/
│   └── routes/
├── src/                     # Source code
│   ├── components/
│   ├── server/             # API server source
│   └── ...
└── package.json
```

## Environment Configuration

Create a `.env` file in the project root:

```env
# Database Configuration
DB_HOST=maria.alfcent.com
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=owncent

# Server Configuration
PORT=3000
NODE_ENV=production

# JWT Configuration
JWT_ACCESS_SECRET=your-secure-access-secret-here
JWT_REFRESH_SECRET=your-secure-refresh-secret-here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=30d

# CORS Configuration
CORS_ORIGINS=https://personal.alfcent.com,http://localhost:3000
```

## Deployment to personal.alfcent.com

### Option 1: Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built files
COPY dist/ ./dist/
COPY dist-server/ ./dist-server/
COPY .env ./

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
```

Build and deploy:

```bash
# Build the image
docker build -t owncent:latest .

# Run the container
docker run -d -p 3000:3000 --env-file .env owncent:latest
```

### Option 2: Direct Deployment

1. Build the application locally:
   ```bash
   npm run build
   ```

2. Upload to server:
   ```bash
   # Upload built files and dependencies
   rsync -avz dist/ user@personal.alfcent.com:/opt/owncent/dist/
   rsync -avz dist-server/ user@personal.alfcent.com:/opt/owncent/dist-server/
   rsync -avz package*.json user@personal.alfcent.com:/opt/owncent/
   ```

3. Install dependencies on server:
   ```bash
   ssh user@personal.alfcent.com
   cd /opt/owncent
   npm ci --only=production
   ```

4. Start with PM2:
   ```bash
   pm2 start dist-server/index.js --name owncent
   pm2 save
   pm2 startup
   ```

### Option 3: Nginx Reverse Proxy

Configure Nginx to proxy to the Express server:

```nginx
server {
    listen 80;
    server_name personal.alfcent.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name personal.alfcent.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # Proxy all requests to Express server
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## API Endpoints

All API endpoints are accessible at `/api/v1/*`:

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/user/info` - Get user information
- `GET /api/v1/accounts` - Get accounts list
- `POST /api/v1/transactions/batch` - Batch insert transactions
- `GET /api/v1/sync/status` - Get sync status
- `GET /health` - Health check endpoint

## Frontend Configuration

The frontend automatically uses relative paths for API calls (configured in `src/api/client.ts`):

```typescript
// API client uses relative path
const baseUrl = '/api/v1';
```

This means all API calls go to the same domain, eliminating CORS issues.

## Database Setup

Ensure your MariaDB database is configured:

1. Run schema migrations from `database/schema/`
2. (Optional) Load mock data from `database/mock_data/`
3. Verify connection from the server

## Monitoring and Logs

### Health Check

```bash
curl https://personal.alfcent.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-03T11:22:33.456Z",
  "uptime": 12345.67,
  "environment": "production"
}
```

### Application Logs

If using PM2:
```bash
pm2 logs owncent
```

## Troubleshooting

### Issue: API endpoints return 404

**Solution**: Ensure the server is running and API routes are properly configured. Check that requests to `/api/v1/*` are reaching the Express server.

### Issue: Frontend shows blank page

**Solution**: Check browser console for errors. Verify that `dist/index.html` exists and is being served correctly.

### Issue: Database connection fails

**Solution**: Verify `.env` configuration and ensure the database server is accessible from the application server.

### Issue: CORS errors (should not occur)

**Solution**: Since frontend and API are on the same domain, CORS should not be an issue. If you see CORS errors, verify that API calls are using relative paths (`/api/v1/*`) and not absolute URLs.

## Security Checklist

- [ ] Use strong JWT secrets in production
- [ ] Enable HTTPS for all traffic
- [ ] Configure appropriate CORS origins
- [ ] Set up database user with minimal required permissions
- [ ] Use environment variables for all sensitive configuration
- [ ] Enable rate limiting (already configured in the API)
- [ ] Set up monitoring and alerting
- [ ] Regularly update dependencies

## Performance Optimization

1. **Enable Gzip compression** in Nginx or Express
2. **Set up caching headers** for static assets
3. **Use CDN** for static assets (optional)
4. **Database indexing** - ensure proper indexes on frequently queried columns
5. **Connection pooling** - already configured in `src/server/db.ts`

## Backup and Recovery

### Database Backup

```bash
# Create backup
mysqldump -h maria.alfcent.com -u username -p owncent > backup.sql

# Restore backup
mysql -h maria.alfcent.com -u username -p owncent < backup.sql
```

### Application Backup

Regular backups of:
- `.env` file (store securely)
- Database dumps
- Uploaded files (if any)

## Support

For issues or questions, refer to:
- API Documentation: `API_DOCUMENTATION.md`
- Architecture Guide: `ARCHITECTURE.md`
- Database Schema: `database/schema/`
