# Render Deployment Guide

This guide walks you through deploying OverTeX to Render.

## Prerequisites

- GitHub account with OverTeX repository
- Render account (free tier available at [render.com](https://render.com))
- Git installed locally

---

## Deployment Options

OverTeX supports two deployment methods on Render:

### Option 1: Blueprint (Recommended)
Deploy both frontend and backend together using `render.yaml`

### Option 2: Manual Setup
Create services manually in Render dashboard

---

## Option 1: Blueprint Deployment (Recommended)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin master
```

### Step 2: Create New Blueprint in Render

1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Select the `overtex` repository
5. Render will detect `render.yaml` automatically
6. Click **"Apply"**

### Step 3: Configure Environment Variables

After deployment starts, configure these variables in Render dashboard:

#### Backend Service (`overtex-api`)

Required environment variables:
- `CORS_ORIGINS` - Set to your frontend URL (e.g., `https://overtex-frontend.onrender.com`)

Optional (already set in render.yaml):
- `NODE_ENV` - `production`
- `PORT` - `10000`
- `TEX_WORKSPACE_ROOT` - `/app/tex`
- `BUILD_TIMEOUT` - `60000`
- `LOG_LEVEL` - `info`

#### Frontend Service (`overtex-frontend`)

The `VITE_API_BASE_URL` is automatically set from the backend service URL.

### Step 4: Wait for Deployment

- Backend typically takes 5-10 minutes (TeX Live installation)
- Frontend takes 2-3 minutes
- Monitor build logs in Render dashboard

### Step 5: Verify Deployment

1. **Check Backend Health:**
   ```bash
   curl https://overtex-api.onrender.com/api/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Check Frontend:**
   - Visit `https://overtex-frontend.onrender.com`
   - Click "Refresh PDF" button
   - Verify PDF generation works

---

## Option 2: Manual Deployment

### Step 1: Deploy Backend

1. Go to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `overtex-api`
   - **Runtime:** `Docker`
   - **Dockerfile Path:** `./server/Dockerfile`
   - **Docker Context:** `./server`
   - **Region:** Choose closest to you
   - **Plan:** Free (or paid for better performance)

5. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   TEX_WORKSPACE_ROOT=/app/tex
   BUILD_TIMEOUT=60000
   LOG_LEVEL=info
   CORS_ORIGINS=https://your-frontend-url.onrender.com
   ```

6. **Health Check Path:** `/api/health`
7. Click **"Create Web Service"**

### Step 2: Deploy Frontend

1. Click **"New +"** → **"Static Site"**
2. Connect your repository
3. Configure:
   - **Name:** `overtex-frontend`
   - **Build Command:** `cd frontend && npm ci && npm run build`
   - **Publish Directory:** `./frontend/dist`

4. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://overtex-api.onrender.com
   ```

5. Click **"Create Static Site"**

### Step 3: Update CORS

After both services are deployed:
1. Go to backend service settings
2. Update `CORS_ORIGINS` environment variable with actual frontend URL
3. Save and redeploy

---

## Post-Deployment Configuration

### Custom Domain (Optional)

#### For Frontend:
1. Go to frontend service → Settings → Custom Domains
2. Add your domain (e.g., `overtex.yourdomain.com`)
3. Update DNS records as instructed
4. Render provides free SSL

#### For Backend:
1. Go to backend service → Settings → Custom Domains
2. Add API subdomain (e.g., `api.overtex.yourdomain.com`)
3. Update DNS records
4. Update frontend's `VITE_API_BASE_URL` to use custom domain
5. Update backend's `CORS_ORIGINS` to include custom frontend domain

### SSL/HTTPS

- Render provides free SSL certificates automatically
- All traffic is encrypted by default
- Certificate renewal is automatic

---

## Troubleshooting

### Backend Build Fails

**Issue:** Docker build times out or fails

**Solutions:**
1. Check build logs for specific errors
2. Ensure Dockerfile syntax is correct
3. TeX Live installation takes time - be patient (5-10 min)
4. Upgrade to paid plan for faster builds

**Common Errors:**
```bash
# Timeout during TeX Live install
Solution: Use Render paid plan or simplify TeX Live packages

# Out of memory
Solution: Upgrade to plan with more RAM
```

### Frontend Build Fails

**Issue:** `npm run build` fails

**Solutions:**
```bash
# Check build command is correct
cd frontend && npm ci && npm run build

# Verify all dependencies are in package.json
# Check for TypeScript errors locally first
npm run build
```

### CORS Errors

**Issue:** Browser shows CORS policy errors

**Solution:**
1. Verify backend `CORS_ORIGINS` includes frontend URL
2. Make sure URLs match exactly (https, no trailing slash)
3. Redeploy backend after changing environment variables

```bash
# Backend CORS_ORIGINS should be:
CORS_ORIGINS=https://overtex-frontend.onrender.com
```

### PDF Generation Fails

**Issue:** Build works locally but fails on Render

**Possible Causes:**
1. **Missing LaTeX packages:**
   - Check Dockerfile includes required packages
   - Add to `apt-get install` if needed

2. **File permissions:**
   - Ensure `/app/tex` directory is writable
   - Check Dockerfile creates directory

3. **Timeout:**
   - Increase `BUILD_TIMEOUT` environment variable
   - Simplify LaTeX document

### Health Check Fails

**Issue:** Service shows "unhealthy"

**Solution:**
1. Check health endpoint responds:
   ```bash
   curl https://your-service.onrender.com/api/health
   ```

2. Verify health check path is correct: `/api/health`

3. Check backend logs for errors

### Service Won't Start

**Issue:** Service deploys but won't start

**Check:**
1. Environment variables are set correctly
2. PORT matches what's in `server/src/index.ts`
3. Build completed successfully
4. Check service logs for errors

---

## Monitoring & Maintenance

### View Logs

1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. Filter by log level or search

### Health Monitoring

Monitor endpoints:
- Backend: `https://your-backend.onrender.com/api/health`
- Frontend: `https://your-frontend.onrender.com/`

### Auto-Deploy

Render automatically deploys when you push to your default branch:

```bash
git add .
git commit -m "Update feature"
git push origin master
# Render automatically detects and deploys
```

### Manual Deploy

1. Go to service in Render Dashboard
2. Click "Manual Deploy" → "Deploy latest commit"

---

## Performance Optimization

### Free Tier Limitations

- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month free (multiple services share this)

### Recommended Upgrades

For production use, consider:
- **Starter Plan ($7/month):** No spin-down, better performance
- **Standard Plan ($25/month):** More resources, faster builds

### Caching

Frontend automatically caches assets:
- Static files cached for 1 year
- HTML revalidated on each request

---

## Scaling Considerations

### When to Upgrade

Signs you need paid plan:
- Service spinning down is annoying users
- Build times are too slow
- Memory issues during LaTeX compilation
- Need more concurrent users

### Horizontal Scaling

For high traffic:
1. Use Render's auto-scaling (Standard plan+)
2. Add Redis for build queue
3. Consider CDN for frontend assets

---

## Security Best Practices

### Environment Variables

✅ **Do:**
- Store secrets in Render environment variables
- Use different values for staging/production
- Rotate secrets periodically

❌ **Don't:**
- Commit secrets to git
- Share environment variables publicly
- Use same secrets across environments

### API Security

Already implemented:
- Rate limiting (100 requests/15 min)
- Helmet security headers
- Input validation
- Path traversal protection

### Monitoring

Set up:
1. **Uptime monitoring** (UptimeRobot, Pingdom)
2. **Error tracking** (Sentry - free tier)
3. **Log aggregation** (Render logs + external tool)

---

## Cost Estimates

### Free Tier
- Frontend: Free (static site)
- Backend: Free (with spin-down)
- **Total: $0/month**

### Starter Tier
- Frontend: Free (static site)
- Backend: $7/month (no spin-down)
- **Total: $7/month**

### Standard Tier (Recommended for Production)
- Frontend: Free (static site)
- Backend: $25/month (better resources)
- **Total: $25/month**

---

## Backup & Recovery

### Database (If Added)

Render PostgreSQL includes:
- Automatic daily backups (7 days)
- Point-in-time recovery
- Manual backup triggers

### Code Backup

- Primary: GitHub repository
- Use tags for releases:
  ```bash
  git tag -a v1.0.0 -m "Release version 1.0.0"
  git push origin v1.0.0
  ```

### Rollback

If deployment fails:
1. Go to service → Deploys
2. Find last successful deploy
3. Click "Redeploy"

---

## Next Steps

After successful deployment:

1. ✅ Test all functionality
2. ✅ Set up custom domain
3. ✅ Configure monitoring
4. ✅ Add error tracking (Sentry)
5. ✅ Set up uptime monitoring
6. ✅ Document environment variables
7. ✅ Create staging environment
8. ✅ Set up CI/CD (GitHub Actions)

---

## Support Resources

- **Render Docs:** https://render.com/docs
- **Render Status:** https://status.render.com
- **Community:** https://community.render.com
- **Support:** https://render.com/support

---

## Troubleshooting Checklist

Before asking for help, check:

- [ ] All environment variables are set correctly
- [ ] Build logs show no errors
- [ ] Health check endpoint responds
- [ ] CORS is configured properly
- [ ] Frontend can reach backend API
- [ ] LaTeX packages are installed
- [ ] Service is not spun down (free tier)
- [ ] No firewall blocking requests
- [ ] SSL certificate is active

---

**Happy Deploying! 🚀**

For issues, create a GitHub issue or check Render community forums.
