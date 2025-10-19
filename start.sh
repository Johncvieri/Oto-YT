#!/bin/bash
# Startup script for YouTube Automation System with n8n

set -e  # Exit on any error

echo "🚀 Starting YouTube Automation System..."

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