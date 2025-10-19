#!/bin/bash
# Startup script for YouTube Automation System with n8n

set -e  # Exit on any error

echo "🚀 Starting YouTube Automation System..."

# Ensure trust proxy is set before anything else
export N8N_TRUST_PROXY=true
export N8N_PROTOCOL=https
export N8N_ROOT_URL="https://${RAILWAY_PUBLIC_HOST}"

echo "🔐 Trust proxy configuration set"

# Import workflows first
echo "🔄 Importing n8n workflows..."
node import-workflows.js

if [ $? -eq 0 ]; then
    echo "✅ Workflows imported successfully"
else
    echo "⚠️  Workflow import failed, but continuing startup..."
fi

# Start the main application
echo "🎬 Starting n8n application..."
npm start