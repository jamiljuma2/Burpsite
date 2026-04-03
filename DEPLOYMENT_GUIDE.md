# Burpsite Production Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying Burpsite to a production environment.

---

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- PostgreSQL client tools (psql)
- Nginx or Apache (for frontend reverse proxy)
- SSL/TLS certificate (valid, not self-signed)
- Domain names for frontend and API

---

## Pre-Deployment Checklist

### 1. Environment Variables

**Backend: Create `.env` in `backend/` directory**
```bash
PORT=5000
NODE_ENV=production

# Generate secure JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Neon PostgreSQL connection
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=verify-full&channel_binding=require

# Frontend URL (WITH HTTPS)
FRONTEND_URL=https://app.yourdomain.com

# Proxy port
PROXY_PORT=8888
```

**Frontend: Create `.env` in `frontend/` directory**
```bash
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### 2. SSL/TLS Certificates

Obtain valid certificates (not self-signed):
- **Let's Encrypt (Free)** - Recommended for production
  ```bash
  certbot certonly --manual -d yourdomain.com -d api.yourdomain.com
  ```
- Store certificate and key in secure location (e.g., `/etc/letsencrypt/live/`)

### 3. Firewall Configuration

```bash
# Allow incoming traffic
ufw allow 80/tcp     # HTTP redirect
ufw allow 443/tcp    # HTTPS
ufw allow 22/tcp     # SSH

# Restrict internal backend access
ufw allow from 127.0.0.1 to 127.0.0.1 port 5000
# Or if using reverse proxy on same server
```

---

## Deployment Steps

### Step 1: Prepare Backend

```bash
cd backend

# Install dependencies (production only)
npm install --production

# Create `.env` file with production values
# (See Pre-Deployment Checklist above)

# Build if needed (no build step for Node.js)
# Just verify all dependencies are installed
npm list --production
```

### Step 2: Prepare Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create `.env` file with production API URL
echo "REACT_APP_API_URL=https://api.yourdomain.com/api" > .env

# Build static files
npm run build

# Output: frontend/build/ directory with optimized assets
ls -la build/
```

### Step 3: Set Up Backend Service

**Option A: Using PM2 (Recommended)**

```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem.config.js in root
pm2 start ecosystem.config.js --env production

# Auto-start on reboot
pm2 startup
pm2 save
```

**ecosystem.config.js:**
```javascript
module.exports = {
  apps: [
    {
      name: 'burpsite-api',
      script: './backend/src/server.js',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 4000,
      max_restarts: 10,
      autorestart: true,
    },
  ],
};
```

**Option B: Using Systemd Service**

Create `/etc/systemd/system/burpsite.service`:
```ini
[Unit]
Description=Burpsite API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/burpsite
Environment="NODE_ENV=production"
ExecStart=/usr/bin/npm --prefix /var/www/burpsite/backend start
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Start service:
```bash
sudo systemctl enable burpsite
sudo systemctl start burpsite
sudo systemctl status burpsite
```

### Step 4: Set Up Frontend Serving (Nginx)

Create `/etc/nginx/sites-available/burpsite`:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name app.yourdomain.com api.yourdomain.com;
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Frontend (React SPA)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.yourdomain.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss;
    gzip_min_length 1024;
    
    # Frontend serving
    root /var/www/burpsite/frontend/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # API proxy
    location /api {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_buffering off;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/burpsite /etc/nginx/sites-enabled/burpsite
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Database Verification

```bash
# Test Neon connection
psql "postgresql://[user]:[password]@[host]/[database]?sslmode=verify-full"

# Verify tables exist
\dt

# Check admin user exists
SELECT * FROM users WHERE role='admin' LIMIT 1;

# Exit
\q
```

### Step 6: Verify Deployment

```bash
# Backend health check
curl -s https://api.yourdomain.com/api/health | jq

# Frontend URL
open https://app.yourdomain.com

# Check logs
pm2 logs burpsite-api
# or
sudo journalctl -u burpsite -f
```

---

## Production Configuration Recommendations

### 1. Database Backups
```bash
# Daily backup script (cron job)
0 2 * * * pg_dump $DATABASE_URL > /var/backups/burpsite-$(date +\%Y\%m\%d).sql
```

### 2. SSL Certificate Auto-Renewal
```bash
# Let's Encrypt auto-renewal (already set up by certbot)
0 3 * * * certbot renew --quiet
```

### 3. Monitoring & Alerts

Install monitoring tools:
- **Backend:** PM2 monitoring dashboard
  ```bash
  pm2 web
  # Dashboard at http://localhost:9615
  ```
- **Frontend:** Sentry for error tracking
- **Database:** Neon cloud monitoring dashboard

### 4. Log Aggregation

Use log files and monitor:
```bash
# Backend logs (PM2)
tail -f /var/log/pm2/out.log

# Nginx access/error
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Journalctl (if using systemd)
journalctl -u burpsite -f
```

---

## Troubleshooting

### Backend Won't Start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Check logs
pm2 logs burpsite-api
journalctl -u burpsite -n 50

# Try manual start
NODE_ENV=production npm start --prefix backend
```

### Frontend Showing API Errors
```bash
# Check REACT_APP_API_URL is set correctly
grep "REACT_APP_API_URL" frontend/.env

# Verify API proxy in Nginx config
curl -v https://api.yourdomain.com/api/health

# Check browser console (F12) for CORS errors
```

### Database Connection Issues
```bash
# Test connection string
psql $DATABASE_URL -c "SELECT 1"

# Verify SSL settings
psql "postgresql://...?sslmode=verify-full" -c "SELECT ssl_is_used();"
```

---

## Post-Deployment Tasks

### 1. Security Verification
```bash
# Check security headers
curl -I https://app.yourdomain.com | grep -i "x-frame\|x-content\|strict\|csp"

# Test SSL/TLS strength
openssl s_client -connect api.yourdomain.com:443 -tls1_2

# Verify HSTS preload
curl -I https://api.yourdomain.com/health | grep "Strict-Transport"
```

### 2. Create Admin User (if needed)
```bash
cd backend

node -e "
require('dotenv').config();
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('AdminPassword123', 10);
  const user = await User.create('admin', 'admin@yourdomain.com', hashedPassword);
  
  // Update role to admin
  const db = require('./src/config/database');
  await db.query('UPDATE users SET role = \$1 WHERE id = \$2', ['admin', user.id]);
  
  console.log('Admin user created:', user.email);
}

createAdmin().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
"
```

### 3. Load Testing
```bash
# Install Apache Bench
apt-get install apache2-utils

# Test backend API
ab -n 1000 -c 10 https://api.yourdomain.com/api/health

# Test frontend
ab -n 500 -c 5 https://app.yourdomain.com/
```

---

## Rollback Procedures

If issues occur:

```bash
# Stop services
pm2 stop burpsite-api
# or
sudo systemctl stop burpsite

# Revert code
git checkout previous-stable-version

# Restart
pm2 restart burpsite-api
# or
sudo systemctl start burpsite
```

---

## Performance Tuning

### 1. Node.js Cluster Mode
Already configured in ecosystem.config.js:
```javascript
instances: 2,  // Change to 0 for CPU count
exec_mode: 'cluster'
```

### 2. Database Connection Pooling
Already enabled in `backend/src/config/database.js`

### 3. Frontend Caching
Configured in Nginx config (1-year cache for assets)

### 4. Gzip Compression
Enabled in Nginx config for all text-based resources

---

## Support & Escalation

**Issues:**
1. Check `/var/log/nginx/error.log`
2. Check PM2 logs: `pm2 logs`
3. Verify database connectivity
4. Check firewall rules

**Rollback:**
1. Stop services
2. Restore from backup
3. Restart services

**Emergency Contacts:**
- Neon Database Support: https://console.neon.tech/
- Let's Encrypt Support: https://letsencrypt.org/community/

---

## Next Steps

1. ✅ Review this deployment guide
2. ✅ Prepare environment variables
3. ✅ Obtain SSL certificates
4. ✅ Configure infrastructure
5. ✅ Deploy backend service
6. ✅ Deploy frontend
7. ✅ Run verification tests
8. ✅ Set up monitoring
9. ✅ Enable daily backups
10. ✅ Schedule security audits

**All systems ready for production deployment!**

---

**Version:** 1.0  
**Last Updated:** April 3, 2026
