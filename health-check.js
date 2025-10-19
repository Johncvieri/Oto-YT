/**
 * Enhanced Health Check for n8n-based YouTube Automation System
 */

const express = require('express');
const { spawn } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set up n8n environment
process.env.N8N_BASIC_AUTH_ACTIVE = 'false';  // Disable for health check
process.env.N8N_DISABLE_UI = 'false';         // Enable UI for access
process.env.N8N_HEADLESS = 'false';           // Disable headless

/**
 * Check if n8n is running and responsive
 */
async function checkN8nStatus() {
  try {
    // Try to make a request to n8n's API
    const response = await fetch(`http://localhost:${process.env.N8N_PORT || 5678}/rest/workflows`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      return {
        status: 'running',
        message: 'n8n is responding to API requests',
        timestamp: new Date().toISOString()
      };
    } else {
      return {
        status: 'api_error',
        message: `n8n API responded with status ${response.status}`,
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    return {
      status: 'not_running',
      message: `n8n is not responding: ${error.message}`,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Check if workflows are properly configured
 */
async function checkWorkflows() {
  const workflowFiles = [
    'youtube_automation_source.json',
    'youtube_automation_game.json', 
    'youtube_automation_trend.json'
  ];
  
  const results = [];
  
  for (const file of workflowFiles) {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, file);
      
      if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        results.push({
          name: file,
          exists: true,
          active: content.active || false,
          nodes: content.nodes ? content.nodes.length : 0,
          triggers: content.nodes ? content.nodes.filter(node => 
            node.type.includes('cron') || node.type.includes('trigger')
          ).length : 0
        });
      } else {
        results.push({
          name: file,
          exists: false,
          active: false,
          nodes: 0,
          triggers: 0
        });
      }
    } catch (error) {
      results.push({
        name: file,
        exists: false,
        active: false,
        nodes: 0,
        error: error.message
      });
    }
  }
  
  return results;
}

/**
 * Check Supabase connection
 */
async function checkSupabase() {
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    const { data, error } = await supabase
      .from('video_engagement')
      .select('count')
      .limit(1);
    
    if (error) {
      return {
        status: 'error',
        message: `Supabase connection error: ${error.message}`,
        connected: false
      };
    }
    
    return {
      status: 'success',
      message: 'Supabase connection successful',
      connected: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Supabase connection failed: ${error.message}`,
      connected: false
    };
  }
}

/**
 * Check system resources and status
 */
function checkSystemResources() {
  const os = require('os');
  const memory = process.memoryUsage();
  
  return {
    uptime: process.uptime(),
    memory: {
      rss: memory.rss,
      heapTotal: memory.heapTotal,
      heapUsed: memory.heapUsed,
      external: memory.external,
      arrayBuffers: memory.arrayBuffers
    },
    os: {
      platform: os.platform(),
      arch: os.arch(),
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      cpus: os.cpus().length
    },
    loadAverage: os.loadavg()
  };
}

// Health check endpoint
app.get('/healthz', async (req, res) => {
  try {
    const n8nStatus = await checkN8nStatus();
    const workflowStatus = await checkWorkflows();
    const supabaseStatus = await checkSupabase();
    const systemResources = checkSystemResources();
    
    const overallStatus = {
      timestamp: new Date().toISOString(),
      n8n: n8nStatus,
      workflows: workflowStatus,
      database: supabaseStatus,
      system: systemResources,
      overall: 'healthy'
    };
    
    // Determine overall status based on components
    if (n8nStatus.status !== 'running' || !supabaseStatus.connected) {
      overallStatus.overall = 'degraded';
    }
    
    // If any workflow doesn't exist, mark as critical
    if (workflowStatus.some(w => !w.exists)) {
      overallStatus.overall = 'critical';
    }
    
    res.status(overallStatus.overall === 'critical' ? 503 : 
               overallStatus.overall === 'degraded' ? 500 : 200)
       .json(overallStatus);
  } catch (error) {
    res.status(500).json({
      error: 'Health check failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Detailed workflow status endpoint
app.get('/workflow-status', async (req, res) => {
  try {
    const workflowStatus = await checkWorkflows();
    
    res.json({
      timestamp: new Date().toISOString(),
      workflows: workflowStatus,
      summary: {
        total: workflowStatus.length,
        active: workflowStatus.filter(w => w.active).length,
        missing: workflowStatus.filter(w => !w.exists).length,
        total_nodes: workflowStatus.reduce((sum, w) => sum + w.nodes, 0),
        total_triggers: workflowStatus.reduce((sum, w) => sum + w.triggers, 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Workflow status check failed',
      message: error.message
    });
  }
});

// n8n status endpoint
app.get('/n8n-status', async (req, res) => {
  try {
    const n8nStatus = await checkN8nStatus();
    res.json(n8nStatus);
  } catch (error) {
    res.status(500).json({
      error: 'n8n status check failed',
      message: error.message
    });
  }
});

// Start the health check server
const healthServer = app.listen(PORT, () => {
  console.log(`Health check server running on port ${PORT}`);
  console.log(`Access n8n dashboard at: https://${process.env.RAILWAY_PUBLIC_HOST}`);
  console.log(`Check system health at: https://${process.env.RAILWAY_PUBLIC_HOST}/healthz`);
});

module.exports = { app, checkN8nStatus, checkWorkflows, checkSupabase, checkSystemResources };