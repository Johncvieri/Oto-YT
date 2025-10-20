/**
 * YouTube Automation System - Main Entry Point with Railway Optimized Configuration
 * 
 * Following successful Railway deployment approach based on .env configuration
 */

// CRITICAL: Apply all Railway configurations before ANY other operations
// This addresses the fundamental X-Forwarded-For error
process.env.N8N_TRUST_PROXY = 'true';  // MOST CRITICAL SETTING FOR RAILWAY
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.N8N_PROXY_HOST = process.env.RAILWAY_PUBLIC_HOST || '0.0.0.0';
process.env.N8N_PROXY_PORT = '443';
process.env.N8N_PROXY_SSL = 'true';
process.env.N8N_ROOT_URL = process.env.WEBHOOK_URL || `https://${process.env.RAILWAY_PUBLIC_HOST || 'localhost:5678'}`;
process.env.N8N_PROTOCOL = 'https';

// Apply your specific configuration from .env
process.env.EXECUTIONS_PROCESS = process.env.EXECUTIONS_PROCESS || 'main';
process.env.N8N_RUNNERS_ENABLED = process.env.N8N_RUNNERS_ENABLED || 'true';
process.env.TZ = process.env.TZ || 'Asia/Jakarta';

// Additional monitoring and settings
process.env.N8N_USER_MANAGEMENT_DISABLED = 'false';  // Enable for better monitoring
process.env.N8N_DISABLE_UI = 'false';               // Enable UI for access
process.env.N8N_HEADLESS = 'false';                 // Enable for dashboard access
process.env.N8N_METRICS = 'true';
process.env.N8N_DIAGNOSTICS_ENABLED = 'true';

// Load environment early (this may override some settings if in .env)
require('dotenv').config();

// Ensure critical settings remain after dotenv load
process.env.N8N_TRUST_PROXY = 'true';  // RE-ENSURE this critical setting
process.env.N8N_PROTOCOL = 'https';    // RE-ENSURE HTTPS for Railway

// Additional monitoring setup
process.env.N8N_TELEMETRY_ENABLED = 'false';  // Disable for privacy
process.env.N8N_INTERNAL_HOOKS_DISABLED = 'false';  // Enable for monitoring
process.env.N8N_EXECUTIONS_DATA_SAVE_PER_WORKFLOW = 'true';
process.env.N8N_EXECUTIONS_DATA_PRUNE = 'false';  // Keep execution data for monitoring

console.log('🔧 Critical proxy configuration applied:');
console.log(`   N8N_TRUST_PROXY: ${process.env.N8N_TRUST_PROXY} (CRITICAL!)`);
console.log(`   N8N_ROOT_URL: ${process.env.N8N_ROOT_URL}`);

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

// --- Environment Configuration ---
const port = parseInt(DEFAULT_PORT);

// Ensure critical n8n environment variables are properly set
process.env.N8N_HOST = process.env.N8N_HOST || '0.0.0.0';
process.env.N8N_PORT = process.env.N8N_PORT || port.toString();
process.env.N8N_TRUST_PROXY = 'true'; // CRITICAL: Must be true for Railway
process.env.N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS = 'false';
process.env.N8N_PERSONALIZATION_ENABLED = 'false';
process.env.N8N_HEALTH_CHECKER = 'true';
process.env.N8N_DIAGNOSTICS_ENABLED = 'true';
process.env.N8N_PUBLIC_API_DISABLED = process.env.N8N_PUBLIC_API_DISABLED || 'false';
process.env.N8N_VERSION_NOTIFICATIONS_ENABLED = process.env.N8N_VERSION_NOTIFICATIONS_ENABLED || 'true';
process.env.N8N_EXECUTIONS_MODE = process.env.N8N_EXECUTIONS_MODE || 'regular';
process.env.N8N_PROTOCOL = process.env.N8N_PROTOCOL || 'https';
process.env.N8N_PATH = process.env.N8N_PATH || '/';
process.env.N8N_METADATA_DB_TABLE_NAMES = process.env.N8N_METADATA_DB_TABLE_NAMES || 'true';
process.env.N8N_WORKFLOW_TAGS_DISABLED = 'false';
process.env.N8N_USER_MANAGEMENT_DISABLED = 'false';

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
  console.log('🚀 YouTube Automation System with Enhanced Proxy Configuration');
  console.log('===============================================================');
  console.log('Starting n8n with Railway-compatible proxy settings:');
  console.log(`  - Host: ${process.env.N8N_HOST}`);
  console.log(`  - Port: ${process.env.N8N_PORT}`);
  console.log(`  - Basic Auth: ${process.env.N8N_BASIC_AUTH_ACTIVE}`);
  console.log(`  - Health Checker: ${process.env.N8N_HEALTH_CHECKER}`);
  console.log(`  - Trust Proxy: ${process.env.N8N_TRUST_PROXY} (CRITICAL FOR RAILWAY)`);
  console.log(`  - Webhook URL: ${process.env.WEBHOOK_URL || `https://${process.env.RAILWAY_PUBLIC_HOST}`}`);
  console.log(`  - Proxy Host: ${process.env.N8N_PROXY_HOST}`);
  console.log(`  - Proxy Port: ${process.env.N8N_PROXY_PORT}`);
  console.log(`  - Proxy SSL: ${process.env.N8N_PROXY_SSL}`);
  console.log('');

  // Prepare environment with all necessary proxy settings
  const envWithProxy = {
    ...process.env,
    // CRITICAL: Ensure these proxy settings are passed to the n8n process
    N8N_TRUST_PROXY: 'true', // This is the key to fixing the X-Forwarded-For error
    N8N_ROOT_URL: process.env.WEBHOOK_URL || `https://${process.env.RAILWAY_PUBLIC_HOST || 'localhost:' + port}`,
    N8N_PROXY_HOST: process.env.RAILWAY_PUBLIC_HOST || '0.0.0.0',
    N8N_PROXY_PORT: process.env.PORT || '443',
    N8N_PROXY_SSL: 'true',
    NODE_TLS_REJECT_UNAUTHORIZED: '0' // Required for proxy handling
  };

  // CRITICAL: Set the process environment before spawning n8n
  Object.assign(process.env, envWithProxy);

  // Start n8n as a child process
  const n8nProcess = spawn('n8n', ['start'], {
    env: envWithProxy,
    stdio: ['pipe', 'pipe', 'pipe'], // Use pipe for better control
    detached: false  // Keep process attached for proper control
  });

  // Capture n8n output
  n8nProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`[n8n] ${output}`);
    
    // If we see specific proxy errors, log additional info
    if (output.includes('X-Forwarded-For') || output.includes('ERR_ERL_UNEXPECTED_X_FORWARDED_FOR')) {
      console.log('⚠️  Detected proxy configuration issue. This should not happen with current settings.');
      console.log('💡 Ensure Railway environment has proper proxy settings.');
    }
  });

  n8nProcess.stderr.on('data', (data) => {
    const errorOutput = data.toString();
    console.error(`[n8n-error] ${errorOutput}`);
    
    // Check for the specific proxy validation error
    if (errorOutput.includes('ERR_ERL_UNEXPECTED_X_FORWARDED_FOR')) {
      console.log('❌ CRITICAL: Proxy configuration error detected!');
      console.log('💡 This indicates N8N_TRUST_PROXY is not properly set to true');
      console.log('💡 The system should have N8N_TRUST_PROXY="true" in environment');
      console.log('💡 Current N8N_TRUST_PROXY value:', process.env.N8N_TRUST_PROXY);
    }
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

  // Determine the correct app URL
  const appUrl = process.env.RAILWAY_PUBLIC_HOST 
    ? `https://${process.env.RAILWAY_PUBLIC_HOST}` 
    : (process.env.HEROKU_APP_NAME 
      ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` 
      : `http://localhost:${port}`);
  
  console.log('✅ n8n process started with proxy configuration. Dashboard available at:', appUrl);
  
  // Log the dashboard URL after a delay to let n8n start
  setTimeout(() => {
    console.log('');
    console.log('📋 Access Information:');
    console.log(`   Dashboard: ${appUrl}`);
    console.log(`   Health Check: ${appUrl}/healthz`);
    console.log(`   Workflow Status: ${appUrl}/workflow-status`);
    console.log('');
    console.log('💡 Login credentials: Use the N8N_BASIC_AUTH_USER and N8N_BASIC_AUTH_PASSWORD variables');
    console.log('💡 Proxy settings: N8N_TRUST_PROXY is set to true to handle Railway load balancer');
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