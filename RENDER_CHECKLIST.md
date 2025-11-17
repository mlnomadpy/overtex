# Render Deployment Checklist

## Pre-Deployment

- [x] Environment configuration files created
- [x] Docker files created
- [x] Logging system implemented
- [x] Error handling middleware added
- [x] Security headers configured (Helmet)
- [x] Rate limiting enabled
- [x] Input validation (Zod)
- [x] Health check endpoints
- [x] LaTeX availability check
- [x] Frontend env var support
- [x] Render configuration (render.yaml)
- [x] Deployment documentation

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: prepare for Render deployment"
git push origin render
```

### 2. Create Render Blueprint
1. Go to https://dashboard.render.com/blueprints
2. Click "New Blueprint Instance"
3. Connect GitHub repository
4. Select `overtex` repository
5. Render detects `render.yaml`
6. Click "Apply"

### 3. Monitor Deployment
- Backend: Installing TeX Live (5-10 min first time)
- Frontend: Building React app (2-3 min)

### 4. Update Environment Variables

#### Backend Service
Go to service → Environment → Add:
```
NODE_ENV=production
CORS_ORIGINS=https://[your-frontend-url].onrender.com
```

#### Frontend Service
Already configured via render.yaml:
```
VITE_API_BASE_URL=https://[your-backend-url].onrender.com
```

### 5. Test Deployment

```bash
# Test backend health
curl https://[your-backend-url].onrender.com/health

# Test LaTeX availability
curl https://[your-backend-url].onrender.com/ready

# Test frontend
curl https://[your-frontend-url].onrender.com

# Test build API
curl -X POST https://[your-backend-url].onrender.com/api/build \
  -H "Content-Type: application/json" \
  -d '{"sourceFile":"main.tex","outputDir":"tex"}'
```

## Post-Deployment

- [ ] Update CORS with actual frontend URL
- [ ] Test full build workflow
- [ ] Verify PDF generation
- [ ] Check logs for errors
- [ ] Set up custom domain (optional)
- [ ] Configure alerts
- [ ] Add monitoring (Sentry)

## Environment Variables Reference

### Backend Required
| Variable | Value |
|----------|-------|
| NODE_ENV | production |
| PORT | 3000 |
| CORS_ORIGINS | Your frontend URL |
| TEX_WORKSPACE_ROOT | /opt/render/project/src |
| BUILD_TIMEOUT | 60000 |
| LOG_LEVEL | info |

### Frontend Required
| Variable | Value |
|----------|-------|
| VITE_API_BASE_URL | Your backend URL |

## Troubleshooting

### LaTeX Not Available
- Check build logs for TeX Live installation
- Verify render-build.sh ran successfully
- Restart service after build

### CORS Errors
- Update CORS_ORIGINS with frontend URL
- Remove trailing slashes
- Redeploy backend service

### Build Timeout
- Increase BUILD_TIMEOUT in env vars
- Check TeX Live is installed
- Verify LaTeX document compiles locally

## Files Created/Modified

### New Files
- `render.yaml` - Render blueprint configuration
- `Dockerfile.backend` - Backend container
- `Dockerfile.frontend` - Frontend container
- `frontend/nginx.conf` - Nginx config for frontend
- `scripts/render-install-texlive.sh` - TeX Live installer
- `server/.env.example` - Backend env template
- `frontend/.env.example` - Frontend env template
- `server/src/config/env.ts` - Environment configuration
- `server/src/utils/logger.ts` - Winston logger
- `server/src/middleware/errorHandler.ts` - Error handling
- `server/src/middleware/validation.ts` - Input validation
- `server/src/middleware/security.ts` - Security headers
- `docs/render-deployment.md` - Deployment guide
- `LICENSE` - MIT License
- `.dockerignore` - Docker ignore file

### Modified Files
- `server/src/index.ts` - Added middleware and health checks
- `server/src/routes/build.ts` - Added validation
- `frontend/src/services/buildService.ts` - Env var support
- `.gitignore` - Added logs and LaTeX files
- `README.md` - Added deployment docs link

## Next Steps

1. Deploy to Render using blueprint
2. Test all functionality
3. Set up monitoring
4. Configure alerts
5. Add custom domain
6. Set up staging environment

---

**Ready to Deploy!** 🚀

See [docs/render-deployment.md](./docs/render-deployment.md) for detailed instructions.
