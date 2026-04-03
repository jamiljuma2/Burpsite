# Burpsite Backend - Render Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying Burpsite backend to Render.

**Render Features Used:**
- Node.js Web Service
- PostgreSQL Database (or external Neon)
- Auto-deploy from GitHub
- Free tier available (with limitations)

---

## Prerequisites

1. **Render Account** - https://render.com (sign up with GitHub for easier auth)
2. **GitHub Repository** - Already committed: https://github.com/jamiljuma2/Burpsite
3. **Neon PostgreSQL URL** - Already configured in project
4. **Environment Variables** - JWT secret and database credentials

---

## Step 1: Connect GitHub Repository to Render

1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Select **GitHub** as repository source
4. Connect your GitHub account if not already connected
5. Search for and select **"Burpsite"** repository
6. Click **Connect**

---

## Step 2: Configure Web Service

### Basic Settings

**Name:** `burpsite-api`

**Environment:** `Node`

**Build Command:**
```bash
cd backend && npm install
```

**Start Command:**
```bash
cd backend && npm start
```

**Publishing Dir:** (leave blank)

---

## Step 3: Environment Variables

In the Render dashboard, add these environment variables under **Environment**:

### Critical Variables

```
PORT=5000
NODE_ENV=production
JWT_SECRET=[GENERATE NEW - see below]
DATABASE_URL=postgresql://[neon_user]:[neon_password]@[neon_host]/neondb?sslmode=verify-full&channel_binding=require
FRONTEND_URL=https://[your-frontend-domain].onrender.com
```

### Generate Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Copy the output and paste into `JWT_SECRET` field.**

### Complete Environment Variables for Render

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Enable production error handling |
| `PORT` | `5000` | Default Render port |
| `JWT_SECRET` | `[SECURE_HEX_STRING]` | Generate new, never commit |
| `DATABASE_URL` | `postgresql://[user]:[password]@[host]/neondb?sslmode=verify-full&channel_binding=require` | Use your Neon connection string |
| `FRONTEND_URL` | `https://burpsite-frontend.onrender.com` | Update with actual frontend domain |
| `PROXY_PORT` | `8888` | For proxy module |

---

## Step 4: Instance Type & Plan

### For Development/Testing (Free Tier)
- **Instance Type:** Free
- **Note:** Service will spin down after 15 minutes of inactivity

### For Production (Paid)
- **Instance Type:** Starter ($5/month - $7/month)
- **Benefits:** Always running, auto-restart on crash, persistent connections

**Recommendation:** Use paid tier for production to avoid cold starts and spindowns.

---

## Step 5: Deploy Configuration in Render Dashboard

1. **Scroll down** to "Build & Deployment"
2. Set **Build Command:**
   ```
   cd backend && npm install
   ```

3. Set **Start Command:**
   ```
   cd backend && npm start
   ```

4. Click **Create Web Service**

---

## Step 6: Render Configuration Files

No additional files needed - Render automatically detects Node.js from `package.json`.

**Existing files are compatible:**
- ✅ `backend/package.json` - Dependencies defined
- ✅ `backend/package-lock.json` - Locked versions
- ✅ `backend/src/server.js` - Entry point

---

## Step 7: Health Check Configuration (Optional)

In Render dashboard, configure health check:

**Health Check Path:** `/health`  
**Health Check Protocol:** `HTTP`  
**Timeout:** 30 seconds  
**Initial Delay:** 60 seconds  
**Check Interval:** 60 seconds

---

## Step 8: Verify Deployment

Once deployed, you'll see:
- ✅ Green "Running" status in Render dashboard
- ✅ Logs showing: "✓ Database initialized" and "✓ Burpsite API running on port 5000"

### Test Endpoints

```bash
# Backend running on Render
curl https://burpsite.onrender.com/health

# Should return:
# {"status":"ok","message":"Burpsite API is running"}
```

---

## Step 9: Configure Frontend to Use Render Backend

Update frontend environment variables to point to Render backend:

**Frontend `.env`:**
```
REACT_APP_API_URL=https://burpsite.onrender.com/api
```

**Redeploy frontend** with updated API URL.

---

## Important: Auto-Deploy from GitHub

Render will **automatically redeploy** whenever you push to the main branch:

```bash
git add .
git commit -m "Update backend settings"
git push origin main
```

Render automatically triggers a new build and deployment.

---

## Environment Variables Reference

### Backend Environment Variables

```bash
# Server
PORT=5000
NODE_ENV=production

# Security
JWT_SECRET=f3ff78c5842b635a7e42b322a2c6334f831249d01bba1a1478c6e680e091769a

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://neondb_owner:password@ep-host.region.neon.tech/neondb?sslmode=verify-full&channel_binding=require

# Frontend Integration
FRONTEND_URL=https://burpsite-frontend.onrender.com

# Backend API
BACKEND_URL=https://burpsite.onrender.com

# Features
PROXY_PORT=8888
```

---

## Render Dashboard - Quick Reference

### View Logs
1. Go to Web Service dashboard
2. Click **Logs** tab
3. Real-time logs of API startup and requests

### Restart Service
1. Click **Manual Deploy**
2. Select **Deploy Latest Commit**
3. Or click **Restart Service** in Settings

### Environment Variables
1. Click **Environment** tab
2. Add/edit variables
3. Click **Save Changes** (auto-redeploys)

### Redeploy Manually
1. Click **Manual Deploy** button
2. Choose commit to deploy
3. Deployment starts automatically

---

## Common Issues & Solutions

### "Build failed"
**Check logs:**
1. Go to Logs tab
2. Look for error messages
3. Common issues:
   - Missing dependencies: Run `npm install` locally first
   - Wrong build command: Use `cd backend && npm install`
   - Node version: Render uses Node 18+ by default

### "Service crashed"
**Troubleshooting:**
1. Check logs for error
2. Verify JWT_SECRET is set
3. Verify DATABASE_URL is correct
4. Check FRONTEND_URL is valid HTTPS URL

### "Health check failed"
**Solutions:**
1. Wait 60+ seconds after deployment
2. Check if `/health` endpoint is responding
3. Verify API is running: `curl https://burpsite.onrender.com/health`

### "Database connection timeout"
**Verify:**
1. DATABASE_URL is correct (sslmode=verify-full)
2. Neon PostgreSQL is accessible from internet
3. Credentials are correct
4. Network allows outbound connections

---

## Production Best Practices for Render

### 1. Use Paid Instance
```
Starter: $5-7/month (recommended minimum)
- Always running (no cold starts)
- Auto-restart on crash
- Better performance
```

### 2. Set Up Backups
- Enable automatic backups in Neon PostgreSQL
- Test restore procedure monthly

### 3. Enable Notifications
1. Go to **Settings** → **Notifications**
2. Enable deployment and error alerts
3. Add email address

### 4. Monitor Resource Usage
1. Dashboard shows CPU and Memory
2. Scale up if consistently above 80%
3. Check logs for memory leaks

### 5. Security Checklist
- ✅ JWT_SECRET is random and strong
- ✅ DATABASE_URL uses sslmode=verify-full
- ✅ FRONTEND_URL is HTTPS only
- ✅ NODE_ENV is production
- ✅ Never commit .env file

---

## Render vs Other Platforms

| Platform | Price | Best For | Node.js Support |
|----------|-------|----------|-----------------|
| **Render** | $5-7/mo | Balanced pricing | ✅ Excellent |
| Vercel | $20/mo | Serverless (Next.js) | ✅ Full |
| Railway | $5/mo | Simplicity | ✅ Great |
| Heroku | $7+/mo | Mature platform | ✅ Excellent |
| AWS/GCP | Variable | Scale & control | ✅ Full |

**For this project: Render is recommended** for good balance of features, cost, and ease of use.

---

## Auto-Deploy Configuration

Render automatically watches your GitHub repository. When you push to `main`:

1. **Trigger:** Git push detected
2. **Build:** `cd backend && npm install`
3. **Start:** `cd backend && npm start`
4. **Health Check:** Verifies `/health` endpoint
5. **Live:** API accessible within 2-5 minutes

**Disable auto-deploy (if needed):**
1. Go to **Settings** → **Source**
2. Uncheck **Auto-Deploy**
3. Manually deploy via dashboard

---

## Connecting Database on Render (Alternative)

If you prefer using Render's PostgreSQL instead of Neon:

1. **Go to Dashboard → New → PostgreSQL**
2. **Name:** `burpsite-db`
3. Copy the generated `DATABASE_URL`
4. Paste into backend environment variables
5. Render automatically creates backup snapshots

**Neon (current setup) is recommended** for better free tier and managed backups.

---

## Scaling Production Deployment

### Phase 1: MVP (Free/Starter)
- Single instance on Render ($0-7/mo)
- Neon PostgreSQL free tier
- Suitable for <100 concurrent users

### Phase 2: Growth ($20-100/mo)
- Starter Plus instance
- Neon PostgreSQL standard plan
- Add caching layer (Redis on Render)
- Suitable for <1000 concurrent users

### Phase 3: Enterprise (Custom)
- Multi-instance with load balancer
- Dedicated database
- Advanced monitoring
- CDN for static assets

---

## Quick Deploy Checklist

- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Build command: `cd backend && npm install`
- [ ] Start command: `cd backend && npm start`
- [ ] Environment variables set (NODE_ENV, PORT, JWT_SECRET, DATABASE_URL, FRONTEND_URL)
- [ ] Instance type selected (Free or Starter)
- [ ] Deployment triggered
- [ ] Logs show "✓ Burpsite API running on port 5000"
- [ ] Health check passes: `curl https://burpsite.onrender.com/health`
- [ ] Frontend updated with REACT_APP_API_URL
- [ ] Auto-deploy from GitHub enabled

---

## Support & Links

- **Render Dashboard:** https://dashboard.render.com
- **Render Documentation:** https://render.com/docs
- **GitHub Repository:** https://github.com/jamiljuma2/Burpsite
- **Project Deployment Guide:** See DEPLOYMENT_GUIDE.md in repository

---

## Environment Variables - Copy/Paste Template

```
NODE_ENV=production
PORT=5000
JWT_SECRET=GENERATE_NEW_VALUE_WITH_NODE_COMMAND
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@your-host.neon.tech/neondb?sslmode=verify-full&channel_binding=require
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://burpsite.onrender.com
PROXY_PORT=8888
```

---

**Deployment Status:** Ready for Render ✅  
**Last Updated:** April 3, 2026

