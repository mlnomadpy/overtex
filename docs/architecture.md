# Architecture Overview

This document explains how OverTeX works under the hood.

## System Architecture

OverTeX follows a three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Vue 3 Frontend (Port 5173)                  │   │
│  │  • Vue 3 + TypeScript + Vite                        │   │
│  │  • @vue-pdf-viewer/viewer for PDF rendering        │   │
│  │  • Tailwind CSS for styling                        │   │
│  │  • shadcn/vue UI components                        │   │
│  └──────────────────┬──────────────────────────────────┘   │
└─────────────────────┼──────────────────────────────────────┘
                      │
                      │ HTTP API Calls
                      │ (REST endpoints)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Node.js Backend (Port 3000)                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Express.js API Server                       │   │
│  │  • POST /api/build - Trigger compilation            │   │
│  │  • GET /api/pdf - Serve PDF file                    │   │
│  │  • GET /api/build/status - Build status            │   │
│  │  • TypeScript + CORS                                │   │
│  └──────────────────┬──────────────────────────────────┘   │
└─────────────────────┼──────────────────────────────────────┘
                      │
                      │ Shell Execution
                      │ (child_process)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│           Local LaTeX Environment                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  TeX Live Distribution                              │   │
│  │  • latexmk (build automation)                       │   │
│  │  • pdflatex (PDF compilation)                       │   │
│  │  • BibTeX/Biber (bibliography)                      │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Build Process

1. **User Action**: Click "Refresh PDF" button
2. **Frontend**: Sends POST request to `/api/build`
3. **Backend**: 
   - Validates request
   - Executes `latexmk -pdf tex/main.tex`
   - Captures output logs
   - Returns build result
4. **Frontend**:
   - Displays build status
   - Shows logs
   - Fetches PDF from `/api/pdf`
5. **PDF Viewer**: 
   - Loads and renders PDF
   - Displays in browser

### Request/Response Flow

```
┌─────────┐    POST /api/build     ┌─────────┐
│ Browser │ ─────────────────────> │ Backend │
│         │    { filename, dir }   │         │
└─────────┘                        └────┬────┘
                                        │
                                        │ executes
                                        │ latexmk
                                        ▼
                                   ┌─────────┐
                                   │  LaTeX  │
                                   │ Process │
                                   └────┬────┘
                                        │ generates
                                        │ main.pdf
┌─────────┐    { success, logs }       │
│ Browser │ <──────────────────────────┘
│         │
└────┬────┘
     │
     │ GET /api/pdf
     ▼
┌─────────┐    main.pdf (binary)  ┌─────────┐
│ Browser │ <──────────────────── │ Backend │
│ Viewer  │                       │ Static  │
└─────────┘                       └─────────┘
```

## Component Breakdown

### Frontend Components

#### 1. App.vue
Main application container:
- Layout structure
- Component orchestration
- PDF URL state management

#### 2. BuildPanel.vue
Build controls:
- "Refresh PDF" button
- Build status indicators
- Success/error messages
- Source file display

#### 3. PdfViewer.vue
PDF rendering:
- Uses @vue-pdf-viewer/viewer
- Auto-reload on new PDF
- Error handling
- Loading states

#### 4. LogViewer.vue
Compilation logs:
- Collapsible panel
- Log display
- Clear logs function
- Badge with log count

### Frontend Services

#### buildService.ts
HTTP client for backend API:
```typescript
triggerBuild(filename, outputDir, command?)
getBuildStatus()
getPdfUrl() // with cache busting
```

#### useBuild.ts
Vue composable for build state:
```typescript
const {
  isBuilding,
  buildSuccess,
  buildError,
  buildLogs,
  triggerBuild,
  clearLogs
} = useBuild()
```

### Backend Routes

#### POST /api/build
Triggers LaTeX compilation:
```typescript
Request: {
  filename: "main.tex",
  outputDir: "tex",
  command?: "latexmk" // optional
}

Response: {
  success: boolean,
  message: string,
  logs: string[],
  outputPath?: string
}
```

#### GET /api/pdf
Serves the compiled PDF:
```typescript
Response: PDF file (application/pdf)
Headers: Content-Type, Content-Length
```

#### GET /api/build/status
Returns build status:
```typescript
Response: {
  building: boolean,
  lastBuild?: {
    success: boolean,
    timestamp: string
  }
}
```

### Backend Services

#### latexService.ts
LaTeX compilation service:
```typescript
class LatexService {
  async build(sourceFile, outputDir, command)
  validatePath(filePath)
  parseLogs(output)
  getPdfPath(sourceFile, outputDir)
}
```

Features:
- Path validation (prevents ../traversal)
- Command injection prevention
- Timeout handling (60 seconds)
- Log parsing
- Error handling

## Technology Stack

### Frontend
- **Framework**: Vue 3.5.24 (Composition API)
- **Build Tool**: Vite 7.2.2
- **Language**: TypeScript 5.9.3
- **UI Library**: Tailwind CSS 3.4+
- **UI Components**: shadcn/vue (adapted)
- **PDF Viewer**: @vue-pdf-viewer/viewer 3.3.1
- **HTTP Client**: Axios
- **Testing**: Vitest 4.0.9

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express 5.1.0
- **Language**: TypeScript 5.9.3
- **Process Management**: child_process (built-in)
- **CORS**: cors middleware
- **Testing**: Vitest 4.0.9

### LaTeX
- **Distribution**: TeX Live 2023
- **Compiler**: pdflatex 3.141592653-2.6-1.40.25
- **Build Tool**: latexmk 4.83
- **Supported Engines**: pdflatex, xelatex, lualatex

## Security Considerations

### Path Validation
```typescript
validatePath(filePath) {
  // Prevents directory traversal
  if (filePath.includes('..')) throw Error
  
  // Prevents command injection
  if (filePath.includes(';') || filePath.includes('|'))
    throw Error
}
```

### CORS Configuration
```typescript
cors({
  origin: ['http://localhost:5173'],
  credentials: true
})
```

### Command Execution
```typescript
// Safe command construction
const command = `latexmk -pdf -interaction=nonstopmode \
  -output-directory=${absoluteOutputDir} \
  ${absoluteSourcePath}`

// With timeout
execPromise(command, { timeout: 60000 })
```

## File Structure

```
overtex/
├── frontend/
│   ├── src/
│   │   ├── App.vue                    # Main app
│   │   ├── main.ts                    # Entry point
│   │   ├── components/
│   │   │   ├── PdfViewer.vue          # PDF display
│   │   │   ├── BuildPanel.vue         # Build UI
│   │   │   ├── LogViewer.vue          # Logs UI
│   │   │   └── ui/                    # shadcn components
│   │   ├── composables/
│   │   │   └── useBuild.ts            # Build state
│   │   ├── services/
│   │   │   └── buildService.ts        # API client
│   │   └── types/
│   │       └── index.ts               # TypeScript types
│   ├── vite.config.ts                 # Vite config
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── index.ts                   # Express server
│   │   ├── routes/
│   │   │   └── build.ts               # Build routes
│   │   └── services/
│   │       └── latexService.ts        # LaTeX service
│   └── package.json
│
├── tex/
│   ├── main.tex                       # LaTeX source
│   └── main.pdf                       # Generated PDF
│
└── scripts/
    └── install-texlive.sh             # LaTeX installer
```

## Development Workflow

### Frontend Development
```bash
cd frontend
npm run dev    # Start dev server
npm test       # Run tests
npm run build  # Build for production
```

### Backend Development
```bash
cd server
npm run dev    # Start with hot reload (tsx watch)
npm test       # Run tests
npm run build  # Compile TypeScript
```

### Full Stack Development
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd frontend && npm run dev
```

## Testing Strategy

### Frontend Tests
- **Unit Tests**: Components, composables, services
- **Integration Tests**: Component interactions
- **Mocking**: Axios, Vue Router (if added)

### Backend Tests
- **Unit Tests**: Services, utilities
- **Integration Tests**: API endpoints, LaTeX compilation
- **Mocking**: File system, child_process

### Test Coverage
- Frontend: 20/20 tests passing
- Backend: Core functionality tested
- E2E: Manual testing workflow

## Performance Considerations

### Frontend
- **Vite HMR**: Fast hot module replacement
- **Code Splitting**: Automatic by Vite
- **PDF Caching**: Cache-busting timestamps
- **Lazy Loading**: Components loaded on demand

### Backend
- **Async Operations**: Non-blocking I/O
- **Timeout Management**: 60s build timeout
- **Memory**: Efficient log parsing
- **Static Serving**: Express sendFile

### LaTeX
- **latexmk**: Intelligent recompilation
- **Minimal Install**: Faster for simple docs
- **Parallel Builds**: Not yet implemented

## Future Enhancements

### Planned Features
- [ ] Auto-rebuild on file change
- [ ] Multiple document support
- [ ] Custom build commands UI
- [ ] Build queue for multiple files
- [ ] WebSocket for real-time updates
- [ ] Docker containerization
- [ ] Cloud deployment options

### Performance Improvements
- [ ] Incremental compilation
- [ ] Parallel LaTeX processing
- [ ] PDF streaming
- [ ] Result caching

### UI/UX Enhancements
- [ ] Dark mode
- [ ] Split view (source + PDF)
- [ ] Syntax highlighting
- [ ] Error line highlighting
- [ ] PDF annotations

---

## Next Steps

- **[Configuration](./configuration.md)** - Customize settings
- **[Contributing](../CONTRIBUTING.md)** - Development guidelines
- **[API Reference](./api.md)** - Detailed API docs
