# MariaDB Integration Guide for OwnCent

## Overview

This guide provides step-by-step instructions to migrate OwnCent from Supabase to a self-hosted MariaDB infrastructure, eliminating all third-party dependencies.

## Prerequisites

### System Requirements
- MariaDB 10.5 or higher
- Node.js 18 or higher
- npm 9 or higher
- 4GB+ RAM
- 50GB+ storage

### Installation

#### Install MariaDB
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mariadb-server mariadb-client
sudo mysql_secure_installation

# macOS
brew install mariadb
brew services start mariadb

# Windows
# Download from https://mariadb.org/download/
```

#### Install Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS
brew install node@18

# Windows
# Download from https://nodejs.org/
```

## Database Setup

### Step 1: Create Database and User

```bash
sudo mysql -u root -p
```

```sql
-- Create database
CREATE DATABASE owncent CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create application user
CREATE USER 'owncent_app'@'localhost' IDENTIFIED BY 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON owncent.* TO 'owncent_app'@'localhost';
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

### Step 2: Deploy Schema

```bash
# Run schema files in order
mysql -u owncent_app -p owncent < database/schema/01_create_users_and_auth.sql
mysql -u owncent_app -p owncent < database/schema/02_create_financial_tables.sql
mysql -u owncent_app -p owncent < database/schema/03_create_admin_tables.sql
```

### Step 3: Load Test Data (Optional)

```bash
mysql -u owncent_app -p owncent < database/mock_data/01_insert_users_and_auth.sql
mysql -u owncent_app -p owncent < database/mock_data/02_insert_financial_data.sql
mysql -u owncent_app -p owncent < database/mock_data/03_insert_admin_data.sql
```

### Step 4: Verify Database

```bash
mysql -u owncent_app -p owncent
```

```sql
-- Check tables
SHOW TABLES;

-- Check user count
SELECT COUNT(*) FROM users;

-- Check sample data
SELECT email, role, tier FROM users LIMIT 5;

-- Exit
EXIT;
```

## API Server Setup

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Configure Environment

```bash
cp ../.env.example ../.env
```

Edit `.env`:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=owncent
DB_USER=owncent_app
DB_PASSWORD=your_secure_password_here

# JWT Secrets (generate strong random strings)
JWT_ACCESS_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Server Configuration
NODE_ENV=development
PORT=4000
CORS_ORIGINS=http://localhost:5173
```

### Step 3: Build and Start Server

```bash
# Build server
npm run build

# Start development server
npm run dev
```

Verify server is running:
```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T...",
  "uptime": 1.234,
  "environment": "development"
}
```

## Frontend Migration

### Step 1: Remove Supabase Dependencies

Remove Supabase-related files and update imports:

```bash
# Remove Supabase directory
rm -rf supabase/

# Remove Supabase client
rm src/lib/supabase.ts
```

### Step 2: Update Configuration

Update `.env`:
```bash
# Remove Supabase configuration
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...

# Add API configuration
VITE_API_URL=http://localhost:4000/api/v1
```

### Step 3: Update Service Layer

Replace service implementations to use MariaDB API instead of Supabase.

### Step 4: Test Frontend

```bash
npm run dev
```

Test all functionality:
- [ ] Login/logout
- [ ] Dashboard loading
- [ ] Account management
- [ ] Transaction operations
- [ ] Admin panel (if applicable)

## Testing & Validation

### Authentication Testing

```bash
# Test login
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "premium@example.com",
    "password": "Demo123456!"
  }'

# Test authenticated endpoint
curl -X GET http://localhost:4000/api/v1/user \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Database Testing

```sql
-- Test user authentication
SELECT id, email, role, tier FROM users WHERE email = 'premium@example.com';

-- Test account data
SELECT account_name, balance FROM accounts WHERE user_id = 'USER_ID';

-- Test transactions
SELECT description, amount, category FROM transactions WHERE user_id = 'USER_ID' LIMIT 5;
```

### Frontend Testing

1. Open http://localhost:5173
2. Login with demo credentials
3. Navigate through all pages
4. Test CRUD operations
5. Verify admin panel access

## Production Deployment

### Step 1: Production Database

```sql
-- Create production user
CREATE USER 'owncent_prod'@'%' IDENTIFIED BY 'very_strong_production_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON owncent.* TO 'owncent_prod'@'%';
FLUSH PRIVILEGES;
```

### Step 2: Production Server

```bash
# Install PM2 for process management
npm install -g pm2

# Build for production
cd server
npm run build

# Start with PM2
pm2 start dist/index.js --name owncent-api

# Save PM2 configuration
pm2 save
pm2 startup
```

### Step 3: Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Step 4: SSL Certificate

```bash
sudo certbot --nginx -d api.yourdomain.com
```

## Monitoring & Maintenance

### Database Monitoring

```sql
-- Check database size
SELECT
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'owncent';

-- Monitor active connections
SHOW PROCESSLIST;

-- Check slow queries
SHOW STATUS LIKE 'Slow_queries';
```

### Server Monitoring

```bash
# View server logs
pm2 logs owncent-api

# Monitor server status
pm2 status

# View server metrics
pm2 monit
```

### Backup Strategy

```bash
#!/bin/bash
# Daily backup script
BACKUP_DIR="/var/backups/owncent"
DATE=$(date +%Y%m%d_%H%M%S)

mysqldump -u owncent_prod -p'password' owncent > $BACKUP_DIR/owncent_$DATE.sql
gzip $BACKUP_DIR/owncent_$DATE.sql

# Delete backups older than 30 days
find $BACKUP_DIR -name "owncent_*.sql.gz" -mtime +30 -delete
```

## Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check MariaDB status
sudo systemctl status mariadb

# Check user privileges
mysql -u root -p
SHOW GRANTS FOR 'owncent_app'@'localhost';
```

#### API Server Won't Start
```bash
# Check port availability
lsof -i :4000

# Check server logs
npm run dev
```

#### Frontend Can't Connect to API
```bash
# Verify API URL in .env
echo $VITE_API_URL

# Test API endpoint
curl http://localhost:4000/health
```

## Success Validation

### Compliance Checklist
- [ ] No Supabase references in codebase
- [ ] No third-party service dependencies
- [ ] All services use MariaDB
- [ ] Authentication is self-hosted
- [ ] API is self-hosted
- [ ] All naming uses neutral terms

### Functional Checklist
- [ ] User authentication works
- [ ] All pages load correctly
- [ ] CRUD operations functional
- [ ] Admin panel accessible
- [ ] Charts and analytics working
- [ ] Premium features operational

### Performance Checklist
- [ ] Page load times acceptable
- [ ] Database queries optimized
- [ ] API response times good
- [ ] Memory usage reasonable
- [ ] No memory leaks detected

## Next Steps

1. **Complete Migration**: Follow this guide step by step
2. **Test Thoroughly**: Validate all functionality
3. **Monitor Performance**: Track system performance
4. **Document Changes**: Update project documentation
5. **Train Team**: Ensure team understands new architecture

## Support

For issues during migration:
1. Check this guide first
2. Review error logs
3. Verify configuration
4. Test individual components
5. Consult MariaDB and Express.js documentation