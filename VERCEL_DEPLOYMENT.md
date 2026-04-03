# Burpsite Frontend - Vercel Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying Burpsite frontend to Vercel.

**Vercel Features Used:**
- React Web Application
- Auto-deploy from GitHub
- Free tier available
- Automatic HTTPS & SSL
- Edge caching and CDN

---

## Prerequisites

1. **Vercel Account** - https://vercel.com (sign up with GitHub for easier auth)
2. **GitHub Repository** - Already set up: https://github.com/jamiljuma2/Burpsite
3. **Backend API URL** - https://burpsite.onrender.com/api (from Render deployment)

---

## Step 1: Connect GitHub Repository to Vercel

1. Go to https://vercel.com/new
2. Click **Continue with GitHub**
3. Install Vercel app on your GitHub account (if prompted)
4. Search for and select **"Burpsite"** repository
5. Click **Open** or **Import**

---

## Step 2: Configure Project Settings

### Basic Configuration
- **Project Name:** `burpsite-frontend` (or your preference)
- **Framework Preset:** React
- **Root Directory:** `frontend` (or `./` if frontend is at root)

### Build & Development Settings
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `build` (auto-detected)
- **Development Command:** `npm run start` (optional)
- **Install Command:** `npm install` (auto-detected)

---

## Step 3: Environment Variables

In Vercel dashboard, add this environment variable:

### Primary Variable

```
REACT_APP_API_URL=https://burpsite.onrender.com/api
```

### Optional: Custom Domain Variable
```
REACT_APP_DOMAIN=burpsite-t3o3.vercel.app
```

**IMPORTANT:** Environment variables must start with `REACT_APP_` to be accessible in React frontend.

---

## Step 4: Deploy

1. **Click Deploy** in Vercel dashboard
2. Vercel will:
   - Clone your GitHub repository
   - Install dependencies: `npm install`
   - Build project: `npm run build`
   - Deploy to CDN
   - Assign domain: `https://burpsite-t3o3.vercel.app` (or update custom domain)

3. Deployment typically completes in **30-60 seconds**

---

## Step 5: Verify Deployment

Once deployment completes:

### Check Deployment Status
1. Go to https://vercel.com/dashboard
2. Click on **burpsite-frontend** project
3. You'll see:
   - ✅ Green checkmark = Deployment successful
   - Preview URL: `https://burpsite-t3o3.vercel.app`
   - Production URL: Your custom domain (if configured)

### Test Frontend
```bash
# Test health page
curl https://burpsite-t3o3.vercel.app

# Should load React app
# Check browser console for any API errors
```

### Test API Connection
1. Open https://burpsite-t3o3.vercel.app in browser
2. Login or navigate to a page that calls the backend API
3. Check browser DevTools → Network tab:
   - Requests to `https://burpsite.onrender.com/api/*` should succeed
   - Status code 200-299 for successful requests

---

## Step 6: Configure Custom Domain (Optional)

If you want a custom domain (e.g., `burpsite.com`):

1. **In Vercel Dashboard:**
   - Go to **Settings** → **Domains**
   - Click **Add**
   - Enter your domain

2. **In Domain Registrar** (GoDaddy, Namecheap, etc.):
   - Add CNAME record pointing to Vercel
   - Vercel provides exact DNS instructions

3. **Verification:**
   - Wait 5-48 hours for DNS propagation
   - Vercel auto-provisions SSL certificate

---

## Step 7: Auto-Deploy from GitHub

Vercel **automatically redeploys** when you push to GitHub:

```bash
# Make changes locally
git add frontend/
git commit -m "Update frontend features"
git push origin main

# Vercel automatically detects push
# Builds and deploys within 30-60 seconds
# Gets assigned new deployment URL
```

### Monitor Deployments
1. Go to Vercel dashboard
2. Click **Deployments** tab
3. See each push's build logs, status, and preview URL

---

## Frontend Configuration Files

### .env (Local Development)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### .env.production (Vercel)
```
REACT_APP_API_URL=https://burpsite.onrender.com/api
```

**Note:** Vercel automatically uses `REACT_APP_API_URL` from environment variables.

---

## Common Deployment Issues

### "Build failed: Module not found"
**Solution:**
1. Check `package.json` has all dependencies
2. Run `npm install` locally
3. Test locally: `npm run build`
4. Push to GitHub and verify

### "API calls returning 404 or CORS error"
**Solution:**
1. Verify `REACT_APP_API_URL` is correct in Vercel dashboard
2. Check backend API is running: `curl https://burpsite.onrender.com/health`
3. Verify backend CORS allows frontend origin:
   - Backend should allow: `https://burpsite-t3o3.vercel.app`
   - Or custom domain if configured

### "Environment variables not loading"
**Solution:**
1. Variable must start with `REACT_APP_`
2. Redeploy after adding variables:
   - Vercel → Deployments → Redeploy
3. Check browser console for errors

### "Blank white page after deployment"
**Solution:**
1. Check browser console (DevTools → Console)
2. Look for JavaScript errors
3. Check Network tab for failed requests
4. Verify API URL is correct

---

## Environment Variables Reference

### Frontend Variables

| Variable | Value | Required |
|----------|-------|----------|
| `REACT_APP_API_URL` | `https://burpsite.onrender.com/api` | ✅ Yes |
| `REACT_APP_DOMAIN` | `burpsite-t3o3.vercel.app` | ❌ No |
| `REACT_APP_ENV` | `production` | ❌ No |

### Backend API Reference

All frontend API calls go to `REACT_APP_API_URL`:
- Health check: `GET /health`
- Authentication: `POST /auth/login`, `POST /auth/register`
- User data: `GET /users/:id`
- Proxy: `POST /proxy` (if using proxy feature)

---

## Production Best Practices

### 1. Monitor Performance
- Vercel → Analytics tab
- Track page load times, Core Web Vitals
- Monitor API response times

### 2. Error Tracking
- Set up error monitoring: Sentry, DataDog, New Relic
- Configure alerts for deployment failures

### 3. Security Checklist
- ✅ API URL uses HTTPS only
- ✅ No sensitive data in environment variables
- ✅ CORS properly configured on backend
- ✅ Content Security Policy headers set
- ✅ CSRF protection enabled

### 4. Optimize Bundle Size
```bash
# Check bundle size locally
npm install -g bundle-analyzer
npm run build
```

### 5. Use Vercel Analytics
1. Go to **Project Settings** → **Analytics**
2. Enable Web Analytics
3. Monitor performance metrics

---

## Deployment Architecture

```
Frontend: https://burpsite-t3o3.vercel.app
    ↓
    API calls to backend
    ↓
Backend: https://burpsite.onrender.com/api
    ↓
Database: Neon PostgreSQL
```

---

## Vercel vs Other Hosting Options

| Platform | Price | Best For | React Support |
|----------|-------|----------|---------------|
| **Vercel** | Free/Pro | React & Next.js | ✅ Perfect |
| Netlify | Free/Pro | Static sites | ✅ Great |
| GitHub Pages | Free | Static only | ⚠️ Limited |
| AWS Amplify | Variable | Enterprise | ✅ Full |
| Render | $7/mo+ | Backend + Frontend | ✅ Good |

**For this project: Vercel is recommended** for optimal React performance and zero-config deployments.

---

## Quick Deploy Checklist

- [ ] Vercel account created
- [ ] GitHub repository connected to Vercel
- [ ] Project root directory set to `frontend`
- [ ] Build command: `npm run build` (auto-detected)
- [ ] Environment variable set: `REACT_APP_API_URL=https://burpsite.onrender.com/api`
- [ ] Deployment triggered
- [ ] Green ✅ status in Vercel dashboard
- [ ] Frontend loads at `https://burpsite-t3o3.vercel.app`
- [ ] API calls succeed (check Network tab)
- [ ] No console errors
- [ ] Mobile responsive (test on mobile)
- [ ] Auto-deploy from GitHub enabled

---

## Useful Vercel Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Project Settings:** https://vercel.com/projects/burpsite-frontend/settings
- **Vercel Docs:** https://vercel.com/docs
- **React Deployment:** https://vercel.com/docs/frameworks/react
- **Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables

---

## Monitoring & Support

### View Deployment Logs
1. Vercel Dashboard → Deployments
2. Click on a deployment
3. View build logs, function logs, and errors

### Enable Email Notifications
1. Account Settings → Notifications
2. Enable deployment alerts
3. Get notified of failed deployments

### Monitor in Production
1. Vercel Analytics → Check page metrics
2. Browser DevTools → Check console for errors
3. Check backend API logs: Render dashboard → Logs

---

## Next Steps After Deployment

1. ✅ Frontend deployed to Vercel
2. ✅ Backend running on Render
3. ✅ Database connected on Neon PostgreSQL
4. **TODO:** Update DNS (if using custom domain)
5. **TODO:** Set up monitoring and alerts
6. **TODO:** Configure CI/CD for tests before deploy
7. **TODO:** Add analytics and error tracking

---

**Frontend Deployment Status:** Ready for Vercel ✅  
**Backend Deployment Status:** Running on Render ✅  
**Database Status:** Connected to Neon PostgreSQL ✅  

**Last Updated:** April 3, 2026
