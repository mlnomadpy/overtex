# Combined Dockerfile for OverTeX (Frontend + Backend)
# Use this for single-service deployment on Render

FROM node:20-slim AS base

# Install TeX Live and required packages
RUN apt-get update && apt-get install -y \
    texlive-latex-base \
    texlive-latex-extra \
    texlive-fonts-recommended \
    texlive-fonts-extra \
    latexmk \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY server/package*.json ./server/
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd server && npm ci --only=production
RUN cd frontend && npm ci

# Copy source code
COPY server ./server
COPY frontend ./frontend
COPY tex ./tex

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Build backend
WORKDIR /app/server
RUN npm run build

# Setup runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=10000

# Expose port
EXPOSE 10000

# Start application
CMD ["node", "server/dist/index.js"]
