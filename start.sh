#!/bin/bash
# Startup script for YouTube Automation System with proper workflow handling

echo "🚀 Starting YouTube Automation System..."

# Set environment variables
export N8N_TRUST_PROXY=true
export N8N_USER_MANAGEMENT_DISABLED=false
export N8N_METRICS=false
export N8N_NPS_DISABLED=true
export N8N_TELEMETRY_DISABLED=true

echo "🔐 Environment variables set"

# Run workflow import first (this might not work perfectly but let's try)
echo "🔄 Attempting workflow import..."
node import-workflows.js || echo "⚠️ Workflow import may not work during startup (this is normal)"

# Start n8n
echo "🎬 Starting n8n application..."
exec npm start