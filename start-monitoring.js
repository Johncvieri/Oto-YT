/**
 * Enhanced Startup and Monitoring Script for Railway Deployment
 * 
 * This script handles proper startup with monitoring and prevents sleep issues
 */

const { spawn } = require('child_process');
const http = require('http');

// Function to determine the correct app URL
function getAppUrl() {
  // Try different possible environment variables for the app URL
  if (process.env.RAILWAY_PUBLIC_HOST) {
    return `https://${process.env.RAILWAY_PUBLIC_HOST}`;
  } else if (process.env.HEROKU_APP_NAME) {
    return `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`;
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
  console.log('🚀 Starting YouTube Automation System with Monitoring...');
  
  // Prepare environment with all necessary variables
  const env = { 
    ...process.env,
    // Ensure the correct URL is available to child processes
    RAILWAY_PUBLIC_HOST: process.env.RAILWAY_PUBLIC_HOST || process.env.HEROKU_APP_NAME
  };

  // Start the main app
  const appProcess = spawn('node', ['index.js'], {
    stdio: 'pipe',  // Use pipe to capture output
    env: env
  });

  // Capture output from the main app
  appProcess.stdout.on('data', (data) => {
    console.log(`[n8n] ${data.toString()}`);
  });

  appProcess.stderr.on('data', (data) => {
    console.error(`[n8n-error] ${data.toString()}`);
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
    console.log('🔄 Starting workflow monitoring after 60 seconds (allowing n8n to fully initialize)...');
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
        }, 30000);
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
  }, 60000); // Start monitoring after 60 seconds (allow n8n to fully initialize)

  return appProcess;
}

// Start the application
startApplication().catch(error => {
  console.error('❌ Critical error:', error);
  process.exit(1);
});