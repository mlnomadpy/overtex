#!/bin/bash
# Install TeX Live on Render
set -e

echo "Installing TeX Live..."

# Update package list
apt-get update

# Install TeX Live
apt-get install -y \
  texlive \
  texlive-latex-extra \
  texlive-fonts-recommended \
  texlive-fonts-extra \
  texlive-luatex \
  texlive-xetex \
  latexmk

echo "TeX Live installation complete!"
latexmk --version
