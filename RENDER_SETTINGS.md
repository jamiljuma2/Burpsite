# Render Backend Deployment - Quick Settings

## 🚀 Render Web Service Configuration

### Basic Info
- **Name:** `burpsite-api`
- **Environment:** `Node`
- **Region:** (select closest to users, e.g., Virginia US East)
- **Branch:** `main`

### Build & Start Commands

**Build Command:**
```bash
cd backend && npm install
```

**Start Command:**
```bash
cd backend && npm start
```

---

## 🔐 Environment Variables (Copy & Set These)

```
NODE_ENV=production
PORT=5000
JWT_SECRET=[GENERATE_NEW]
DATABASE_URL=postgresql://neondb_owner:npg_01vKMCwyFTAG@ep-billowing-lake-altjrf2d-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=verify-full&channel_binding=require
FRONTEND_URL=https://burpsite-frontend.onrender.com
PROXY_PORT=8888
```

### Generate JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📋 Health Check Setup

- **Path:** `/health`
- **Protocol:** HTTP
- **Timeout:** 30 seconds
- **Initial Delay:** 60 seconds
- **Check Interval:** 60 seconds

---

## 💰 Recommended Plan

**Starter:** $5-7/month
- Always running (no cold starts)
- Auto-restart on crash
- Sufficient for MVP/testing

---

## ✅ After Deployment

1. **Test API:**
   ```bash
   curl https://burpsite-api.onrender.com/health
   ```

2. **Update Frontend:**
   Set `REACT_APP_API_URL=https://burpsite-api.onrender.com/api`

3. **Enable Auto-Deploy:**
   GitHub → Render auto-deploys on push to main

4. **Monitor Logs:**
   Dashboard → Logs tab

---

## 🔗 One-Click References

| Item | Action |
|------|--------|
| Render Dashboard | https://dashboard.render.com |
| Create Web Service | https://dashboard.render.com/new/webservice |
| Docs | https://render.com/docs |
| Community | https://render.com/community |

---

## 📝 Database Connection Notes

- **Using:** Neon PostgreSQL (external)
- **Connection String:** Already configured
- **SSL Mode:** `verify-full` (production-ready)
- **Backups:** Auto-enabled in Neon

---

## ⚠️ Important Notes

1. **Free Tier Limitation:** Service spins down after 15 min inactivity
   - Use Starter ($7/mo) for production

2. **Cold Start:** First request after inactivity may be slow
   - Starter plan keeps service warm

3. **Logs:** Check logs if deployment fails
   - Dashboard → Logs tab shows build errors

4. **Auto-Deploy:** Push to GitHub main branch triggers deployment
   - Deployment takes 2-5 minutes

5. **Health Check:** Render monitors `/health` endpoint
   - Service must respond within 30 seconds

---

## 🎯 Deployment Workflow

1. **Connect GitHub** → Select Burpsite repo
2. **Set Build:** `cd backend && npm install`
3. **Set Start:** `cd backend && npm start`
4. **Add Environment Variables** (6 variables listed above)
5. **Choose Instance** (Starter recommended)
6. **Deploy** → Wait 2-5 minutes
7. **Test** → `curl https://burpsite-api.onrender.com/health`
8. **Update Frontend** → Point to new API URL
9. **Done** ✅ Auto-deploy enabled for future updates

---

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `NODE_ENV` | Enable production optimizations | `production` |
| `PORT` | Server port (Render default) | `5000` |
| `JWT_SECRET` | Auth token encryption | `f3ff78c5842b6...` |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host/db` |
| `FRONTEND_URL` | CORS origin for frontend | `https://myapp.onrender.com` |
| `PROXY_PORT` | Proxy module port | `8888` |

---

## Testing Production Deployment

```bash
# Health check
curl https://burpsite-api.onrender.com/health
# Expected: {"status":"ok","message":"Burpsite API is running"}

# Register user
curl -X POST https://burpsite-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test123","confirmPassword":"Test123"}'

# Login
curl -X POST https://burpsite-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123"}'
```

---

**Estimated Setup Time:** 5-10 minutes  
**Cost:** Free for testing, $7/month for production  
**Status:** Ready to deploy ✅
