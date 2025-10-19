#!/bin/bash
# Startup script for YouTube Automation System with n8n

set -e  # Exit on any error

echo "🚀 Starting YouTube Automation System..."

# Ensure ALL proxy-related environment variables are set before anything else
export N8N_TRUST_PROXY=true
export N8N_PROTOCOL=https
export N8N_ROOT_URL="https://${RAILWAY_PUBLIC_HOST}"
export NODE_TLS_REJECT_UNAUTHORIZED=0
export TRUST_PROXY=1
export N8N_PROXY_SSL=true
export N8N_METRICS=false
export N8N_NPS_DISABLED=true
export N8N_TELEMETRY_DISABLED=true
export N8N_USER_MANAGEMENT_DISABLED=true

echo "🔐 Trust proxy and all related configurations set"

# Import workflows first
echo "🔄 Importing n8n workflows..."
node import-workflows.js

if [ $? -eq 0 ]; then
    echo "✅ Workflows imported successfully"
else
    echo "⚠️  Workflow import failed, but continuing startup..."
    # Don't exit - let n8n start anyway so dashboard is at least accessible
fi

# Start the main application with explicit proxy configuration
echo "🎬 Starting n8n application with proxy configuration..."
node bootstrap.js