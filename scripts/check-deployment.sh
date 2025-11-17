#!/bin/bash

# Pre-deployment checklist script
echo "🔍 OverTeX Render Deployment Checklist"
echo "========================================"
echo ""

errors=0
warnings=0

# Check if required files exist
echo "📁 Checking required files..."

required_files=(
  "render.yaml"
  "server/Dockerfile"
  "frontend/Dockerfile"
  "server/.env.example"
  "frontend/.env.example"
  "server/src/index.ts"
  "frontend/src/main.ts"
)

for file in "${required_files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (missing)"
    ((errors++))
  fi
done

echo ""

# Check package.json scripts
echo "📦 Checking package.json scripts..."

if grep -q '"build"' server/package.json; then
  echo "  ✅ Backend build script"
else
  echo "  ❌ Backend build script missing"
  ((errors++))
fi

if grep -q '"start"' server/package.json; then
  echo "  ✅ Backend start script"
else
  echo "  ❌ Backend start script missing"
  ((errors++))
fi

if grep -q '"build"' frontend/package.json; then
  echo "  ✅ Frontend build script"
else
  echo "  ❌ Frontend build script missing"
  ((errors++))
fi

echo ""

# Check environment variables
echo "🔐 Checking environment configuration..."

if [ -f "server/.env.example" ]; then
  required_vars=("PORT" "NODE_ENV" "CORS_ORIGINS" "TEX_WORKSPACE_ROOT")
  for var in "${required_vars[@]}"; do
    if grep -q "$var" server/.env.example; then
      echo "  ✅ $var documented"
    else
      echo "  ⚠️  $var not documented"
      ((warnings++))
    fi
  done
fi

echo ""

# Check if dependencies are installed
echo "📚 Checking dependencies..."

if [ -d "server/node_modules" ]; then
  echo "  ✅ Backend dependencies installed"
else
  echo "  ⚠️  Backend dependencies not installed (run: cd server && npm install)"
  ((warnings++))
fi

if [ -d "frontend/node_modules" ]; then
  echo "  ✅ Frontend dependencies installed"
else
  echo "  ⚠️  Frontend dependencies not installed (run: cd frontend && npm install)"
  ((warnings++))
fi

echo ""

# Check TypeScript compilation
echo "🔨 Checking TypeScript compilation..."

cd server
if npm run build > /dev/null 2>&1; then
  echo "  ✅ Backend TypeScript compiles"
else
  echo "  ❌ Backend TypeScript has errors"
  ((errors++))
fi
cd ..

cd frontend
if npx vue-tsc -b --noEmit > /dev/null 2>&1; then
  echo "  ✅ Frontend TypeScript compiles"
else
  echo "  ⚠️  Frontend TypeScript has warnings"
  ((warnings++))
fi
cd ..

echo ""

# Check Docker files
echo "🐳 Checking Docker configuration..."

if docker --version > /dev/null 2>&1; then
  echo "  ✅ Docker installed"
  
  # Try building backend Docker image (dry run)
  if grep -q "FROM" server/Dockerfile; then
    echo "  ✅ Backend Dockerfile valid syntax"
  else
    echo "  ❌ Backend Dockerfile invalid"
    ((errors++))
  fi
  
  if grep -q "FROM" frontend/Dockerfile; then
    echo "  ✅ Frontend Dockerfile valid syntax"
  else
    echo "  ❌ Frontend Dockerfile invalid"
    ((errors++))
  fi
else
  echo "  ⚠️  Docker not installed (optional for local testing)"
  ((warnings++))
fi

echo ""

# Summary
echo "📊 Summary"
echo "=========="
echo ""

if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
  echo "✅ All checks passed! Ready to deploy to Render."
  echo ""
  echo "Next steps:"
  echo "1. git add ."
  echo "2. git commit -m 'Prepare for Render deployment'"
  echo "3. git push origin master"
  echo "4. Go to https://dashboard.render.com and create a new Blueprint"
  exit 0
elif [ $errors -eq 0 ]; then
  echo "⚠️  $warnings warning(s) found. You can proceed but review warnings."
  echo ""
  exit 0
else
  echo "❌ $errors error(s) and $warnings warning(s) found. Fix errors before deploying."
  echo ""
  exit 1
fi
