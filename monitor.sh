#!/bin/bash
# Monitoring Dashboard Script for Railway

echo "🚀 Workflow Monitoring Dashboard - Headless Mode"
echo "==============================================="

# Check if n8n is running
echo "🔍 Checking n8n service status..."
if pgrep -f "n8n" > /dev/null; then
    echo "✅ N8N service is running"
else
    echo "❌ N8N service may not be running"
fi

# Check recent logs for workflow execution
echo ""
echo "📋 Recent workflow executions (last 20 lines):"
echo "----------------------------------------------"
if [ -f /app/logs/workflow.log ]; then
    tail -n 20 /app/logs/workflow.log
else
    echo "ℹ️  No dedicated workflow log file found (normal in headless)"
fi

# Check Supabase for recent data
echo ""
echo "📊 Recent data in Supabase:"
echo "---------------------------"
echo "Last 5 video engagements:"
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
supabase.from('video_engagement').select('title, upload_time, views, likes').order('upload_time', { ascending: false }).limit(5)
.then(({ data, error }) => {
  if (error) console.log('Error:', error.message);
  else if (data && data.length > 0) {
    data.forEach(row => console.log('-', row.title.substring(0,30) + '...', 'Views:', row.views, 'Likes:', row.likes));
  } else {
    console.log('No recent video data');
  }
});
"

echo ""
echo "📈 Today's Summary:"
echo "------------------"
# Here we would run the full monitoring script
node workflow-monitor.js

echo ""
echo "🔧 To get detailed status, run: node workflow-monitor.js"
echo "📝 Check Railway logs for real-time execution details"
echo "📊 Check Supabase for data results"