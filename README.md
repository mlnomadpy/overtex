# OverTeX

> **A local LaTeX live preview web application**  
> Real-time PDF rendering from your local LaTeX environment with a single-click refresh workflow.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![Platform](https://img.shields.io/badge/platform-Linux-lightgrey.svg)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Development Tasks](#development-tasks)
- [Technical Stack](#technical-stack)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**OverTeX** is a lightweight, local-first web application designed for LaTeX users who want instant visual feedback on their document changes. Instead of manually running `pdflatex` or `latexmk` in a terminal and opening the PDF in an external viewer, OverTeX provides:

- **Browser-based PDF viewer** with embedded rendering (no external PDF apps needed)
- **One-click build trigger** from the UI to compile your LaTeX source
- **Live reload** capability to instantly see changes after compilation
- **Clean, modern interface** built with Vue 3 and shadcn/vue components
- **Local execution** - all processing happens on your machine, no cloud services

This tool is perfect for:
- Writing academic papers, theses, or technical documentation
- Iterating quickly on LaTeX designs and layouts
- Working in environments where you prefer browser-based previews
- Learning LaTeX with immediate visual feedback

---

## ✨ Features

### Core Functionality
- ✅ **Real-time PDF Preview**: View compiled LaTeX documents directly in your browser
- ✅ **Instant Refresh**: Trigger LaTeX compilation with a single button click
- ✅ **Automatic Reload**: PDF viewer updates automatically after successful compilation
- ✅ **Build Status Indicators**: Visual feedback on compilation progress and errors
- ✅ **Compilation Logs**: View LaTeX compiler output for debugging

### Technical Features
- 🚀 **Fast Development Server**: Vite-powered hot module replacement
- 🎨 **Modern UI**: shadcn/vue components with Tailwind CSS styling
- 📱 **Responsive Design**: Works on desktop and tablet screens
- 🔒 **Local-Only**: No external API calls, all data stays on your machine
- ⚙️ **Configurable**: Support for custom LaTeX commands and output paths
- 🛠️ **Developer-Friendly**: Simple setup with `npm run dev`

---

## 🏗️ Architecture

OverTeX follows a simple three-tier architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser (UI)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Vue 3 Frontend (Vite Dev Server)            │   │
│  │  • shadcn/vue components                            │   │
│  │  • PDF viewer (pdf.js)                              │   │
│  │  • Refresh button & build controls                  │   │
│  └──────────────────┬──────────────────────────────────┘   │
└─────────────────────┼──────────────────────────────────────┘
                      │ HTTP requests
                      │ (API calls to build endpoint)
┌─────────────────────▼──────────────────────────────────────┐
│                  Node.js Backend Server                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │     Express.js API (runs in Vite server)            │   │
│  │  • POST /api/build - triggers LaTeX compilation     │   │
│  │  • GET /api/pdf - serves the output PDF             │   │
│  │  • Executes shell commands safely                   │   │
│  └──────────────────┬──────────────────────────────────┘   │
└─────────────────────┼──────────────────────────────────────┘
                      │ Shell execution
                      │ (latexmk / pdflatex)
┌─────────────────────▼──────────────────────────────────────┐
│              Local LaTeX Environment                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  TeX Live Distribution                              │   │
│  │  • latexmk (preferred)                              │   │
│  │  • pdflatex, xelatex, lualatex                      │   │
│  │  • BibTeX/Biber for bibliography                    │   │
│  └──────────────────┬──────────────────────────────────┘   │
└─────────────────────┼──────────────────────────────────────┘
                      │ Reads source, writes PDF
                      ▼
             ┌─────────────────────┐
             │  File System        │
             │  • tex/main.tex     │
             │  • tex/output.pdf   │
             │  • tex/figures/     │
             └─────────────────────┘
```

### Data Flow

1. **User Interaction**: User clicks "Refresh" button in the UI
2. **API Request**: Frontend sends POST request to `/api/build`
3. **Shell Execution**: Backend executes `latexmk -pdf tex/main.tex`
4. **Compilation**: LaTeX processes the source and generates `tex/output.pdf`
5. **Response**: Backend returns success/error status and compilation logs
6. **UI Update**: Frontend reloads the PDF viewer component with the new PDF
7. **Display**: User sees the updated document rendered in the browser

---

## 📁 Project Structure

```
overtex/
├── README.md                    # This file
├── .gitignore                   # Git ignore patterns
├── package.json                 # Root package.json (optional workspace config)
│
├── frontend/                    # Vue 3 + Vite frontend application
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.ts          # Vite configuration
│   ├── tsconfig.json           # TypeScript configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── index.html              # HTML entry point
│   │
│   ├── src/
│   │   ├── main.ts             # Vue app entry point
│   │   ├── App.vue             # Root Vue component
│   │   ├── style.css           # Global styles
│   │   │
│   │   ├── components/         # Vue components
│   │   │   ├── ui/             # shadcn/vue UI components
│   │   │   │   ├── button.vue
│   │   │   │   ├── card.vue
│   │   │   │   ├── alert.vue
│   │   │   │   └── ...
│   │   │   ├── PdfViewer.vue   # PDF rendering component
│   │   │   ├── BuildPanel.vue  # Build controls and status
│   │   │   └── LogViewer.vue   # Compilation log display
│   │   │
│   │   ├── composables/        # Vue composables
│   │   │   ├── usePdfViewer.ts # PDF viewer logic
│   │   │   └── useBuild.ts     # Build trigger logic
│   │   │
│   │   ├── lib/                # Utility functions
│   │   │   └── utils.ts
│   │   │
│   │   └── types/              # TypeScript type definitions
│   │       └── index.ts
│   │
│   └── public/                 # Static assets
│       └── favicon.ico
│
├── server/                      # Node.js backend API
│   ├── package.json            # Backend dependencies (if separate)
│   ├── tsconfig.json           # TypeScript configuration
│   │
│   ├── src/
│   │   ├── index.ts            # Express server entry point
│   │   ├── routes/
│   │   │   └── build.ts        # Build API routes
│   │   ├── services/
│   │   │   └── latex.ts        # LaTeX compilation service
│   │   └── utils/
│   │       └── logger.ts       # Logging utilities
│   │
│   └── dist/                   # Compiled JavaScript (gitignored)
│
├── scripts/                     # Utility scripts
│   ├── install-texlive.sh      # TeX Live installation script
│   └── setup-dev.sh            # Development environment setup
│
├── tex/                         # LaTeX project files
│   ├── main.tex                # Main LaTeX document
│   ├── output.pdf              # Compiled PDF output (gitignored)
│   ├── figures/                # Image assets
│   ├── chapters/               # Document chapters/sections
│   └── bibliography.bib        # BibTeX references
│
└── docs/                        # Additional documentation
    ├── API.md                  # API documentation
    ├── CONTRIBUTING.md         # Contribution guidelines
    └── DEVELOPMENT.md          # Development guide
```

---

## 📦 Prerequisites

### Required Software

| Software | Minimum Version | Purpose | Installation Check |
|----------|----------------|---------|-------------------|
| **Node.js** | 18.0.0 | JavaScript runtime for frontend and backend | `node --version` |
| **npm** | 9.0.0 | Package manager | `npm --version` |
| **TeX Live** | 2020+ | LaTeX distribution | `pdflatex --version` |
| **latexmk** | 4.70+ | LaTeX build automation (recommended) | `latexmk --version` |
| **Git** | 2.0+ | Version control | `git --version` |

### Operating System

- **Primary**: Linux (Ubuntu 20.04+, Debian 11+, Fedora 35+, Arch Linux)
- **Development Environment**: Tested in Ubuntu 24.04 dev container
- **Shell**: Bash 4.0+ (used by build scripts)

### Optional Dependencies

- **TypeScript**: `npm install -g typescript` (for development)
- **pnpm**: Alternative package manager (faster than npm)
- **Docker**: For containerized development (optional)

### Hardware Requirements

- **RAM**: Minimum 2GB, recommended 4GB+ (TeX Live can be memory-intensive)
- **Disk Space**: 
  - Minimal TeX Live: ~1GB
  - Full TeX Live: ~6GB
  - Project files: ~100MB
- **CPU**: Any modern processor (LaTeX compilation is CPU-bound)

---

## 🚀 Installation & Setup

### Quick Start (3 Steps)

```bash
# 1. Clone the repository
git clone https://github.com/mlnomadpy/overtex.git
cd overtex

# 2. Install dependencies
cd frontend && npm install
cd ../server && npm install
cd ..

# 3. Install TeX Live
sudo bash scripts/install-texlive.sh
```

Then see [Usage](#usage) section below to start the servers.

---

### Detailed Installation Steps

#### Step 1: Clone the Repository

```bash
git clone https://github.com/mlnomadpy/overtex.git
cd overtex
```

Or download and extract the ZIP file from GitHub.

#### Step 2: Install Node.js Dependencies

OverTeX has two components that need dependencies installed:

**Frontend (Vue + Vite):**
```bash
cd frontend
npm install
```

**Backend (Express API):**
```bash
cd ../server
npm install
```

**Return to project root:**
```bash
cd ..
```

#### Step 3: Install TeX Live

**Option A: Automated Installation (Recommended)**

```bash
# Run the provided installation script
sudo bash scripts/install-texlive.sh
```

When prompted, choose:
- **Option 1**: Minimal install (~500MB, faster, includes common packages)
- **Option 2**: Full install (~5GB, slower, includes all packages)

The script will:
- Update your package lists
- Install TeX Live and core packages
- Install `latexmk` for automated builds
- Set up PATH variables
- Verify the installation

**Option B: Manual Installation (Ubuntu/Debian)**

```bash
# Full installation (~5GB, includes all packages)
sudo apt update
sudo apt install -y texlive-full latexmk

# OR Minimal installation (~500MB, basic packages only)
sudo apt install -y texlive-latex-base texlive-latex-recommended \
                    texlive-latex-extra latexmk
```

#### Step 4: Verify TeX Live Installation

```bash
# Check pdflatex
pdflatex --version
# Expected output: pdfTeX 3.14159265-2.6-1.40.XX...

# Check latexmk
latexmk --version
# Expected output: Latexmk, John Collins, XX Month XXXX. Version X.XX

# Test compilation
mkdir -p test
echo '\documentclass{article}\begin{document}Test\end{document}' > test/test.tex
pdflatex -output-directory=test test/test.tex
# Should create test/test.pdf
rm -rf test
```

#### Step 4: Install Node.js (if not already installed)

**Ubuntu/Debian:**

```bash
# Using NodeSource repository for latest LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x or higher
npm --version   # Should show 10.x.x or higher
```

**Alternative: Using nvm (Node Version Manager)**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

#### Step 5: Install Frontend Dependencies

```bash
cd frontend

# Install all npm packages
npm install

# This will install:
# - Vue 3
# - Vite
# - shadcn/vue components
# - Tailwind CSS
# - pdf.js
# - Other dependencies
```

If you encounter permission errors:

```bash
# Fix npm permissions (don't use sudo with npm)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

#### Step 6: Create Sample LaTeX Project

```bash
# From repository root
mkdir -p tex/figures

# Create a sample LaTeX document
cat > tex/main.tex << 'EOF'
\documentclass[12pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{graphicx}
\usepackage{hyperref}
\usepackage{amsmath}

\title{OverTeX Test Document}
\author{Your Name}
\date{\today}

\begin{document}

\maketitle

\section{Introduction}

This is a test document for \textbf{OverTeX}, a local LaTeX live preview application.

\subsection{Features}

\begin{itemize}
    \item Real-time PDF rendering
    \item Browser-based viewer
    \item One-click compilation
    \item Modern Vue.js interface
\end{itemize}

\section{Mathematics}

Here's an example equation:

\begin{equation}
    E = mc^2
\end{equation}

And an inline formula: $\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$

\section{Conclusion}

Edit this file in your favorite editor, click refresh in the UI, and see the changes instantly!

\end{document}
EOF

echo "✅ Sample LaTeX document created at tex/main.tex"
```

#### Step 7: Configure the Application (Optional)

Create a configuration file if you need custom settings:

```bash
# Frontend configuration
cat > frontend/.env.local << EOF
VITE_LATEX_SOURCE_PATH=../tex
VITE_LATEX_OUTPUT_FILE=output.pdf
VITE_LATEX_COMMAND=latexmk
VITE_API_PORT=5173
EOF
```

---

## 💻 Usage

### Starting the Development Server

```bash
# From the frontend directory
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
  ➜  press h + enter to show help
```

### Opening the Application

1. Open your browser
2. Navigate to `http://localhost:5173`
3. You should see the OverTeX interface with:
   - PDF viewer panel (main area)
   - Build controls (top bar)
   - Status indicators
   - Log viewer (bottom panel, collapsible)

### Basic Workflow

1. **Edit your LaTeX file**: Open `tex/main.tex` in your favorite editor (VS Code, Vim, Emacs, etc.)
2. **Make changes**: Modify the content, add sections, equations, figures, etc.
3. **Save the file**: `Ctrl+S` or `:w`
4. **Click "Refresh"**: In the OverTeX UI, click the refresh button
5. **View results**: The PDF updates automatically in the browser
6. **Check logs**: If there are errors, expand the log viewer to see compilation output

### Example Editing Session

```bash
# Terminal 1: Keep the dev server running
cd frontend && npm run dev

# Terminal 2: Edit LaTeX file
cd tex
vim main.tex  # or code main.tex, or nano main.tex

# Make changes, save, then refresh in browser
# Repeat as needed
```

### Keyboard Shortcuts (Planned)

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + R` | Refresh (rebuild PDF) |
| `Ctrl/Cmd + L` | Toggle log viewer |
| `Ctrl/Cmd + +` | Zoom in PDF |
| `Ctrl/Cmd + -` | Zoom out PDF |
| `Ctrl/Cmd + 0` | Reset PDF zoom |

### Advanced Usage

**Custom LaTeX Commands:**

You can configure custom build commands in the UI settings or via environment variables:

```bash
# Use XeLaTeX instead of pdflatex
VITE_LATEX_COMMAND="xelatex -interaction=nonstopmode"

# Use custom latexmk configuration
VITE_LATEX_COMMAND="latexmk -pdf -pdflatex='pdflatex -shell-escape'"
```

**Multiple Documents:**

To work with multiple LaTeX files, you can:
1. Change the source file in the UI settings
2. Use different project directories
3. Run multiple instances on different ports

---

## 📝 Development Tasks

### Complete Implementation Checklist

#### Phase 1: Project Setup ✅
- [x] **Write comprehensive README** (this document)
  - Project overview and goals
  - Architecture diagram and data flow
  - Complete directory structure
  - Detailed installation instructions
  - Usage guide with examples
  - All requirements and prerequisites

#### Phase 2: Frontend Foundation
- [ ] **Scaffold Vue 3 + Vite Application**
  - Initialize Vite project with Vue template
  - Configure TypeScript (tsconfig.json)
  - Set up project structure (components/, composables/, lib/)
  - Configure path aliases (@/ imports)
  - Add ESLint and Prettier for code quality
  - Create basic App.vue layout

#### Phase 3: UI Framework
- [ ] **Install and Configure shadcn/vue**
  - Install shadcn/vue CLI
  - Initialize shadcn/vue configuration
  - Install Tailwind CSS and PostCSS
  - Configure Tailwind (tailwind.config.js)
  - Add base UI components (Button, Card, Alert, Badge)
  - Set up theme system (light/dark mode support)
  - Create custom color palette
  - Add typography plugin

#### Phase 4: PDF Viewer
- [ ] **Implement PDF Viewer Component**
  - Install pdf.js library (`pdfjs-dist`)
  - Create PdfViewer.vue component
  - Implement PDF rendering with canvas
  - Add zoom controls (+, -, fit-to-width, fit-to-page)
  - Add navigation (prev/next page, page input)
  - Implement loading states and error handling
  - Add progress indicator for large PDFs
  - Support for PDF refresh/reload
  - Handle PDF not found state
  - Create composable `usePdfViewer.ts` for logic separation

#### Phase 5: Build System
- [ ] **Implement LaTeX Build Runner**
  - Create Express.js server (server/src/index.ts)
  - Implement `/api/build` POST endpoint
  - Create LaTeX service (server/src/services/latex.ts)
  - Execute `latexmk` via `child_process.exec`
  - Capture stdout/stderr for compilation logs
  - Parse LaTeX errors and warnings
  - Implement build timeout (prevent hanging)
  - Add build queue (prevent concurrent builds)
  - Create `/api/pdf` GET endpoint to serve output.pdf
  - Implement `/api/status` GET endpoint for health checks
  - Add CORS configuration (localhost only)

- [ ] **Create Build UI Components**
  - BuildPanel.vue component with refresh button
  - Build status indicators (idle, building, success, error)
  - Progress bar for compilation
  - LogViewer.vue component for compilation output
  - Collapsible log panel
  - Syntax highlighting for LaTeX errors
  - Copy log button
  - Clear log button
  - Create composable `useBuild.ts` for API calls

#### Phase 6: Integration & Polish
- [ ] **Connect Frontend to Backend**
  - Configure Vite proxy for API requests
  - Implement error handling and retry logic
  - Add loading states throughout UI
  - Implement optimistic UI updates
  - Add success/error notifications (toast)
  - Handle network errors gracefully

- [ ] **Development Workflow Setup**
  - Create `npm run dev` script for concurrent frontend+backend
  - Create `npm run build` script for production builds
  - Create `npm run preview` for production preview
  - Add `npm run lint` for code linting
  - Add `npm run format` for code formatting
  - Add `npm run type-check` for TypeScript checking
  - Create development documentation (DEVELOPMENT.md)

#### Phase 7: Installation & Automation
- [ ] **Create TeX Live Installer Script**
  - Write `scripts/install-texlive.sh`
  - Add interactive prompts (minimal vs full installation)
  - Implement package list installation
  - Add verification checks
  - Handle different Linux distributions (apt, dnf, pacman)
  - Add error handling and rollback
  - Create success/failure messages
  - Add PATH configuration
  - Test script in clean environment

- [ ] **Create Development Setup Script**
  - Write `scripts/setup-dev.sh`
  - Check for required dependencies (node, npm, git)
  - Install frontend dependencies
  - Install backend dependencies
  - Create sample tex/ directory if missing
  - Set up git hooks (pre-commit)
  - Initialize configuration files
  - Run verification tests

#### Phase 8: Testing & Verification
- [ ] **End-to-End Testing**
  - Create sample `tex/main.tex` with various LaTeX features
  - Test basic document compilation
  - Test math equations rendering
  - Test figure inclusion
  - Test bibliography (BibTeX)
  - Test error handling (syntax errors)
  - Test with large documents (50+ pages)
  - Test rapid refresh (multiple builds in succession)
  - Test different LaTeX engines (pdflatex, xelatex, lualatex)

- [ ] **UI/UX Testing**
  - Test on different screen sizes
  - Test PDF viewer performance
  - Test zoom functionality
  - Test page navigation
  - Test log viewer usability
  - Verify loading states
  - Verify error messages
  - Check accessibility (keyboard navigation, ARIA labels)

#### Phase 9: Documentation & Examples
- [ ] **Create Additional Documentation**
  - Write API.md (API endpoint documentation)
  - Write CONTRIBUTING.md (contribution guidelines)
  - Write DEVELOPMENT.md (developer setup guide)
  - Create example LaTeX templates (article, report, thesis)
  - Add screenshots to README
  - Create video demo/GIF
  - Document common issues and solutions
  - Write FAQ section

- [ ] **Code Documentation**
  - Add JSDoc comments to all functions
  - Document component props and events
  - Add inline comments for complex logic
  - Create architecture decision records (ADRs)
  - Document configuration options

#### Phase 10: Optimization & Final Polish
- [ ] **Performance Optimization**
  - Optimize PDF rendering (lazy loading, caching)
  - Implement debouncing for rapid refreshes
  - Minimize bundle size (code splitting)
  - Optimize Tailwind CSS (purge unused classes)
  - Add service worker for offline capability (optional)

- [ ] **Production Readiness**
  - Add environment variable validation
  - Implement proper error logging
  - Add security headers
  - Create production build scripts
  - Add Docker support (optional)
  - Create deployment guide
  - Add CI/CD configuration (GitHub Actions)

---

## 🛠️ Technical Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Vue.js** | 3.3+ | Progressive JavaScript framework |
| **Vite** | 5.0+ | Lightning-fast build tool and dev server |
| **TypeScript** | 5.0+ | Type-safe JavaScript |
| **shadcn/vue** | Latest | Accessible and customizable component library |
| **Tailwind CSS** | 3.4+ | Utility-first CSS framework |
| **pdf.js** | 3.11+ | PDF rendering library (Mozilla) |
| **Axios** | 1.6+ | HTTP client for API requests |
| **Vue Router** | 4.0+ | Official router for Vue.js (if multi-page) |
| **Pinia** | 2.1+ | State management (if needed) |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express.js** | 4.18+ | Web application framework |
| **TypeScript** | 5.0+ | Type-safe JavaScript |
| **child_process** | Built-in | Execute shell commands |
| **Winston** | 3.11+ | Logging library |
| **CORS** | 2.8+ | Cross-origin resource sharing middleware |

### LaTeX Toolchain

| Tool | Purpose |
|------|---------|
| **TeX Live** | Complete LaTeX distribution |
| **latexmk** | Automated LaTeX build tool (preferred) |
| **pdflatex** | LaTeX to PDF compiler |
| **xelatex** | Extended LaTeX compiler (Unicode, system fonts) |
| **lualatex** | Lua-enhanced LaTeX compiler |
| **bibtex/biber** | Bibliography management |

### Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | JavaScript/TypeScript linter |
| **Prettier** | Code formatter |
| **Husky** | Git hooks |
| **lint-staged** | Run linters on staged files |
| **Vitest** | Unit testing framework (Vite-native) |
| **Playwright** | End-to-end testing |

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` files for local configuration:

**Frontend (`frontend/.env.local`):**

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:5173
VITE_API_TIMEOUT=30000

# LaTeX Configuration
VITE_LATEX_SOURCE_PATH=../tex
VITE_LATEX_OUTPUT_FILE=output.pdf
VITE_LATEX_MAIN_FILE=main.tex

# Build Configuration
VITE_LATEX_COMMAND=latexmk
VITE_LATEX_ARGS="-pdf -interaction=nonstopmode -synctex=1"
VITE_BUILD_TIMEOUT=60000

# UI Configuration
VITE_DEFAULT_ZOOM=100
VITE_MAX_ZOOM=200
VITE_MIN_ZOOM=50
```

**Backend (`server/.env.local`):**

```bash
# Server Configuration
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# LaTeX Configuration
LATEX_COMMAND=latexmk
LATEX_SOURCE_DIR=../tex
LATEX_OUTPUT_DIR=../tex
MAX_BUILD_TIME=60000

# Security
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
ENABLE_CORS=true
```

### Vite Configuration

**`frontend/vite.config.ts`:**

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

### Tailwind Configuration

**`frontend/tailwind.config.js`:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
    './app/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... more colors
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. TeX Live Not Found

**Symptom:** Command not found: `pdflatex` or `latexmk`

**Solution:**
```bash
# Verify installation
which pdflatex
which latexmk

# If not found, install TeX Live
sudo bash scripts/install-texlive.sh

# Or install manually
sudo apt install texlive-full latexmk

# Add to PATH if needed
echo 'export PATH=/usr/local/texlive/2023/bin/x86_64-linux:$PATH' >> ~/.bashrc
source ~/.bashrc
```

#### 2. PDF Not Updating After Build

**Symptom:** Clicking refresh builds successfully but PDF doesn't change

**Possible Causes:**
- Browser caching the old PDF
- File path mismatch
- Permission issues

**Solutions:**
```bash
# 1. Check if PDF is actually being generated
ls -lh tex/output.pdf
stat tex/output.pdf  # Check modification time

# 2. Clear browser cache (hard refresh)
# Chrome/Edge: Ctrl+Shift+R
# Firefox: Ctrl+Shift+R

# 3. Check file permissions
chmod 644 tex/output.pdf

# 4. Verify file path in configuration
cat frontend/.env.local | grep VITE_LATEX_OUTPUT_FILE

# 5. Add cache-busting to PDF URL (append timestamp)
```

#### 3. Compilation Fails with Package Errors

**Symptom:** LaTeX errors like `! LaTeX Error: File 'package.sty' not found`

**Solution:**
```bash
# Install missing LaTeX packages
sudo tlmgr install <package-name>

# Or install common packages
sudo tlmgr install collection-latexextra

# Update TeX Live package manager
sudo tlmgr update --self
sudo tlmgr update --all
```

#### 4. Port Already in Use

**Symptom:** `Error: listen EADDRINUSE: address already in use :::5173`

**Solution:**
```bash
# Find process using the port
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=5174 npm run dev
```

#### 5. Node Modules Installation Fails

**Symptom:** `npm install` fails with permission errors

**Solution:**
```bash
# Don't use sudo with npm!
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### 6. TypeScript Errors

**Symptom:** Type errors in IDE or during build

**Solution:**
```bash
# Reinstall dependencies
npm install

# Update TypeScript
npm install -D typescript@latest

# Check tsconfig.json
cat tsconfig.json

# Restart TypeScript server in VS Code
# Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

#### 7. CORS Errors in Browser Console

**Symptom:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
```bash
# Check backend CORS configuration
# Ensure frontend URL is in allowed origins

# Update server/.env.local
ALLOWED_ORIGINS=http://localhost:5173

# Verify Vite proxy configuration in vite.config.ts
```

#### 8. LaTeX Build Hangs

**Symptom:** Build never completes, UI shows "Building..." forever

**Possible Causes:**
- LaTeX waiting for user input (interactive mode)
- Infinite loop in LaTeX code
- Missing file causing prompt

**Solutions:**
```bash
# Always use non-interactive mode
VITE_LATEX_ARGS="-interaction=nonstopmode"

# Add build timeout in backend
MAX_BUILD_TIME=60000  # 60 seconds

# Test compilation manually
cd tex
latexmk -pdf -interaction=nonstopmode main.tex

# Check for errors
cat main.log
```

#### 9. High Memory Usage

**Symptom:** System becomes slow during compilation

**Solution:**
```bash
# Monitor memory usage
htop

# Compile with reduced memory
ulimit -m 2097152  # Limit to 2GB

# Use -draftmode for faster compilation during editing
latexmk -pdf -draftmode main.tex

# Close other applications
```

#### 10. Windows Line Endings (CRLF) Issues

**Symptom:** Scripts fail with `^M: command not found`

**Solution:**
```bash
# Convert CRLF to LF
dos2unix scripts/install-texlive.sh

# Or using sed
sed -i 's/\r$//' scripts/install-texlive.sh

# Configure git to handle line endings
git config --global core.autocrlf input
```

### Getting Help

If you encounter an issue not listed here:

1. **Check the logs:**
   - Frontend: Browser console (F12)
   - Backend: Terminal output
   - LaTeX: `tex/*.log` files

2. **Enable debug mode:**
   ```bash
   # Frontend
   VITE_LOG_LEVEL=debug npm run dev
   
   # Backend
   LOG_LEVEL=debug npm run dev
   ```

3. **Create a minimal reproducible example:**
   ```bash
   # Test with minimal LaTeX document
   echo '\documentclass{article}\begin{document}Test\end{document}' > tex/test.tex
   pdflatex -output-directory=tex tex/test.tex
   ```

4. **Search existing issues:**
   - GitHub Issues: [github.com/mlnomadpy/overtex/issues](https://github.com/mlnomadpy/overtex/issues)
   - TeX StackExchange: [tex.stackexchange.com](https://tex.stackexchange.com)

5. **Report a bug:**
   - Use the GitHub issue template
   - Include error messages, logs, and system info
   - Provide steps to reproduce

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Setup for Contributors

```bash
# Fork and clone your fork
git clone https://github.com/YOUR-USERNAME/overtex.git
cd overtex

# Add upstream remote
git remote add upstream https://github.com/mlnomadpy/overtex.git

# Create a branch
git checkout -b feature/my-feature

# Install dependencies
cd frontend && npm install
cd ../server && npm install

# Make changes and test
npm run dev
npm run test
npm run lint

# Commit and push
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 mlnomadpy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- [Vue.js](https://vuejs.org/) - The progressive JavaScript framework
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- [shadcn/vue](https://www.shadcn-vue.com/) - Beautifully designed components
- [pdf.js](https://mozilla.github.io/pdf.js/) - Mozilla's PDF rendering library
- [TeX Live](https://www.tug.org/texlive/) - Comprehensive TeX system
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

## 📬 Contact

- **GitHub**: [@mlnomadpy](https://github.com/mlnomadpy)
- **Project Link**: [https://github.com/mlnomadpy/overtex](https://github.com/mlnomadpy/overtex)
- **Issues**: [https://github.com/mlnomadpy/overtex/issues](https://github.com/mlnomadpy/overtex/issues)

---

## 🗺️ Roadmap

### Version 1.0 (Current)
- ✅ Basic PDF viewing
- ✅ LaTeX compilation trigger
- ✅ shadcn/vue UI components
- ✅ Single document support

### Version 1.1 (Planned)
- [ ] Auto-refresh on file save (file watcher)
- [ ] Multiple document tabs
- [ ] Build history
- [ ] Persistent settings
- [ ] Keyboard shortcuts

### Version 1.2 (Future)
- [ ] Syntax highlighting in error messages
- [ ] BibTeX/Biber integration UI
- [ ] Package manager integration
- [ ] Template gallery
- [ ] Export to different formats (HTML, DOCX)

### Version 2.0 (Vision)
- [ ] Collaborative editing (real-time)
- [ ] Cloud sync
- [ ] Mobile app
- [ ] VS Code extension
- [ ] Git integration

---

**Made with ❤️ for the LaTeX community**