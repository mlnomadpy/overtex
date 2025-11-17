# OverTeX - Render Deployment

This project is configured for deployment on Render.

## Quick Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/mlnomadpy/overtex)

## Manual Deployment

See [docs/render-deployment.md](docs/render-deployment.md) for detailed instructions.

## Environment Variables

### Backend (overtex-api)

Required:
- `CORS_ORIGINS` - Frontend URL (e.g., `https://overtex-frontend.onrender.com`)

Auto-configured:
- `NODE_ENV=production`
- `PORT=10000`
- `TEX_WORKSPACE_ROOT=/app/tex`
- `BUILD_TIMEOUT=60000`
- `LOG_LEVEL=info`

### Frontend (overtex-frontend)

Auto-configured:
- `VITE_API_BASE_URL` - Automatically set from backend service

## Services

1. **Backend API** (`overtex-api`)
   - Docker-based deployment
   - Includes TeX Live for LaTeX compilation
   - Health check: `/api/health`

2. **Frontend** (`overtex-frontend`)
   - Static site deployment
   - Vite-built Vue 3 application
   - Automatically connected to backend

## Post-Deployment

After deployment:

1. ✅ Verify backend health: `https://overtex-api.onrender.com/api/health`
2. ✅ Test frontend: `https://overtex-frontend.onrender.com`
3. ✅ Update `CORS_ORIGINS` with actual frontend URL
4. ✅ Test PDF generation

## Monitoring

- Backend logs: Render Dashboard → overtex-api → Logs
- Frontend logs: Render Dashboard → overtex-frontend → Logs
- Health: Monitor `/api/health` endpoint

## Troubleshooting

See [docs/render-deployment.md](docs/render-deployment.md#troubleshooting) for common issues and solutions.

## Cost

- Frontend: Free (static site)
- Backend: Free tier available (with spin-down) or $7/month starter plan

## Support

- [Render Documentation](https://render.com/docs)
- [OverTeX Issues](https://github.com/mlnomadpy/overtex/issues)
