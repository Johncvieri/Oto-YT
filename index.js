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