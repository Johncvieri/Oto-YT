# Solution for Railway Deployment Monitoring Issues

## 1. Problem Analysis

### 1.1 Workflow Status Visibility
Currently, your n8n instance runs in headless mode with UI disabled, making it impossible to monitor workflow status, execution logs, and node connections.

### 1.2 Sleep/Wake Issues
Railway's free tier sleeps applications after inactivity, which can affect your scheduled cron jobs.

### 1.3 Limited Monitoring Capabilities
No real-time monitoring, logging, or health checks to verify system functionality post-deployment.

## 2. Comprehensive Solution

### 2.1 Enable n8n Dashboard Access (Recommended)

Update your `railway.json` configuration to enable the n8n UI:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "nixpacksConfig": {
      "phases": {
        "install": {
          "cmd": ["npm ci --no-audit --no-fund"]
        },
        "build": {
          "cmd": ["echo 'Build completed'"]
        }
      }
    },
    "cache": {
      "paths": ["node_modules"]
    }
  },
  "deploy": {
    "cmd": ["sh", "-c", "npm start"],
    "healthcheck": "/healthz",
    "sleepApplication": false
  },
  "env": {
    "NODE_ENV": {"value": "production", "type": "string"},
    "PORT": {"value": "8080", "type": "string"},
    "N8N_BASIC_AUTH_ACTIVE": {"value": "true", "type": "string"},  // Enable auth
    "N8N_SECURE_COOKIE": {"value": "true", "type": "string"},
    "N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS": {"value": "false", "type": "string"},
    "N8N_PERSONALIZATION_ENABLED": {"value": "false", "type": "string"},
    "N8N_HEALTH_CHECKER": {"value": "true", "type": "string"},
    "N8N_TRUST_PROXY": {"value": "1", "type": "string"},
    "N8N_DIAGNOSTICS_ENABLED": {"value": "true", "type": "string"},
    "N8N_PUBLIC_API_DISABLED": {"value": "false", "type": "string"},
    "N8N_VERSION_NOTIFICATIONS_ENABLED": {"value": "false", "type": "string"},
    "N8N_EXECUTIONS_MODE": {"value": "regular", "type": "string"},
    "N8N_ROOT_URL": {"value": "https://${RAILWAY_PUBLIC_HOST}", "type": "string"},
    "N8N_PROTOCOL": {"value": "https", "type": "string"},
    "N8N_PATH": {"value": "/", "type": "string"},
    "N8N_METADATA_DB_TABLE_NAMES": {"value": "true", "type": "string"},
    "N8N_DB_TYPE": {"value": "sqlite", "type": "string"},
    "DB_SQLITE_PATH": {"value": "./n8n-database.db", "type": "string"},
    "N8N_USER_MANAGEMENT_DISABLED": {"value": "false", "type": "string"},  // Enable user management
    "N8N_DISABLE_UI": {"value": "false", "type": "string"},  // Enable UI
    "N8N_HEADLESS": {"value": "false", "type": "string"},  // Disable headless mode
    "N8N_METRICS": {"value": "true", "type": "string"},
    "N8N_NPS_DISABLED": {"value": "true", "type": "string"},
    "N8N_TELEMETRY_DISABLED": {"value": "true", "type": "string"},
    "N8N_INTERNAL_HOOKS_DISABLED": {"value": "true", "type": "string"},
    "NIXPACKS_NODE_PRUNE": {"value": "true", "type": "string"},
    "NPM_CONFIG_PRODUCTION": {"value": "false", "type": "string"}
  },
  "variables": {
    "N8N_BASIC_AUTH_USER": {"required": true},
    "N8N_BASIC_AUTH_PASSWORD": {"required": true},
    "GEMINI_API_KEY": {"required": true},
    "SUPABASE_URL": {"required": true},
    "SUPABASE_ANON_KEY": {"required": true},
    "SUPABASE_SERVICE_ROLE_KEY": {"required": true},
    "YOUTUBE_API_1": {"required": true},
    "YOUTUBE_CHANNEL_1": {"required": true},
    "YOUTUBE_API_2": {"required": true},
    "YOUTUBE_CHANNEL_2": {"required": true},
    "YOUTUBE_API_3": {"required": true},
    "YOUTUBE_CHANNEL_3": {"required": true},
    "TELEGRAM_API_KEY": {"required": true},
    "TELEGRAM_CHAT_ID": {"required": true}
  }
}
```

### 2.2 Create Enhanced Health Check Endpoint

Create a new file `health-check.js`:

```javascript
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
```

### 2.3 Update index.js to Include Monitoring

Modify your `index.js` to add monitoring capabilities:

```javascript
/**
 * YouTube Automation System with Enhanced Monitoring - Main Entry Point
 */

// Enable monitoring before importing other modules
process.env.N8N_USER_MANAGEMENT_DISABLED = 'false';  // Enable for better monitoring
process.env.N8N_DISABLE_UI = 'false';               // Enable UI for access
process.env.N8N_HEADLESS = 'false';                 // Enable for dashboard access
process.env.N8N_METRICS = 'true';
process.env.N8N_DIAGNOSTICS_ENABLED = 'true';

// Load environment early
require('dotenv').config();

// Additional monitoring setup
process.env.N8N_HEALTH_CHECKER = 'true';
process.env.N8N_TELEMETRY_ENABLED = 'false';  // Disable for privacy
process.env.N8N_INTERNAL_HOOKS_DISABLED = 'false';  // Enable for monitoring
process.env.N8N_EXECUTIONS_DATA_SAVE_PER_WORKFLOW = 'true';
process.env.N8N_EXECUTIONS_DATA_PRUNE = 'false';  // Keep execution data for monitoring

// Set n8n to run with dashboard enabled
process.env.N8N_BASIC_AUTH_ACTIVE = process.env.N8N_BASIC_AUTH_ACTIVE || 'true';
process.env.N8N_SECURE_COOKIE = process.env.N8N_SECURE_COOKIE || 'true';
process.env.N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS = 'false';
process.env.N8N_PERSONALIZATION_ENABLED = 'false';

// Proxy configuration for Railway
process.env.N8N_TRUST_PROXY = '1';
process.env.N8N_ROOT_URL = `https://${process.env.RAILWAY_PUBLIC_HOST}`;
process.env.N8N_PROTOCOL = 'https';
process.env.N8N_PATH = '/';

// Database configuration
process.env.N8N_DB_TYPE = 'sqlite';
process.env.DB_SQLITE_PATH = './n8n-database.db';
process.env.N8N_EXECUTIONS_MODE = 'regular';

// Load required modules after setting environment
const path = require('path');
const { spawn } = require('child_process');

// --- Constants Definitions ---
const DEFAULT_PORT = process.env.PORT || 5678;
const REQUIRED_ENV_VARS = [
  'GEMINI_API_KEY', 
  'SUPABASE_URL', 
  'SUPABASE_ANON_KEY',
  'YOUTUBE_API_1',
  'YOUTUBE_CHANNEL_1'
];

const N8N_DEFAULTS = {
  HOST: '0.0.0.0',
  BASIC_AUTH_ACTIVE: 'true',  // Changed to true for security
  SECURE_COOKIE: 'true',      // Changed to true for security
  ENFORCE_SETTINGS_FILE_PERMISSIONS: 'false',
  PERSONALIZATION_ENABLED: 'false',
  HEALTH_CHECKER: 'true',
  TRUST_PROXY: 'true'
};

// --- Environment Configuration ---
const port = parseInt(DEFAULT_PORT);

// Configure n8n environment variables
process.env.N8N_HOST = process.env.N8N_HOST || N8N_DEFAULTS.HOST;
process.env.N8N_PORT = port.toString();
process.env.N8N_BASIC_AUTH_ACTIVE = process.env.N8N_BASIC_AUTH_ACTIVE || N8N_DEFAULTS.BASIC_AUTH_ACTIVE;
process.env.N8N_SECURE_COOKIE = process.env.N8N_SECURE_COOKIE || N8N_DEFAULTS.SECURE_COOKIE;
process.env.N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS = process.env.N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS || N8N_DEFAULTS.ENFORCE_SETTINGS_FILE_PERMISSIONS;
process.env.N8N_PERSONALIZATION_ENABLED = process.env.N8N_PERSONALIZATION_ENABLED || N8N_DEFAULTS.PERSONALIZATION_ENABLED;
process.env.N8N_HEALTH_CHECKER = N8N_DEFAULTS.HEALTH_CHECKER;
process.env.N8N_TRUST_PROXY = process.env.N8N_TRUST_PROXY || N8N_DEFAULTS.TRUST_PROXY;

// Additional monitoring settings
process.env.N8N_DIAGNOSTICS_ENABLED = process.env.N8N_DIAGNOSTICS_ENABLED || 'true';
process.env.N8N_PUBLIC_API_DISABLED = process.env.N8N_PUBLIC_API_DISABLED || 'false';
process.env.N8N_VERSION_NOTIFICATIONS_ENABLED = process.env.N8N_VERSION_NOTIFICATIONS_ENABLED || 'true';
process.env.N8N_EXECUTIONS_MODE = process.env.N8N_EXECUTIONS_MODE || 'regular';
process.env.N8N_PROTOCOL = process.env.N8N_PROTOCOL || 'https';
process.env.N8N_PATH = process.env.N8N_PATH || '/';
process.env.N8N_METADATA_DB_TABLE_NAMES = process.env.N8N_METADATA_DB_TABLE_NAMES || 'true';
process.env.N8N_DB_TYPE = 'sqlite';
process.env.DB_SQLITE_PATH = './n8n-database.db';
process.env.N8N_WORKFLOW_TAGS_DISABLED = 'false';

// --- Environment Validation ---
const validateEnvironment = () => {
  const missingEnvVars = REQUIRED_ENV_VARS.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    console.warn('❌ Critical: The following environment variables are missing:');
    missingEnvVars.forEach(envVar => console.warn(`  - ${envVar}`));
    console.log('Please set these in your Railway environment variables.');
    console.log('');
  } else {
    console.log('✅ All critical environment variables are configured');
  }
};

// --- Enhanced Application Start ---
const startApplication = async () => {
  console.log('🚀 YouTube Automation System with Enhanced Monitoring');
  console.log('====================================================');
  console.log('Starting n8n with monitoring enabled:');
  console.log(`  - Host: ${process.env.N8N_HOST}`);
  console.log(`  - Port: ${process.env.N8N_PORT}`);
  console.log(`  - Basic Auth: ${process.env.N8N_BASIC_AUTH_ACTIVE}`);
  console.log(`  - Health Checker: ${process.env.N8N_HEALTH_CHECKER}`);
  console.log(`  - Trust Proxy: ${process.env.N8N_TRUST_PROXY}`);
  console.log(`  - Webhook URL: ${process.env.WEBHOOK_URL || `https://${process.env.RAILWAY_PUBLIC_HOST}`}`);
  console.log('');

  // Set trust proxy early
  process.env.N8N_TRUST_PROXY = 'true';
  process.env.N8N_ROOT_URL = `https://${process.env.RAILWAY_PUBLIC_HOST}`;
  process.env.N8N_PROXY_HOST = process.env.RAILWAY_PUBLIC_HOST;
  process.env.N8N_PROXY_PORT = process.env.PORT || '443';
  process.env.N8N_PROXY_SSL = 'true';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  // Set the trust proxy in the spawn environment explicitly
  const envWithProxy = {
    ...process.env,
    N8N_TRUST_PROXY: 'true',
    N8N_ROOT_URL: `https://${process.env.RAILWAY_PUBLIC_HOST}`,
    N8N_PROXY_SSL: 'true'
  };

  // Start n8n as a child process
  const n8nProcess = spawn('n8n', ['start'], {
    env: envWithProxy,
    stdio: ['pipe', 'pipe', 'pipe'] // Use pipe for better control
  });

  // Capture n8n output
  n8nProcess.stdout.on('data', (data) => {
    console.log(`[n8n] ${data.toString()}`);
  });

  n8nProcess.stderr.on('data', (data) => {
    console.error(`[n8n-error] ${data.toString()}`);
  });

  n8nProcess.on('error', (err) => {
    console.error('❌ Failed to start n8n:', err.message);
    console.error('Make sure n8n is properly installed as a dependency.');
  });

  n8nProcess.on('close', (code) => {
    console.log(`⚠️ n8n process exited with code ${code}`);
    
    // Restart n8n if it crashes (basic supervisor behavior)
    if (code !== 0) {
      console.log('🔄 Attempting to restart n8n...');
      setTimeout(() => {
        startApplication();
      }, 5000); // Restart after 5 seconds
    } else {
      console.log('✅ n8n process completed successfully');
    }
  });

  console.log('✅ n8n process started with monitoring. Dashboard available at:', `https://${process.env.RAILWAY_PUBLIC_HOST}`);
  
  // Log the dashboard URL after a delay to let n8n start
  setTimeout(() => {
    console.log('');
    console.log('📋 Access Information:');
    console.log(`   Dashboard: https://${process.env.RAILWAY_PUBLIC_HOST}`);
    console.log(`   Health Check: https://${process.env.RAILWAY_PUBLIC_HOST}/healthz`);
    console.log(`   Workflow Status: https://${process.env.RAILWAY_PUBLIC_HOST}/workflow-status`);
    console.log('');
    console.log('💡 Login credentials: Use the N8N_BASIC_AUTH_USER and N8N_BASIC_AUTH_PASSWORD variables');
  }, 10000);

  return n8nProcess;
};

// --- Main Execution ---
validateEnvironment();

// When this script is executed directly, start the application
if (require.main === module) {
  startApplication().catch(error => {
    console.error('❌ Critical error starting application:', error);
    process.exit(1);
  });
}

module.exports = {
  validateEnvironment,
  startApplication,
  port
};
```

### 2.4 Create Workflow Monitoring Script

Create `workflow-monitoring.js`:

```javascript
/**
 * Advanced Workflow Monitoring for YouTube Automation System
 * 
 * This script provides real-time monitoring of workflow status,
 * execution tracking, and health reporting.
 */

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

class WorkflowMonitor {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    this.n8nUrl = `https://${process.env.RAILWAY_PUBLIC_HOST}`;
    this.n8nAuth = {
      username: process.env.N8N_BASIC_AUTH_USER,
      password: process.env.N8N_BASIC_AUTH_PASSWORD
    };
    this.monitorInterval = 300000; // 5 minutes
    this.intervals = {};
  }

  /**
   * Check n8n workflow executions
   */
  async checkWorkflowExecutions() {
    try {
      const response = await axios.get(`${this.n8nUrl}/rest/executions`, {
        auth: this.n8nAuth,
        timeout: 10000
      });

      if (response.data && response.data.data) {
        return {
          success: true,
          count: response.data.data.length,
          executions: response.data.data.slice(0, 10) // Last 10 executions
        };
      } else {
        return {
          success: false,
          error: 'No data returned from n8n API'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `n8n API error: ${error.message}`
      };
    }
  }

  /**
   * Check workflow definitions
   */
  async checkWorkflowDefinitions() {
    try {
      const response = await axios.get(`${this.n8nUrl}/rest/workflows`, {
        auth: this.n8nAuth,
        timeout: 10000
      });

      if (response.data && response.data.data) {
        return {
          success: true,
          count: response.data.data.length,
          workflows: response.data.data
        };
      } else {
        return {
          success: false,
          error: 'No workflow data returned'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Workflow definitions error: ${error.message}`
      };
    }
  }

  /**
   * Get workflow status from database
   */
  async getWorkflowStatusFromDB() {
    try {
      // Check if workflow_monitoring table exists and query it
      const { data, error } = await this.supabase
        .from('workflow_monitoring')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        // If table doesn't exist, create it or return message
        if (error.code === '42P01') { // undefined table
          return {
            exists: false,
            message: 'workflow_monitoring table does not exist'
          };
        }
        throw error;
      }

      return {
        exists: true,
        success: true,
        records: data,
        count: data.length
      };
    } catch (error) {
      return {
        success: false,
        error: `Database error: ${error.message}`
      };
    }
  }

  /**
   * Check system health
   */
  async checkSystemHealth() {
    try {
      const healthResponse = await axios.get(`${this.n8nUrl}/healthz`, {
        timeout: 10000
      });

      return {
        success: true,
        health: healthResponse.data
      };
    } catch (error) {
      return {
        success: false,
        error: `Health check error: ${error.message}`
      };
    }
  }

  /**
   * Generate comprehensive status report
   */
  async generateStatusReport() {
    console.log('🔍 Generating comprehensive status report...');
    
    const [
      executions,
      definitions,
      dbStatus,
      health
    ] = await Promise.all([
      this.checkWorkflowExecutions(),
      this.checkWorkflowDefinitions(),
      this.getWorkflowStatusFromDB(),
      this.checkSystemHealth()
    ]);

    const report = {
      timestamp: new Date().toISOString(),
      n8n: {
        executions,
        definitions,
        health
      },
      database: dbStatus,
      summary: {
        n8n_status: health.success ? health.health.overall : 'unavailable',
        workflow_count: definitions.success ? definitions.count : 0,
        recent_executions: executions.success ? executions.count : 0,
        db_monitoring: dbStatus.exists
      }
    };

    console.log('📊 Status Report Generated:');
    console.log(`   Overall Status: ${report.summary.n8n_status}`);
    console.log(`   Workflows Configured: ${report.summary.workflow_count}`);
    console.log(`   Recent Executions: ${report.summary.recent_executions}`);
    console.log(`   DB Monitoring: ${report.summary.db_monitoring ? 'Enabled' : 'Disabled'}`);
    
    return report;
  }

  /**
   * Continuous monitoring
   */
  startMonitoring() {
    console.log('🔄 Starting continuous workflow monitoring...');
    
    // Initial status check
    this.generateStatusReport();
    
    // Set up periodic monitoring
    this.intervals.statusCheck = setInterval(() => {
      this.generateStatusReport().catch(error => {
        console.error('❌ Error in monitoring cycle:', error);
      });
    }, this.monitorInterval);

    // Monitor for shutdown signals
    process.on('SIGTERM', () => {
      this.stopMonitoring();
    });

    process.on('SIGINT', () => {
      this.stopMonitoring();
    });
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    console.log('🛑 Stopping workflow monitoring...');
    
    Object.keys(this.intervals).forEach(key => {
      if (this.intervals[key]) {
        clearInterval(this.intervals[key]);
      }
    });
    
    console.log('✅ Monitoring stopped');
  }
}

// Initialize and start monitoring if run directly
if (require.main === module) {
  // Check if required environment variables are available
  if (!process.env.N8N_BASIC_AUTH_USER || !process.env.N8N_BASIC_AUTH_PASSWORD) {
    console.error('❌ Missing required environment variables for n8n authentication');
    console.error('   Please set N8N_BASIC_AUTH_USER and N8N_BASIC_AUTH_PASSWORD');
    process.exit(1);
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required Supabase environment variables');
    process.exit(1);
  }

  const monitor = new WorkflowMonitor();
  monitor.startMonitoring();
}

module.exports = WorkflowMonitor;
```

### 2.5 Update Package JSON with Monitoring Scripts

Update your `package.json` to include monitoring scripts:

```json
{
  "name": "youtube-automation",
  "version": "1.0.0",
  "description": "YouTube Shorts automation system with enhanced monitoring capabilities",
  "main": "index.js",
  "scripts": {
    "test": "node test.js",
    "test:prod": "NODE_ENV=production node test.js",
    "start": "node index.js",
    "start:with-workflows": "node import-workflows.js && node index.js",
    "dev": "node index.js",
    "n8n": "n8n start",
    "import-workflows": "node import-workflows.js",
    "seed-supabase": "node seed-supabase.js",
    "verify-env": "node verify-env.js",
    "health": "node test.js",
    "monitor": "node workflow-monitoring.js",
    "monitor:continuous": "node workflow-monitoring.js",
    "status": "node -e \"fetch('http://localhost:' + (process.env.PORT || 5678) + '/healthz').then(r => r.json()).then(console.log).catch(console.error);\"",
    "github:setup": "node github-setup.js",
    "setup-complete": "node verify-env.js && node seed-supabase.js && node import-workflows.js && node index.js"
  },
  "dependencies": {
    "@google/generative-ai": "^0.21.0",
    "@supabase/supabase-js": "^2.75.1",
    "ajv": "^8.12.0",
    "axios": "^1.6.0",
    "dotenv": "^16.6.1",
    "express": "^4.18.2",
    "fast-xml-parser": "^4.2.5",
    "ffmpeg-static": "^5.2.0",
    "fluent-ffmpeg": "^2.1.3",
    "google-tts-api": "^2.0.2",
    "node-fetch": "^3.3.2",
    "n8n": "^1.115.3"
  },
  "engines": {
    "node": ">=16.0.0"
  },
  "keywords": [
    "youtube",
    "automation",
    "n8n",
    "video",
    "content",
    "ai",
    "supabase",
    "github",
    "gemini",
    "monitoring"
  ]
}
```

### 2.6 Create Railway Startup Script

Create `start-monitoring.js`:

```javascript
/**
 * Enhanced Startup and Monitoring Script for Railway Deployment
 * 
 * This script handles proper startup with monitoring and prevents sleep issues
 */

const { spawn } = require('child_process');
const http = require('http');

// Prevent Railway from sleeping by making periodic requests to the app
function preventSleep(url) {
  setInterval(() => {
    http.get(url, (res) => {
      res.on('data', () => {}); // Consume response data
      res.on('end', () => {
        console.log(`✅ Pinged ${url} - Status: ${res.statusCode}`);
      });
    }).on('error', (err) => {
      console.log(`❌ Ping error to ${url}: ${err.message}`);
    });
  }, 4 * 60 * 1000); // Ping every 4 minutes to prevent 5-min sleep
}

// Start the main application
async function startApplication() {
  console.log('🚀 Starting YouTube Automation System with Monitoring...');
  
  // Start the main app
  const appProcess = spawn('node', ['index.js'], {
    stdio: 'inherit',
    env: { ...process.env }
  });

  appProcess.on('error', (err) => {
    console.error('❌ Application failed to start:', err);
  });

  appProcess.on('close', (code) => {
    console.log(`⚠️ Application exited with code ${code}`);
    if (code !== 0) {
      console.log('🔄 Restarting application...');
      setTimeout(() => startApplication(), 5000);
    }
  });

  // Start workflow monitoring after a delay
  setTimeout(() => {
    const monitorProcess = spawn('node', ['workflow-monitoring.js'], {
      stdio: 'inherit',
      env: { ...process.env }
    });

    monitorProcess.on('error', (err) => {
      console.error('❌ Monitor failed to start:', err);
    });

    monitorProcess.on('close', (code) => {
      console.log(`⚠️ Monitor exited with code ${code}`);
      if (code !== 0) {
        console.log('🔄 Restarting monitor...');
        setTimeout(() => {
          // Restart monitor after delay
        }, 30000);
      }
    });
  }, 30000); // Start monitoring after main app initializes

  // Set up sleep prevention if on Railway
  if (process.env.RAILWAY_PUBLIC_HOST) {
    const appUrl = `https://${process.env.RAILWAY_PUBLIC_HOST}`;
    preventSleep(appUrl);
    console.log(`🔔 Sleep prevention active: Pinging ${appUrl} every 4 minutes`);
  }
}

// Start the application
startApplication().catch(error => {
  console.error('❌ Critical error:', error);
  process.exit(1);
});
```

### 2.7 Update Railway Configuration

Update your `railway.json` to ensure the app doesn't sleep:

```json
{
  "build": {
    "builder": "NIXPACKS",
    "nixpacksConfig": {
      "phases": {
        "install": {
          "cmd": ["npm ci --no-audit --no-fund"]
        },
        "build": {
          "cmd": ["echo 'Build completed'"]
        }
      }
    },
    "cache": {
      "paths": ["node_modules"]
    }
  },
  "deploy": {
    "cmd": ["sh", "-c", "node start-monitoring.js"],
    "healthcheck": "/healthz",
    "sleepApplication": false  // This prevents sleeping
  },
  "env": {
    "NODE_ENV": {"value": "production", "type": "string"},
    "PORT": {"value": "8080", "type": "string"},
    "N8N_BASIC_AUTH_ACTIVE": {"value": "true", "type": "string"},
    "N8N_SECURE_COOKIE": {"value": "true", "type": "string"},
    "N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS": {"value": "false", "type": "string"},
    "N8N_PERSONALIZATION_ENABLED": {"value": "false", "type": "string"},
    "N8N_HEALTH_CHECKER": {"value": "true", "type": "string"},
    "N8N_TRUST_PROXY": {"value": "1", "type": "string"},
    "N8N_DIAGNOSTICS_ENABLED": {"value": "true", "type": "string"},
    "N8N_PUBLIC_API_DISABLED": {"value": "false", "type": "string"},
    "N8N_VERSION_NOTIFICATIONS_ENABLED": {"value": "false", "type": "string"},
    "N8N_EXECUTIONS_MODE": {"value": "regular", "type": "string"},
    "N8N_ROOT_URL": {"value": "https://${RAILWAY_PUBLIC_HOST}", "type": "string"},
    "N8N_PROTOCOL": {"value": "https", "type": "string"},
    "N8N_PATH": {"value": "/", "type": "string"},
    "N8N_METADATA_DB_TABLE_NAMES": {"value": "true", "type": "string"},
    "N8N_DB_TYPE": {"value": "sqlite", "type": "string"},
    "DB_SQLITE_PATH": {"value": "./n8n-database.db", "type": "string"},
    "N8N_USER_MANAGEMENT_DISABLED": {"value": "false", "type": "string"},
    "N8N_DISABLE_UI": {"value": "false", "type": "string"},
    "N8N_HEADLESS": {"value": "false", "type": "string"},
    "N8N_METRICS": {"value": "true", "type": "string"},
    "N8N_NPS_DISABLED": {"value": "true", "type": "string"},
    "N8N_TELEMETRY_DISABLED": {"value": "true", "type": "string"},
    "N8N_INTERNAL_HOOKS_DISABLED": {"value": "false", "type": "string"},
    "NIXPACKS_NODE_PRUNE": {"value": "true", "type": "string"},
    "NPM_CONFIG_PRODUCTION": {"value": "false", "type": "string"}
  },
  "variables": {
    "N8N_BASIC_AUTH_USER": {"required": true},
    "N8N_BASIC_AUTH_PASSWORD": {"required": true},
    "GEMINI_API_KEY": {"required": true},
    "SUPABASE_URL": {"required": true},
    "SUPABASE_ANON_KEY": {"required": true},
    "SUPABASE_SERVICE_ROLE_KEY": {"required": true},
    "YOUTUBE_API_1": {"required": true},
    "YOUTUBE_CHANNEL_1": {"required": true},
    "YOUTUBE_API_2": {"required": true},
    "YOUTUBE_CHANNEL_2": {"required": true},
    "YOUTUBE_API_3": {"required": true},
    "YOUTUBE_CHANNEL_3": {"required": true},
    "TELEGRAM_API_KEY": {"required": true},
    "TELEGRAM_CHAT_ID": {"required": true}
  }
}
```

## 3. Implementation Steps

### 3.1 Update Your Railway Configuration

1. Update your Railway project with the new configuration
2. Add the required environment variables:
   - `N8N_BASIC_AUTH_USER`
   - `N8N_BASIC_AUTH_PASSWORD`

### 3.2 Access Points for Monitoring

After deployment, you'll have these access points:

1. **n8n Dashboard**: `https://[your-app].railway.app` (use your auth credentials)
2. **Health Check**: `https://[your-app].railway.app/healthz`
3. **Workflow Status**: `https://[your-app].railway.app/workflow-status`
4. **n8n Status**: `https://[your-app].railway.app/n8n-status`

### 3.3 Monitoring Commands

- Run `npm run monitor` to start workflow monitoring
- Use the health check endpoints to verify system status
- Check the Railway logs for monitoring output

## 4. Additional Recommendations

### 4.1 Set Up Monitoring Dashboard
- Access the n8n UI to visualize your workflows
- Check execution history and current status
- Monitor for failed executions

### 4.2 Regular Checks
- Set up a monitoring tool to periodically check `/healthz`
- Review logs in Railway dashboard
- Check Supabase for data updates

### 4.3 Troubleshooting
- If workflows aren't running: Check cron schedules and timezone
- If sleeping occurs: Verify `sleepApplication: false` in config
- If UI is not accessible: Check auth settings and credentials

This comprehensive solution will provide you with full visibility into your YouTube Automation System's status, prevent sleep issues on Railway, and ensure all components are functioning properly.