#!/bin/bash
# Headless Startup script for YouTube Automation System

echo "🚀 Starting YouTube Automation System (Headless Mode)..."

# Set environment variables for headless operation
export N8N_DISABLE_UI=true
export N8N_HEADLESS=true
export N8N_USER_MANAGEMENT_DISABLED=true
export N8N_METRICS=false
export N8N_NPS_DISABLED=true
export N8N_TELEMETRY_DISABLED=true
export N8N_TRUST_PROXY=1

echo "🔐 Headless environment configured"

# Start n8n in headless mode (no workflow import needed)
echo "🎬 Starting n8n in headless mode..."
exec npm start