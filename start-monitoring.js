/**
 * Enhanced Startup and Monitoring Script with Unified Configuration
 * 
 * This script loads unified configuration and handles monitoring
 * CRITICAL: Ensures consistent settings across the application
 */

// Apply unified configuration first
require('./unified-config');

// Additional monitoring settings that should be applied after unified config
process.env.N8N_METRICS = 'true';
process.env.N8N_DIAGNOSTICS_ENABLED = 'true';
process.env.N8N_EXECUTIONS_DATA_SAVE_PER_WORKFLOW = 'true';
process.env.N8N_EXECUTIONS_DATA_PRUNE = 'false';  // Keep execution data for monitoring

console.log('🔧 Loading monitoring configuration...');
console.log(`   N8N_TRUST_PROXY: ${process.env.N8N_TRUST_PROXY} (CRITICAL!)`);
console.log(`   N8N_ROOT_URL: ${process.env.N8N_ROOT_URL}`);
console.log(`   EXECUTIONS_PROCESS: ${process.env.EXECUTIONS_PROCESS} (as per your .env)`);
console.log(`   N8N_RUNNERS_ENABLED: ${process.env.N8N_RUNNERS_ENABLED} (as per your .env)`);

const { spawn } = require('child_process');
const http = require('http');

// Function to determine the correct app URL
function getAppUrl() {
  // Try different possible environment variables for the app URL
  if (process.env.RAILWAY_PUBLIC_HOST) {
    return `https://${process.env.RAILWAY_PUBLIC_HOST}`;
  } else if (process.env.HEROKU_APP_NAME) {
    return `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`;
  } else if (process.env.WEBHOOK_URL) {
    return process.env.WEBHOOK_URL;
  } else if (process.env.PORT) {
    return `http://localhost:${process.env.PORT}`;
  } else {
    // Fallback to default port
    return `http://localhost:8080`;
  }
}

// Prevent Railway from sleeping by making periodic requests to the app
function preventSleep(url) {
  console.log(`🔔 Setting up sleep prevention for: ${url}`);
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
  console.log('🚀 Starting YouTube Automation System with Unified Configuration...');
  
  // Prepare environment with unified settings
  const env = { 
    ...process.env,
    // Ensure critical settings from unified config are maintained
    N8N_TRUST_PROXY: 'true',           // Critical for Railway's load balancer
    N8N_PROXY_HOST: process.env.RAILWAY_PUBLIC_HOST || '0.0.0.0',
    N8N_PROXY_PORT: process.env.PORT || '443',
    N8N_PROXY_SSL: 'true',
    N8N_USER_MANAGEMENT_ENABLED: 'true',  // Ensure user management is enabled
    NODE_TLS_REJECT_UNAUTHORIZED: '0', // Required for proxy handling
    // Ensure the correct URL is available to child processes
    RAILWAY_PUBLIC_HOST: process.env.RAILWAY_PUBLIC_HOST || process.env.HEROKU_APP_NAME
  };

  console.log('🔧 Application environment configured with unified settings');
  console.log(`   N8N_TRUST_PROXY: ${env.N8N_TRUST_PROXY} (CRITICAL)`);
  console.log(`   N8N_ROOT_URL: ${env.N8N_ROOT_URL}`);
  console.log(`   N8N_BASIC_AUTH_ACTIVE: ${env.N8N_BASIC_AUTH_ACTIVE} (UNIFIED)`);
  console.log(`   N8N_USER_MANAGEMENT_ENABLED: ${env.N8N_USER_MANAGEMENT_ENABLED} (UNIFIED)`);
  console.log(`   N8N_DISABLE_UI: ${env.N8N_DISABLE_UI} (UNIFIED)`);
  console.log(`   N8N_HEADLESS: ${env.N8N_HEADLESS} (UNIFIED)`);
  console.log(`   EXECUTIONS_PROCESS: ${env.EXECUTIONS_PROCESS} (UNIFIED)`);
  console.log(`   N8N_RUNNERS_ENABLED: ${env.N8N_RUNNERS_ENABLED} (UNIFIED)`);

  // Start n8n using the direct approach with unified settings
  const appProcess = spawn('node', ['railway-direct-start.js'], {
    stdio: 'pipe',  // Use pipe to capture output
    env: env
  });

  // Capture output from the main app
  appProcess.stdout.on('data', (data) => {
    console.log(`[n8n] ${data.toString()}`);
  });

  appProcess.stderr.on('data', (data) => {
    const errorOutput = data.toString();
    console.error(`[n8n-error] ${errorOutput}`);
    
    // Log when proxy errors occur
    if (errorOutput.includes('X-Forwarded-For') || errorOutput.includes('ERR_ERL_UNEXPECTED_X_FORWARDED_FOR')) {
      console.log('❌ PROXY ERROR: This should not happen with unified config!');
      console.log('💡 Check unified-config.js for proper proxy settings');
    }
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

  // Set up sleep prevention if on Railway
  const appUrl = getAppUrl();
  if (process.env.RAILWAY_PUBLIC_HOST) {
    preventSleep(appUrl);
    console.log(`🔔 Sleep prevention active: Pinging ${appUrl} every 4 minutes`);
  }
  
  // Start workflow monitoring after a delay (wait for n8n to be fully ready)
  setTimeout(() => {
    console.log('🔄 Starting workflow monitoring after 90 seconds (allowing n8n to fully initialize)...');
    const monitorEnv = { 
      ...env,
      // Pass the correct app URL to the monitoring process
      RAILWAY_PUBLIC_HOST: process.env.RAILWAY_PUBLIC_HOST || process.env.HEROKU_APP_NAME
    };
    
    const monitorProcess = spawn('node', ['workflow-monitoring.js'], {
      stdio: 'inherit',
      env: monitorEnv
    });

    monitorProcess.on('error', (err) => {
      console.error('❌ Monitor failed to start:', err);
    });

    monitorProcess.on('close', (code) => {
      console.log(`⚠️ Monitor exited with code ${code}`);
      if (code !== 0) {
        console.log('🔄 Attempting to restart monitor...');
        setTimeout(() => {
          // Restart monitor after delay
          console.log('Restarting monitoring process...');
          startMonitoring();
        }, 60000); // Increased delay to 60 seconds
      }
    });
    
    // Function to restart monitoring
    function startMonitoring() {
      const restartMonitorProcess = spawn('node', ['workflow-monitoring.js'], {
        stdio: 'inherit',
        env: monitorEnv
      });
      
      restartMonitorProcess.on('error', (err) => {
        console.error('❌ Restarted monitor failed to start:', err);
      });
    }
  }, 90000); // Increased to 90 seconds to ensure n8n is completely ready

  return appProcess;
}

// Start the application
startApplication().catch(error => {
  console.error('❌ Critical error:', error);
  process.exit(1);
});