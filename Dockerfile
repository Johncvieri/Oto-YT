# Multi-stage Dockerfile for YouTube Automation System

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:20-alpine

# Install system dependencies for video processing
RUN apk add --no-cache \
    ffmpeg \
    python3 \
    make \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Create n8n user for security
RUN addgroup -g 1001 -S n8n &&\
    adduser -u 1001 -S n8n -G n8n

WORKDIR /app

# Copy production dependencies
COPY --from=builder /app/node_modules ./node_modules

# Install n8n directly without global installation to avoid CLI issues
RUN npm install -g n8n@latest

# Set up PATH
ENV PATH="/usr/local/bin:/usr/local/lib/node_modules/.bin:${PATH}"

COPY . .

# Create required directories
RUN mkdir -p assets temp upload && \
    mkdir -p /home/n8n/.n8n && \
    chown -R n8n:n8n /home/n8n && \
    chown -R n8n:n8n /app/assets /app/temp /app/upload

# Switch to non-root user
USER n8n

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD npm run health

# Default command
CMD ["npm", "run", "start"]