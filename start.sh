#!/bin/bash
# Startup script for YouTube Automation System with n8n

set -e  # Exit on any error

echo "🚀 Starting YouTube Automation System..."

# Pre-configure critical environment variables
export N8N_TRUST_PROXY=true
export N8N_USER_MANAGEMENT_DISABLED=true
export N8N_METRICS=false
export N8N_NPS_DISABLED=true
export N8N_TELEMETRY_DISABLED=true
export N8N_PROTOCOL=https

echo "🔐 Critical configurations set"

# Import workflows first
echo "🔄 Importing n8n workflows..."
node import-workflows.js || echo "⚠️ Workflow import may have failed, but continuing..."

# Start the main application
echo "🎬 Starting n8n application..."
npm start