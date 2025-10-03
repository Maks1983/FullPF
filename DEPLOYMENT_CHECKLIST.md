# OwnCent Deployment Checklist

Use this checklist when deploying OwnCent to production at personal.alfcent.com.

## Pre-Deployment

### Local Preparation
- [ ] All code changes committed
- [ ] `.env` file configured with production values
- [ ] Build succeeds locally: `npm run build`
- [ ] No TypeScript errors
- [ ] No ESLint errors: `npm run lint`

### Environment Configuration
- [ ] Strong JWT secrets generated (use `openssl rand -base64 32`)
- [ ] Database credentials verified
- [ ] CORS origins set to production domain
- [ ] NODE_ENV set to `production`

### Database Setup
- [ ] MariaDB accessible from server
- [ ] Database `owncent` created
- [ ] Schema migrations applied (01, 02, 03)
- [ ] Database user has correct permissions
- [ ] Connection pooling configured

## Build and Transfer

### Build Application
```bash
# On local machine or CI/CD
npm run build

# Verify outputs exist
ls -la dist/
ls -la dist-server/
```

### Transfer Files
```bash
# Create remote directory
ssh user@personal.alfcent.com "mkdir -p /opt/owncent"

# Upload built files
rsync -avz --delete dist/ user@personal.alfcent.com:/opt/owncent/dist/
rsync -avz --delete dist-server/ user@personal.alfcent.com:/opt/owncent/dist-server/
rsync -avz package*.json user@personal.alfcent.com:/opt/owncent/
rsync -avz start.sh user@personal.alfcent.com:/opt/owncent/
rsync -avz owncent.service user@personal.alfcent.com:/opt/owncent/

# Upload .env (securely - use scp or other secure method)
scp .env user@personal.alfcent.com:/opt/owncent/.env
```

- [ ] All files transferred successfully
- [ ] `.env` file uploaded securely
- [ ] File permissions correct

## Server Configuration

### Install Dependencies
```bash
ssh user@personal.alfcent.com
cd /opt/owncent
npm ci --only=production
```

- [ ] Node.js installed (v18+)
- [ ] Production dependencies installed
- [ ] No dependency errors

### Configure Systemd Service
```bash
# Copy service file
sudo cp /opt/owncent/owncent.service /etc/systemd/system/

# Edit if needed (update paths, user)
sudo nano /etc/systemd/system/owncent.service

# Reload systemd
sudo systemctl daemon-reload

# Enable service
sudo systemctl enable owncent
```

- [ ] Service file copied
- [ ] User/paths configured correctly
- [ ] Service enabled for auto-start

### Make Scripts Executable
```bash
chmod +x /opt/owncent/start.sh
```

- [ ] Start script is executable

## SSL/TLS Configuration

### Option 1: Nginx Reverse Proxy (Recommended)

Create `/etc/nginx/sites-available/owncent`:
```nginx
server {
    listen 80;
    server_name personal.alfcent.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name personal.alfcent.com;

    ssl_certificate /etc/letsencrypt/live/personal.alfcent.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/personal.alfcent.com/privkey.pem;

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

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/owncent /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

- [ ] Nginx installed
- [ ] Site configuration created
- [ ] SSL certificates obtained (Let's Encrypt)
- [ ] Site enabled
- [ ] Nginx reloaded

### Option 2: Direct HTTPS (Not Recommended)
- [ ] SSL certificates configured in Express
- [ ] Firewall rules updated

## Start Application

### Start Service
```bash
sudo systemctl start owncent
```

### Verify Status
```bash
# Check service status
sudo systemctl status owncent

# Check logs
journalctl -u owncent -f

# Check health endpoint
curl http://localhost:3000/health
```

- [ ] Service started successfully
- [ ] No errors in logs
- [ ] Health check returns 200 OK

## DNS and Firewall

### DNS Configuration
- [ ] A record points to server IP
- [ ] DNS propagated (check with `dig personal.alfcent.com`)

### Firewall Rules
```bash
# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# If not using Nginx, allow app port
sudo ufw allow 3000/tcp
```

- [ ] Firewall configured
- [ ] Ports accessible from internet
- [ ] Database port NOT exposed to internet

## Testing

### Health Check
```bash
curl https://personal.alfcent.com/health
```
Expected:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123.45,
  "environment": "production"
}
```

- [ ] Health check successful
- [ ] Returns correct JSON

### Frontend Access
```bash
curl -I https://personal.alfcent.com/
```
Expected: Status 200, Content-Type: text/html

- [ ] Frontend loads
- [ ] No JavaScript errors in console
- [ ] Assets load correctly

### API Test
```bash
curl -X POST https://personal.alfcent.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

- [ ] API responds
- [ ] Returns expected format (success or error)
- [ ] No CORS errors

### Database Connection
```bash
# Check database connectivity from app logs
journalctl -u owncent -n 50 | grep -i database
```

- [ ] Database connection successful
- [ ] No connection errors

## Monitoring Setup

### Log Rotation
Create `/etc/logrotate.d/owncent`:
```
/opt/owncent/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
    copytruncate
}
```

- [ ] Log rotation configured

### Monitoring Tools
- [ ] Application monitoring configured
- [ ] Database monitoring configured
- [ ] Alert notifications set up
- [ ] Uptime monitoring configured

## Backup Configuration

### Database Backup Script
Create `/opt/scripts/backup-owncent.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/backups/owncent"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -h maria.alfcent.com -u username -p'password' owncent > $BACKUP_DIR/owncent_$DATE.sql

# Keep last 30 days
find $BACKUP_DIR -name "owncent_*.sql" -mtime +30 -delete
```

```bash
# Make executable
chmod +x /opt/scripts/backup-owncent.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/scripts/backup-owncent.sh") | crontab -
```

- [ ] Backup script created
- [ ] Cron job configured
- [ ] Test backup runs successfully

## Security Hardening

### Application Security
- [ ] JWT secrets are strong and unique
- [ ] Database credentials are strong
- [ ] `.env` file has restricted permissions (600)
- [ ] No secrets in logs
- [ ] Rate limiting configured

### Server Security
- [ ] Firewall enabled and configured
- [ ] SSH key authentication enabled
- [ ] Root login disabled
- [ ] Automatic security updates enabled
- [ ] Fail2ban configured (optional)

### Database Security
- [ ] Database not exposed to internet
- [ ] Database user has minimal permissions
- [ ] Strong database password
- [ ] Database backups encrypted

## Performance Optimization

### Application
- [ ] Gzip compression enabled (Nginx)
- [ ] Static asset caching configured
- [ ] Database connection pooling configured
- [ ] API rate limiting appropriate for traffic

### Server
- [ ] Adequate resources (CPU, RAM, disk)
- [ ] Node.js process monitored
- [ ] Database performance monitored

## Documentation

- [ ] Deployment documented
- [ ] Credentials stored securely (password manager)
- [ ] Emergency contacts listed
- [ ] Runbook created for common issues

## Post-Deployment

### Immediate Testing
- [ ] Full application walkthrough
- [ ] Test all major features
- [ ] Test authentication flow
- [ ] Test API endpoints
- [ ] Verify data persistence

### 24-Hour Check
- [ ] Review logs for errors
- [ ] Check resource usage
- [ ] Verify backups ran
- [ ] Test monitoring alerts

### Week-One Check
- [ ] Performance analysis
- [ ] User feedback (if applicable)
- [ ] Error rate analysis
- [ ] Backup verification

## Rollback Plan

In case of issues:

1. **Stop the service**
   ```bash
   sudo systemctl stop owncent
   ```

2. **Restore previous version**
   ```bash
   # Assuming you kept a backup
   cd /opt/owncent
   rm -rf dist dist-server
   cp -r dist.backup dist
   cp -r dist-server.backup dist-server
   ```

3. **Restart service**
   ```bash
   sudo systemctl start owncent
   ```

- [ ] Previous version backed up before deployment
- [ ] Rollback procedure tested
- [ ] Database rollback plan documented

## Sign-Off

Deployment completed by: _______________

Date: _______________

Verified by: _______________

Notes:
-
-
-

---

**Remember**: Always test in a staging environment first!
