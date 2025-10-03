# MariaDB Migration Guide

Complete guide for migrating OwnCent from Supabase to self-hosted MariaDB infrastructure.

## Overview

This migration moves OwnCent from a Supabase-hosted PostgreSQL database with Edge Functions to a self-hosted MariaDB database with an Express.js API server.

### What's Changing

**Before:**
- Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth
- API: Supabase Edge Functions (Deno)
- Row Level Security: PostgreSQL RLS policies

**After:**
- Database: MariaDB 10.5+
- Authentication: JWT with bcrypt password hashing
- API: Express.js server (Node.js)
- Security: Application-layer authentication and authorization

## Prerequisites

### System Requirements

- **MariaDB**: Version 10.5 or higher
- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher
- **Operating System**: Linux, macOS, or Windows with WSL2

### Installation

#### Install MariaDB

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mariadb-server mariadb-client
sudo mysql_secure_installation
```

**macOS (Homebrew):**
```bash
brew install mariadb
brew services start mariadb
mysql_secure_installation
```

**Windows:**
Download and install from https://mariadb.org/download/

#### Install Node.js

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**macOS (Homebrew):**
```bash
brew install node@18
```

**Windows:**
Download from https://nodejs.org/

## Migration Steps

### Step 1: Database Setup

#### 1.1 Create Database and User

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

-- Verify
SHOW GRANTS FOR 'owncent_app'@'localhost';

-- Exit
EXIT;
```

#### 1.2 Run Schema Migrations

```bash
# Navigate to project directory
cd /path/to/project

# Run schema scripts in order
mysql -u owncent_app -p owncent < database/schema/01_create_users_and_auth.sql
mysql -u owncent_app -p owncent < database/schema/02_create_financial_tables.sql
mysql -u owncent_app -p owncent < database/schema/03_create_admin_tables.sql
```

#### 1.3 Load Mock Data (Optional for Testing)

```bash
mysql -u owncent_app -p owncent < database/mock_data/01_insert_users_and_auth.sql
mysql -u owncent_app -p owncent < database/mock_data/02_insert_financial_data.sql
mysql -u owncent_app -p owncent < database/mock_data/03_insert_admin_data.sql
```

#### 1.4 Verify Database Setup

```bash
mysql -u owncent_app -p owncent
```

```sql
-- Check tables
SHOW TABLES;

-- Check user count
SELECT COUNT(*) FROM users;

-- Check accounts
SELECT account_name, balance FROM accounts LIMIT 5;

-- Exit
EXIT;
```

### Step 2: API Server Setup

#### 2.1 Install Server Dependencies

```bash
cd server
npm install
```

#### 2.2 Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp ../.env.example ../.env
```

Edit `.env` and configure all required variables:

```bash
# Database (CRITICAL: Update with your actual credentials)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=owncent
DB_USER=owncent_app
DB_PASSWORD=your_actual_secure_password

# JWT Secrets (CRITICAL: Generate strong random strings)
JWT_ACCESS_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Optional: Adjust other settings as needed
PORT=4000
NODE_ENV=development
```

#### 2.3 Generate Strong JWT Secrets

**Linux/macOS:**
```bash
# Access secret
echo "JWT_ACCESS_SECRET=$(openssl rand -base64 32)" >> ../.env

# Refresh secret
echo "JWT_REFRESH_SECRET=$(openssl rand -base64 32)" >> ../.env
```

**Windows (PowerShell):**
```powershell
$bytes = New-Object Byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)
echo "JWT_ACCESS_SECRET=$secret" >> ../.env
```

#### 2.4 Build Server

```bash
# From server directory
npm run build
```

#### 2.5 Test Server Connection

```bash
# Start development server
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 OwnCent API Server running on port 4000
📝 Environment: development
```

Test the health endpoint:
```bash
curl http://localhost:4000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-03T...",
  "uptime": 1.234,
  "environment": "development"
}
```

### Step 3: Frontend Configuration

#### 3.1 Update Environment Variables

Edit `.env` in the project root:

```bash
# Update API URL to point to new server
VITE_API_URL=http://localhost:4000/api/v1
```

#### 3.2 Install Frontend Dependencies

```bash
cd /path/to/project
npm install
```

#### 3.3 Build Frontend

```bash
npm run build
```

### Step 4: Data Migration (If Migrating from Existing Supabase)

If you have existing data in Supabase:

#### 4.1 Export Supabase Data

Using Supabase CLI:
```bash
supabase db dump -f supabase_export.sql
```

Or use the Supabase dashboard to export CSV files.

#### 4.2 Transform Data

Create a transformation script to convert:
- PostgreSQL `uuid` to MariaDB `CHAR(36)`
- PostgreSQL `jsonb` to MariaDB `JSON`
- PostgreSQL `timestamp with time zone` to MariaDB `TIMESTAMP`

#### 4.3 Import Data

```bash
mysql -u owncent_app -p owncent < transformed_data.sql
```

#### 4.4 Verify Data Integrity

```sql
-- Check record counts match
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'accounts', COUNT(*) FROM accounts
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions;

-- Verify foreign key relationships
SELECT
  COUNT(*) as orphaned_accounts
FROM accounts a
LEFT JOIN users u ON a.user_id = u.id
WHERE u.id IS NULL;
```

### Step 5: Testing

#### 5.1 Test Authentication

```bash
# Login with demo user
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "premium@example.com",
    "password": "Demo123456!"
  }'
```

Expected response includes `accessToken` and `refreshToken`.

#### 5.2 Test Authenticated Endpoints

```bash
# Get user profile (replace TOKEN with accessToken from login)
curl -X GET http://localhost:4000/api/v1/user \
  -H "Authorization: Bearer TOKEN"

# Get accounts
curl -X GET http://localhost:4000/api/v1/accounts \
  -H "Authorization: Bearer TOKEN"

# Get transactions
curl -X GET http://localhost:4000/api/v1/transactions \
  -H "Authorization: Bearer TOKEN"
```

#### 5.3 Test Rate Limiting

```bash
# Run 35 requests rapidly (free tier limit is 30/min)
for i in {1..35}; do
  curl -X GET http://localhost:4000/api/v1/accounts \
    -H "Authorization: Bearer TOKEN" &
done
```

The 31st-35th requests should return rate limit errors.

#### 5.4 Test Frontend Integration

```bash
# Start frontend dev server
npm run dev
```

Open http://localhost:5173 and:
1. Login with demo credentials
2. Verify dashboard loads
3. Check that accounts and transactions display
4. Test adding/editing data

### Step 6: Production Deployment

#### 6.1 Production Database Setup

```sql
-- Create production user with restricted privileges
CREATE USER 'owncent_prod'@'%' IDENTIFIED BY 'very_strong_production_password';

-- Grant only necessary privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON owncent.* TO 'owncent_prod'@'%';

-- No DROP, CREATE, ALTER privileges for production user
FLUSH PRIVILEGES;
```

#### 6.2 Production Environment Variables

Create `.env.production`:

```bash
NODE_ENV=production
PORT=4000

# Database (use production credentials)
DB_HOST=your-production-db-host
DB_PORT=3306
DB_NAME=owncent
DB_USER=owncent_prod
DB_PASSWORD=very_strong_production_password

# JWT (use strong secrets, NEVER reuse development secrets)
JWT_ACCESS_SECRET=production_access_secret_min_32_chars
JWT_REFRESH_SECRET=production_refresh_secret_min_32_chars

# CORS (specify your production domain)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Security
BCRYPT_ROUNDS=12

# Logging
LOG_LEVEL=warn
```

#### 6.3 Build for Production

```bash
# Build server
cd server
npm run build

# Build frontend
cd ..
npm run build
```

#### 6.4 Deploy with Process Manager (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Start API server
cd server
pm2 start dist/index.js --name "owncent-api"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### 6.5 Setup Reverse Proxy (Nginx)

Create `/etc/nginx/sites-available/owncent`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/owncent /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6.6 Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
sudo systemctl reload nginx
```

### Step 7: Monitoring and Maintenance

#### 7.1 Setup Database Backups

Create backup script `/usr/local/bin/backup-owncent.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/owncent"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Full backup
mysqldump -u owncent_prod -p'your_password' owncent \
  > $BACKUP_DIR/owncent_$DATE.sql

# Compress
gzip $BACKUP_DIR/owncent_$DATE.sql

# Delete backups older than 30 days
find $BACKUP_DIR -name "owncent_*.sql.gz" -mtime +30 -delete
```

Add to crontab:
```bash
sudo crontab -e
# Add: Run daily at 2 AM
0 2 * * * /usr/local/bin/backup-owncent.sh
```

#### 7.2 Monitor Server Logs

```bash
# View API server logs
pm2 logs owncent-api

# View MariaDB error log
sudo tail -f /var/log/mysql/error.log

# View Nginx access/error logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

#### 7.3 Database Maintenance

Schedule regular maintenance tasks:

```sql
-- Optimize tables monthly
OPTIMIZE TABLE users, accounts, transactions, audit_logs;

-- Analyze tables weekly
ANALYZE TABLE users, accounts, transactions;

-- Clean old audit logs quarterly
DELETE FROM audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 2 YEAR);

-- Clean expired sessions daily
DELETE FROM sessions WHERE expires_at < NOW();
```

#### 7.4 Performance Monitoring

Monitor key metrics:

```sql
-- Check database size
SELECT
  table_schema AS 'Database',
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'owncent'
GROUP BY table_schema;

-- Check table sizes
SELECT
  table_name AS 'Table',
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'owncent'
ORDER BY (data_length + index_length) DESC;

-- Check slow queries
SHOW PROCESSLIST;
```

## Troubleshooting

### Common Issues

#### Database Connection Fails

**Error:** `ER_ACCESS_DENIED_ERROR: Access denied for user`

**Solution:**
```sql
-- Check user privileges
SHOW GRANTS FOR 'owncent_app'@'localhost';

-- Reset password if needed
ALTER USER 'owncent_app'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

#### JWT Token Errors

**Error:** `Invalid token` or `Token expired`

**Solution:**
- Verify `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` are set
- Ensure secrets match between server restarts
- Check token expiration times in `.env`

#### Rate Limiting Issues

**Error:** `Rate Limit Exceeded`

**Solution:**
- Increase limits in `.env`:
  ```bash
  RATE_LIMIT_FREE=60
  RATE_LIMIT_PREMIUM=300
  ```
- Restart server for changes to take effect

#### Foreign Key Constraint Violations

**Error:** `Cannot add or update a child row: a foreign key constraint fails`

**Solution:**
- Insert parent records first (users → accounts → transactions)
- Verify referenced IDs exist before inserting child records

#### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::4000`

**Solution:**
```bash
# Find process using port 4000
lsof -i :4000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=4001
```

### Getting Help

1. Check server logs: `pm2 logs owncent-api`
2. Check database logs: `sudo tail -f /var/log/mysql/error.log`
3. Review configuration in `.env`
4. Verify database connection: `mysql -u owncent_app -p owncent`
5. Test API endpoints with curl

## Rollback Plan

If migration fails, rollback to Supabase:

1. Stop API server:
   ```bash
   pm2 stop owncent-api
   ```

2. Revert `.env`:
   ```bash
   git checkout .env
   # Or restore from backup
   ```

3. Restart frontend with Supabase configuration

4. Verify Supabase connection still works

5. Investigate migration issue before retrying

## Post-Migration Checklist

- [ ] Database schema created successfully
- [ ] Mock/production data loaded
- [ ] API server running and accessible
- [ ] Frontend connected to API server
- [ ] Authentication working (login/logout/refresh)
- [ ] All endpoints responding correctly
- [ ] Rate limiting functioning
- [ ] Database backups scheduled
- [ ] SSL certificates installed (production)
- [ ] Monitoring configured
- [ ] Documentation updated
- [ ] Team trained on new infrastructure

## Security Checklist

- [ ] Strong JWT secrets generated
- [ ] Database user has minimal required privileges
- [ ] Production database password is strong and unique
- [ ] `.env` file is not committed to version control
- [ ] CORS origins properly configured
- [ ] Rate limiting enabled and tested
- [ ] HTTPS/SSL enabled (production)
- [ ] Database backups encrypted
- [ ] Audit logging enabled
- [ ] Password reset tokens expire appropriately

## Performance Optimization

### Database Indexes

Already included in schema, but verify:

```sql
-- Check existing indexes
SHOW INDEX FROM users;
SHOW INDEX FROM accounts;
SHOW INDEX FROM transactions;

-- Add custom indexes if needed
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_category ON transactions(category);
```

### Connection Pooling

Adjust pool size in `.env`:

```bash
# For high-traffic production servers
DB_POOL_MAX=20
```

### Query Optimization

Monitor slow queries:

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1; -- 1 second threshold

-- View slow queries
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;
```

## Next Steps

1. **Monitor performance** for first 24-48 hours
2. **Review logs** daily for errors or warnings
3. **Test backup restoration** procedure
4. **Document** any custom configurations
5. **Train team** on new infrastructure
6. **Plan capacity** for growth

## Support Resources

- MariaDB Documentation: https://mariadb.org/documentation/
- Express.js Guide: https://expressjs.com/
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices
- JWT.io: https://jwt.io/

---

**Migration Complete!** Your OwnCent application is now running on self-hosted MariaDB infrastructure with full control over your data and infrastructure.
