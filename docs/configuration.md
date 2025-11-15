# Configuration Guide

Customize OverTeX for your workflow.

## Configuration Files

### Frontend Configuration

#### vite.config.ts

```typescript
export default defineConfig({
  server: {
    port: 5173,              // Frontend port
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // Backend URL
        changeOrigin: true,
      },
    },
  },
  // Other Vite settings...
})
```

**Customizable settings:**
- `server.port` - Change frontend port
- `server.host` - Bind to specific IP
- `server.open` - Auto-open browser
- `proxy.target` - Backend URL

#### Example: Custom Port

```typescript
export default defineConfig({
  server: {
    port: 8080,           // Custom port
    open: true,          // Auto-open browser
  },
  // Update proxy target if backend port changes
})
```

### Backend Configuration

#### server/src/index.ts

```typescript
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: [CORS_ORIGIN],
  credentials: true,
}));
```

**Environment variables:**
- `PORT` - Backend port (default: 3000)
- `CORS_ORIGIN` - Allowed frontend origin
- `NODE_ENV` - Environment (development/production)

#### Example: .env file

```bash
# server/.env
PORT=4000
CORS_ORIGIN=http://localhost:8080
NODE_ENV=development
```

### LaTeX Service Configuration

#### server/src/services/latexService.ts

```typescript
private readonly buildTimeout = 60000;  // 60 seconds
private readonly texDirectory = path.resolve(__dirname, '../../tex');
```

**Customizable settings:**
- `buildTimeout` - Max compilation time (milliseconds)
- `texDirectory` - LaTeX files location
- LaTeX command and options

#### Example: Custom Timeout

```typescript
// Increase timeout for complex documents
private readonly buildTimeout = 120000;  // 2 minutes
```

---

## LaTeX Commands

### Default Command

```bash
latexmk -pdf -interaction=nonstopmode -output-directory=tex tex/main.tex
```

### Custom Commands

You can modify the command in the build request:

```typescript
// Frontend: services/buildService.ts
export const triggerBuild = async (
  filename: string,
  outputDir: string = 'tex',
  command: string = 'latexmk'  // Change this
) => {
  // ...
}
```

**Available commands:**
- `latexmk` - Smart compilation (default)
- `pdflatex` - Direct PDF compilation
- `xelatex` - Unicode support
- `lualatex` - Lua-based engine

### Command Examples

#### Using XeLaTeX
```typescript
command: 'xelatex'
// Backend will execute: xelatex -interaction=nonstopmode ...
```

#### Multiple Passes
```typescript
// For documents with bibliography
command: 'latexmk -pdf -bibtex'
```

#### Draft Mode (faster)
```typescript
// Add to your .tex file:
\documentclass[draft]{article}
// Skips images, faster compilation
```

---

## Customizing UI

### Tailwind Configuration

#### frontend/tailwind.config.js

```javascript
export default {
  theme: {
    extend: {
      colors: {
        // Custom colors
        primary: '#3b82f6',
        secondary: '#10b981',
      },
    },
  },
}
```

### Component Customization

#### BuildPanel.vue

```vue
<script setup lang="ts">
// Customize polling interval
const POLL_INTERVAL = 2000; // ms

// Customize success message duration
const SUCCESS_DISPLAY_TIME = 3000; // ms
</script>
```

#### PdfViewer.vue

```vue
<template>
  <!-- Customize viewer height -->
  <VPdfViewer
    :source="pdfSrc"
    style="height: 80vh;"
  />
</template>
```

---

## Directory Structure

### Default Structure
```
overtex/
├── tex/              ← LaTeX files
│   └── main.tex
├── frontend/         ← Vue app
└── server/           ← API server
```

### Custom LaTeX Directory

To use a different directory for LaTeX files:

1. **Update backend service:**
```typescript
// server/src/services/latexService.ts
private readonly texDirectory = path.resolve(__dirname, '../../my-documents');
```

2. **Update frontend:**
```typescript
// frontend/src/services/buildService.ts
export const triggerBuild = async (
  filename: string,
  outputDir: string = 'my-documents',  // Change here
) => {
  // ...
}
```

3. **Create the directory:**
```bash
mkdir my-documents
```

---

## Production Deployment

### Building for Production

#### Frontend
```bash
cd frontend
npm run build

# Output in frontend/dist/
# Serve with any static file server
```

#### Backend
```bash
cd server
npm run build

# Output in server/dist/
# Run with: node dist/index.js
```

### Environment Configuration

#### Production .env
```bash
# server/.env.production
NODE_ENV=production
PORT=80
CORS_ORIGIN=https://your-domain.com
```

### Using PM2 (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Start backend
cd server
pm2 start dist/index.js --name overtex-api

# Start frontend (with serve)
npm install -g serve
cd frontend
pm2 start "serve -s dist -l 5173" --name overtex-frontend

# Save configuration
pm2 save
pm2 startup
```

### Using Docker (Coming Soon)

```dockerfile
# Dockerfile example (not yet implemented)
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
```

---

## Advanced Configuration

### Multiple LaTeX Engines

To support multiple LaTeX engines, modify the backend:

```typescript
// server/src/services/latexService.ts
async build(sourceFile: string, outputDir: string, engine: string = 'pdflatex') {
  let command: string;
  
  switch (engine) {
    case 'xelatex':
      command = `xelatex -interaction=nonstopmode ...`;
      break;
    case 'lualatex':
      command = `lualatex -interaction=nonstopmode ...`;
      break;
    default:
      command = `latexmk -pdf ...`;
  }
  
  // Execute command...
}
```

### Auto-rebuild on File Change (Future Feature)

Using chokidar for file watching:

```typescript
// server/src/services/watchService.ts (to be implemented)
import chokidar from 'chokidar';

const watcher = chokidar.watch('tex/**/*.tex', {
  persistent: true,
});

watcher.on('change', (path) => {
  // Trigger rebuild
  latexService.build(path, 'tex');
});
```

### Custom Build Scripts

Create custom npm scripts:

```json
// package.json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "dev:debug": "tsx watch --inspect src/index.ts",
    "dev:verbose": "DEBUG=* tsx watch src/index.ts",
    "start": "node dist/index.js",
    "start:prod": "NODE_ENV=production node dist/index.js"
  }
}
```

---

## Security Configuration

### CORS Settings

```typescript
// server/src/index.ts
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'https://your-domain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST'],
}));
```

### Path Validation

```typescript
// server/src/services/latexService.ts
private validatePath(filePath: string): void {
  // Prevent directory traversal
  if (filePath.includes('..')) {
    throw new Error('Invalid path: directory traversal not allowed');
  }
  
  // Prevent command injection
  if (filePath.includes(';') || filePath.includes('|')) {
    throw new Error('Invalid path: special characters not allowed');
  }
}
```

---

## Performance Tuning

### Frontend Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'axios'],
          pdfViewer: ['@vue-pdf-viewer/viewer'],
        },
      },
    },
  },
});
```

### Backend Optimization

```typescript
// server/src/index.ts
import compression from 'compression';

app.use(compression());  // Compress responses

// Cache PDF responses
app.get('/api/pdf', (req, res) => {
  res.set('Cache-Control', 'public, max-age=3600');
  // ...
});
```

### LaTeX Optimization

```bash
# Use draft mode during development
\documentclass[draft]{article}

# Compile only changed parts with latexmk
latexmk -pdf main.tex  # Auto-detects changes
```

---

## Logging Configuration

### Backend Logging

```typescript
// server/src/utils/logger.ts (to be created)
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

### Frontend Logging

```typescript
// frontend/src/utils/logger.ts (to be created)
export const log = {
  debug: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log('[DEBUG]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};
```

---

## Next Steps

- **[Usage Guide](./usage.md)** - Learn how to use OverTeX
- **[Troubleshooting](./troubleshooting.md)** - Solve common issues
- **[Architecture](./architecture.md)** - Understand the system
