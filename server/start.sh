#!/bin/bash

# Production startup script
set -e

echo "Starting OverTeX in production mode..."

# Check if tex directory exists
if [ ! -d "/app/tex" ]; then
  echo "Creating tex directory..."
  mkdir -p /app/tex
fi

# Check if main.tex exists, if not create a sample
if [ ! -f "/app/tex/main.tex" ]; then
  echo "Creating sample main.tex..."
  cat > /app/tex/main.tex << 'EOF'
\documentclass{article}
\usepackage[utf8]{inputenc}

\title{OverTeX Sample Document}
\author{OverTeX}
\date{\today}

\begin{document}

\maketitle

\section{Introduction}

This is a sample LaTeX document created by OverTeX.

\section{Features}

OverTeX provides:
\begin{itemize}
    \item Real-time LaTeX compilation
    \item Browser-based PDF viewer
    \item Modern UI with Vue 3
    \item Docker deployment ready
\end{itemize}

\section{Usage}

Click the "Refresh PDF" button to compile this document.

\end{document}
EOF
fi

# Verify LaTeX is installed
if ! command -v pdflatex &> /dev/null; then
  echo "ERROR: pdflatex not found!"
  exit 1
fi

echo "LaTeX installation verified"
echo "Starting server..."

# Start the Node.js server
exec node dist/index.js
