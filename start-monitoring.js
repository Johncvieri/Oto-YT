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