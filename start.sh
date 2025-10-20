#!/bin/bash
# Unified Startup script for YouTube Automation System

echo "🚀 Starting YouTube Automation System (With UI)..."

# Set minimal critical environment variables
export N8N_TRUST_PROXY=1  # Critical for Railway proxy handling

echo "🔐 Essential environment variables configured"

# Start n8n with unified configuration
echo "🎬 Starting n8n with unified configuration..."
exec npm start