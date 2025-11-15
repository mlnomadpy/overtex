# Usage Guide

This guide covers how to start and use OverTeX after installation.

## Quick Start

```bash
# Terminal 1: Start backend
cd server && npm run dev

# Terminal 2: Start frontend
cd frontend && npm run dev

# Browser: Open http://localhost:5173
```

---

## Starting OverTeX

OverTeX requires **two servers** running simultaneously:
1. **Backend Server** - Express API (port 3000)
2. **Frontend Server** - Vite dev server (port 5173)

Choose the method that works best for you:

### Method 1: Two Terminals (Recommended)

Open two terminal windows or tabs:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Expected output:
```
🚀 OverTeX API Server running on http://localhost:3000
📄 PDF endpoint: http://localhost:3000/api/pdf
🔨 Build endpoint: http://localhost:3000/api/build
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v7.2.2  ready in 335 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Open Browser:**
- Navigate to `http://localhost:5173`
- Or click the link in the terminal output

### Method 2: Using tmux

tmux allows you to run both servers in a single terminal window:

```bash
# Install tmux (if not installed)
sudo apt-get install tmux

# Create new session
tmux new-session -s overtex

# Split window horizontally (Ctrl+b then ")
# You now have top and bottom panes

# Top pane - Backend
cd server && npm run dev

# Switch to bottom pane (Ctrl+b then down arrow)
cd frontend && npm run dev

# Navigate between panes: Ctrl+b then arrow keys
# Detach from session: Ctrl+b then d
# Reattach later: tmux attach -t overtex
# Kill session: tmux kill-session -t overtex
```

### Method 3: Using GNU Screen

Screen is an alternative to tmux:

```bash
# Install screen (if not installed)
sudo apt-get install screen

# Start backend in background
screen -S backend -dm bash -c "cd server && npm run dev"

# Start frontend in background
screen -S frontend -dm bash -c "cd frontend && npm run dev"

# View running screens
screen -ls

# Attach to view logs
screen -r backend  # Detach: Ctrl+a then d
screen -r frontend # Detach: Ctrl+a then d

# Kill screens
screen -S backend -X quit
screen -S frontend -X quit
```

### Method 4: VS Code Tasks (GitHub Codespaces)

If using VS Code or Codespaces, split the terminal:

```
1. Open terminal (Ctrl+` or View → Terminal)
2. Click the split icon in terminal panel (or Ctrl+Shift+5)
3. Left side: cd server && npm run dev
4. Right side: cd frontend && npm run dev
```

---

## Using the Application

### 1. Opening the UI

Once both servers are running, open your browser to `http://localhost:5173`.

You'll see:
- **Header** with "OverTeX" title
- **Build Panel** with "Refresh PDF" button
- **PDF Viewer** (empty initially)
- **Log Viewer** (collapsed, at bottom)

### 2. Editing LaTeX Documents

The default document is at `tex/main.tex`. Edit it using your preferred editor:

**Using VS Code:**
```bash
code tex/main.tex
```

**Using Vim:**
```bash
vim tex/main.tex
```

**Using Nano:**
```bash
nano tex/main.tex
```

**Sample LaTeX document:**
```latex
\documentclass[12pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{amsmath}

\title{My Document}
\author{Your Name}
\date{\today}

\begin{document}
\maketitle

\section{Introduction}
This is my document.

\subsection{Math Example}
Here's an equation:
\begin{equation}
    E = mc^2
\end{equation}

\end{document}
```

### 3. Building and Viewing PDFs

**Step-by-Step:**

1. **Click "Refresh PDF"** button in the UI
2. **Watch the status**:
   - "Building..." - Compilation in progress
   - "✓ PDF generated successfully" - Success
   - Error message - If compilation failed
3. **View the PDF** - Automatically loads in the viewer
4. **Check logs** - Click to expand log viewer at bottom

**Build Status Indicators:**
- 🔵 **Idle** - Ready to build
- 🟡 **Building...** - Compilation in progress
- 🟢 **Success** - PDF generated
- 🔴 **Error** - Compilation failed (check logs)

### 4. PDF Viewer Features

The embedded PDF viewer provides:

**Browser Native Controls:**
- **Zoom**: Browser zoom (Ctrl+Plus/Minus)
- **Scroll**: Mouse wheel or scrollbar
- **Navigate**: Click and drag
- **Full Screen**: Browser full-screen mode (F11)
- **Print**: Right-click → Print

**Automatic Features:**
- Auto-reloads after successful build
- Maintains zoom level between reloads
- Responsive sizing

### 5. Build Logs

Click the log viewer panel at the bottom to expand:

**What you'll see:**
- LaTeX compiler output
- Warnings and errors
- Package information
- Page counts and sizes

**Actions:**
- **Expand/Collapse**: Click the header
- **Clear Logs**: Click "Clear Logs" button
- **Copy**: Select text and copy

**Understanding Logs:**
```
This is pdfTeX, Version 3.14159265...   ← Compiler version
(/workspaces/overtex/tex/main.tex       ← Processing your file
LaTeX2e <2021-11-15>                    ← LaTeX version
Document Class: article...              ← Document class
...
Output written on main.pdf (1 page).   ← Success!
```

---

## Workflow Examples

### Basic Workflow

```bash
1. Edit tex/main.tex
2. Click "Refresh PDF" in browser
3. View updated PDF
4. Repeat as needed
```

### Workflow with Errors

```bash
1. Edit tex/main.tex
2. Click "Refresh PDF"
3. See error message
4. Click log viewer to see details
5. Fix the error in your .tex file
6. Click "Refresh PDF" again
```

### Working with Multiple Files

```bash
# Create a new document
cp tex/main.tex tex/chapter1.tex

# Edit main.tex to include it
\input{chapter1}

# Build as usual - latexmk handles dependencies
```

### Using BibTeX

```latex
% In your .tex file
\bibliographystyle{plain}
\bibliography{references}

% Create references.bib
% Build will automatically run bibtex
```

---

## Keyboard Shortcuts

### In the Browser
- `Ctrl+R` or `F5` - Reload page
- `Ctrl+Plus/Minus` - Zoom PDF
- `Ctrl+0` - Reset zoom
- `F11` - Full screen

### In Your Editor
Depends on your editor choice (VS Code, Vim, etc.)

---

## Tips and Tricks

### Fast Iteration
```bash
# Keep browser and editor visible side-by-side
# Edit → Save → Click Refresh → View result
```

### Auto-Build on Save (Future Feature)
Currently manual refresh - auto-watch coming soon!

### Working with Images
```bash
# Place images in tex/ directory
mkdir -p tex/images
cp myimage.png tex/images/

# Reference in LaTeX
\includegraphics{images/myimage.png}
```

### Custom LaTeX Commands
The backend runs `latexmk -pdf` which handles:
- Multiple compilation passes
- BibTeX/Biber
- Index generation
- Cross-references

### Performance Tips
- Use minimal LaTeX install for faster compilation
- Clear auxiliary files occasionally: `rm tex/*.aux tex/*.log`
- Keep documents modular with `\input{}` or `\include{}`

---

## Stopping OverTeX

### Standard Method
Press `Ctrl+C` in each terminal window running the servers.

### If Using tmux
```bash
tmux kill-session -t overtex
```

### If Using Screen
```bash
screen -S backend -X quit
screen -S frontend -X quit
```

### Force Kill (if needed)
```bash
# Find and kill processes
pkill -f "npm run dev"

# Or kill by port
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

---

## Troubleshooting

### PDF doesn't update
- Check if build succeeded (status message)
- Check logs for LaTeX errors
- Hard refresh browser: `Ctrl+Shift+R`

### "Failed to load PDF"
- Ensure backend is running on port 3000
- Check browser console for errors
- Verify `tex/main.pdf` exists

### Backend not responding
```bash
# Check if backend is running
curl http://localhost:3000/api/health

# Restart backend if needed
```

### Frontend not loading
```bash
# Check if frontend is running
curl http://localhost:5173

# Check for port conflicts
lsof -i :5173
```

### LaTeX compilation errors
- Check syntax in your .tex file
- View logs for specific error messages
- Ensure all required packages are installed

---

## Next Steps

- **[Configuration](./configuration.md)** - Customize settings
- **[Troubleshooting](./troubleshooting.md)** - Detailed problem solving
- **[Architecture](./architecture.md)** - How OverTeX works
