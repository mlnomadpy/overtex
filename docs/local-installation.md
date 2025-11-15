# Local Linux Installation

This guide covers installing OverTeX on your **local Linux machine** (Ubuntu, Debian, or similar distributions).

## Prerequisites

Ensure you have:
- Ubuntu 20.04+ or Debian 10+
- Sudo/root access
- At least 2GB free disk space (6GB for full TeX Live)
- Internet connection for downloading packages

---

## Step-by-Step Installation

### Step 1: Install Node.js and npm

If you don't have Node.js installed:

```bash
# Using NodeSource repository (recommended)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show v10.x.x
```

**Alternative: Using nvm (Node Version Manager)**
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.bashrc

# Install Node.js
nvm install 20
nvm use 20
```

### Step 2: Clone the Repository

```bash
# Navigate to where you want to install
cd ~  # or cd ~/projects

# Clone the repository
git clone https://github.com/mlnomadpy/overtex.git
cd overtex
```

### Step 3: Install Project Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install
# This takes 1-2 minutes

# Install backend dependencies
cd ../server
npm install
# This takes 30-60 seconds

# Return to project root
cd ..
```

### Step 4: Install LaTeX (TeX Live)

OverTeX provides an automated installation script:

```bash
# Run the installer with sudo
sudo bash scripts/install-texlive.sh
```

**You'll be prompted to choose:**

**Option 1: Minimal Install** (Recommended for most users)
- Size: ~500MB download, ~1GB installed
- Time: 3-5 minutes
- Includes: Common LaTeX packages
- Good for: Most academic papers, articles, basic documents

**Option 2: Full Install** (For advanced users)
- Size: ~4GB download, ~6GB installed
- Time: 15-30 minutes (depending on internet speed)
- Includes: All LaTeX packages
- Good for: Complex documents, multiple languages, specialized packages

**What the script does:**
1. Updates apt package lists
2. Installs TeX Live with chosen packages
3. Installs latexmk (automated build tool)
4. Verifies the installation
5. Shows installed versions

### Step 5: Verify Installation

```bash
# Check Node.js and npm
node --version
npm --version

# Check LaTeX installation
pdflatex --version
# Should show: pdfTeX 3.141592653-2.6-1.40.XX

latexmk --version
# Should show: Latexmk, John Collins, version X.XX

# Check which packages are installed
dpkg -l | grep texlive
```

### Step 6: Test LaTeX Compilation

```bash
# Try compiling the sample document
cd tex
pdflatex main.tex

# Check if PDF was created
ls -lh main.pdf
# Should show a file ~100KB

# View the PDF (if you have a PDF viewer installed)
xdg-open main.pdf
# or
evince main.pdf
# or
okular main.pdf

cd ..
```

---

## Directory Structure After Installation

```
overtex/
├── frontend/
│   ├── node_modules/     ← ~250MB of frontend dependencies
│   └── package.json
├── server/
│   ├── node_modules/     ← ~50MB of backend dependencies
│   └── package.json
├── tex/
│   ├── main.tex
│   └── main.pdf          ← Generated after test compilation
├── scripts/
│   └── install-texlive.sh
└── docs/                 ← Documentation
```

---

## Manual LaTeX Installation (Alternative)

If the automated script doesn't work, install manually:

### Minimal Installation
```bash
sudo apt update
sudo apt install -y \
    texlive-latex-base \
    texlive-latex-recommended \
    texlive-latex-extra \
    texlive-fonts-recommended \
    latexmk
```

### Full Installation
```bash
sudo apt update
sudo apt install -y texlive-full latexmk
```

### Verify Manual Installation
```bash
pdflatex --version
latexmk --version
```

---

## System Requirements

### Minimum Requirements
- **CPU**: Any modern processor (1GHz+)
- **RAM**: 2GB (4GB recommended)
- **Disk**: 2GB free space (8GB for full install)
- **OS**: Ubuntu 20.04+, Debian 10+

### Recommended Requirements
- **CPU**: 2+ cores
- **RAM**: 4GB or more
- **Disk**: SSD with 10GB+ free space
- **OS**: Ubuntu 22.04 LTS or newer

---

## Post-Installation Setup

### Configure Git (if not already done)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Set Up Your Editor

Install your preferred LaTeX editor:

**VS Code** (Recommended)
```bash
# Install VS Code
sudo snap install code --classic

# Install LaTeX Workshop extension
code --install-extension James-Yu.latex-workshop
```

**Vim with LaTeX support**
```bash
sudo apt install vim vim-latexsuite
```

**Emacs with AUCTeX**
```bash
sudo apt install emacs auctex
```

### Optional: Install PDF Tools

```bash
# PDF viewer
sudo apt install evince

# PDF utilities
sudo apt install poppler-utils

# For converting images
sudo apt install imagemagick
```

---

## Updating OverTeX

To update OverTeX to the latest version:

```bash
cd overtex

# Pull latest changes
git pull origin main

# Update dependencies
cd frontend && npm install
cd ../server && npm install
cd ..

# Update LaTeX packages (if needed)
sudo apt update
sudo apt upgrade texlive-* latexmk
```

---

## Uninstalling

### Remove OverTeX
```bash
# Just delete the directory
rm -rf ~/overtex
```

### Remove LaTeX (if desired)
```bash
# Remove TeX Live packages
sudo apt remove --purge texlive-* latexmk

# Clean up
sudo apt autoremove
sudo apt autoclean
```

### Remove Node.js (if desired)
```bash
# If installed via apt
sudo apt remove --purge nodejs npm

# If installed via nvm
nvm uninstall 20
```

---

## Troubleshooting

### Permission denied errors
```bash
# Make sure you're using sudo for LaTeX installation
sudo bash scripts/install-texlive.sh

# Fix npm permissions (if needed)
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER ~/overtex/frontend/node_modules
sudo chown -R $USER:$USER ~/overtex/server/node_modules
```

### Disk space issues
```bash
# Check available space
df -h

# Clean npm cache
npm cache clean --force

# Clean apt cache
sudo apt clean
sudo apt autoclean

# Use minimal LaTeX install instead of full
```

### Port already in use
```bash
# Find what's using port 3000 or 5173
sudo lsof -i :3000
sudo lsof -i :5173

# Kill the process
sudo kill -9 <PID>
```

---

## Next Steps

- **[Usage Guide](./usage.md)** - How to start and use OverTeX
- **[Configuration](./configuration.md)** - Customize settings
- **[Back to Installation](./installation.md)** - Other installation methods
