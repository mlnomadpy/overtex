# Build script for production
echo "Building OverTeX for production..."

# Build backend
echo "Building backend..."
cd server
npm run build
cd ..

# Build frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

echo "Build complete!"
echo "Backend: server/dist/"
echo "Frontend: frontend/dist/"
