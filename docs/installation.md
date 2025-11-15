# Installation Guide

This guide covers installation for different environments.

## Prerequisites

### Required
- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (comes with Node.js)
- **Git** (for cloning the repository)

### Environment-Specific
- **Local Linux**: Ubuntu 20.04+, Debian, or similar
- **GitHub Codespaces**: Pre-configured with Node.js and npm
- **WSL2**: Windows Subsystem for Linux 2

### LaTeX Distribution
You'll need a LaTeX distribution. OverTeX provides an automated installer:
- **TeX Live** (recommended) - Full distribution with all packages
- **Basic TeX Live** - Minimal installation (faster, ~500MB)

---

## Choose Your Installation Guide

- **[Local Linux Installation](./local-installation.md)** - For Ubuntu/Debian systems
- **[GitHub Codespaces](./github-codespaces.md)** - Cloud development environment
- **[WSL2 on Windows](./wsl2-installation.md)** - Windows users

---

## Quick Installation (Any Environment)

```bash
# 1. Clone the repository
git clone https://github.com/mlnomadpy/overtex.git
cd overtex

# 2. Install dependencies
cd frontend && npm install
cd ../server && npm install
cd ..

# 3. Install LaTeX (Linux/WSL only)
sudo bash scripts/install-texlive.sh

# 4. See environment-specific guides for launching
```

---

## Verifying Installation

After installation, verify everything is working:

```bash
# Check Node.js
node --version  # Should be >= 18.0.0

# Check npm
npm --version   # Should be >= 9.0.0

# Check LaTeX (if installed)
pdflatex --version
latexmk --version

# Check dependencies are installed
cd frontend && npm list | head -5
cd ../server && npm list | head -5
```

---

## Troubleshooting

### npm install fails
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Permission errors during LaTeX installation
```bash
# Make sure to use sudo
sudo bash scripts/install-texlive.sh
```

### Port already in use
```bash
# Kill processes on port 3000 (backend)
lsof -ti:3000 | xargs kill -9

# Kill processes on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

---

## Next Steps

After installation, proceed to:
- **[Usage Guide](./usage.md)** - How to start and use OverTeX
- **[Configuration](./configuration.md)** - Customize settings
- **[Troubleshooting](./troubleshooting.md)** - Common issues and solutions
