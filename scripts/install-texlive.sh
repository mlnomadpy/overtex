#!/bin/bash

# OverTeX - TeX Live Installation Script
# This script installs TeX Live and required packages on Linux (Debian/Ubuntu)

set -e  # Exit on error

echo "========================================="
echo "OverTeX - TeX Live Installation Script"
echo "========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run as root (use sudo)"
    exit 1
fi

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo "❌ Cannot detect OS"
    exit 1
fi

echo "📦 Detected OS: $OS"
echo ""

# Ask user for installation type
echo "Select installation type:"
echo "  1) Minimal (tex live-latex-base, ~400MB, faster)"
echo "  2) Recommended (texlive-latex-extra, ~1.5GB, most packages)"
echo "  3) Full (texlive-full, ~6GB, all packages)"
echo ""
read -p "Enter choice [1-3] (default: 2): " choice
choice=${choice:-2}

case $choice in
    1)
        echo "📦 Installing minimal TeX Live..."
        PACKAGES="texlive-latex-base texlive-latex-recommended latexmk"
        ;;
    2)
        echo "📦 Installing recommended TeX Live..."
        PACKAGES="texlive-latex-base texlive-latex-recommended texlive-latex-extra latexmk"
        ;;
    3)
        echo "📦 Installing full TeX Live (this will take a while)..."
        PACKAGES="texlive-full latexmk"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🔄 Updating package lists..."
apt-get update

echo ""
echo "📦 Installing packages: $PACKAGES"
echo "   This may take several minutes..."
apt-get install -y $PACKAGES

# Verify installation
echo ""
echo "✅ Verifying installation..."

if command -v pdflatex &> /dev/null; then
    PDFLATEX_VERSION=$(pdflatex --version | head -n 1)
    echo "   ✓ pdflatex: $PDFLATEX_VERSION"
else
    echo "   ❌ pdflatex not found"
    exit 1
fi

if command -v latexmk &> /dev/null; then
    LATEXMK_VERSION=$(latexmk --version | head -n 1)
    echo "   ✓ latexmk: $LATEXMK_VERSION"
else
    echo "   ❌ latexmk not found"
    exit 1
fi

echo ""
echo "========================================="
echo "✅ Installation completed successfully!"
echo "========================================="
echo ""
echo "You can now use:"
echo "  - pdflatex: $(which pdflatex)"
echo "  - latexmk: $(which latexmk)"
echo ""
echo "To test the installation:"
echo "  cd /workspaces/overtex"
echo "  pdflatex -output-directory=tex tex/main.tex"
echo ""
