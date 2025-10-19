/**
 * YouTube Automation System with AI Enhancement - Main Entry Point
 * 
 * This serves as the main entry point for the system that runs n8n workflows 
 * with AI-powered enhancements for YouTube content automation.
 */

// Load environment variables
require('dotenv').config();

// --- Constants Definitions ---
const DEFAULT_PORT = 5678;
const REQUIRED_ENV_VARS = ['GEMINI_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const N8N_DEFAULTS = {
  HOST: '0.0.0.0',
  BASIC_AUTH_ACTIVE: 'false',
  SECURE_COOKIE: 'false',
  ENFORCE_SETTINGS_FILE_PERMISSIONS: 'false',
  PERSONALIZATION_ENABLED: 'false',
  HEALTH_CHECKER: 'true'
};

// --- Environment Configuration ---
const port = process.env.PORT || DEFAULT_PORT;

// Configure n8n environment variables for Railway deployment
process.env.N8N_HOST = process.env.N8N_HOST || N8N_DEFAULTS.HOST;
process.env.N8N_PORT = port.toString();
process.env.N8N_BASIC_AUTH_ACTIVE = process.env.N8N_BASIC_AUTH_ACTIVE || N8N_DEFAULTS.BASIC_AUTH_ACTIVE;
process.env.N8N_SECURE_COOKIE = process.env.N8N_SECURE_COOKIE || N8N_DEFAULTS.SECURE_COOKIE;
process.env.N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS = process.env.N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS || N8N_DEFAULTS.ENFORCE_SETTINGS_FILE_PERMISSIONS;
process.env.N8N_PERSONALIZATION_ENABLED = process.env.N8N_PERSONALIZATION_ENABLED || N8N_DEFAULTS.PERSONALIZATION_ENABLED;
process.env.N8N_HEALTH_CHECKER = N8N_DEFAULTS.HEALTH_CHECKER;
process.env.WEBHOOK_URL = process.env.WEBHOOK_URL || `https://${process.env.RAILWAY_PUBLIC_HOST || 'localhost:' + port}`;

// --- Environment Validation ---
const validateEnvironment = () => {
  const missingEnvVars = REQUIRED_ENV_VARS.filter(envVar => !process.env[envVar]);
  
  if (missingEnvVars.length > 0) {
    console.warn('Warning: The following environment variables are missing:');
    missingEnvVars.forEach(envVar => console.warn(`  - ${envVar}`));
    console.log('Please set these in your .env file or environment configuration.');
    console.log('');
  }
};

// --- Application Start ---
const startApplication = () => {
  console.log('YouTube Automation System with AI Enhancement');
  console.log('================================================');
  console.log('Starting n8n with configurations:');
  console.log(`  - Host: ${process.env.N8N_HOST}`);
  console.log(`  - Port: ${process.env.N8N_PORT}`);
  console.log(`  - Basic Auth: ${process.env.N8N_BASIC_AUTH_ACTIVE}`);
  console.log(`  - Health Checker: ${process.env.N8N_HEALTH_CHECKER}`);
  console.log('');

  const { spawn } = require('child_process');
  
  // Start n8n as a child process
  const n8nProcess = spawn('n8n', ['start'], {
    env: { ...process.env },
    stdio: 'inherit' // This ensures n8n's output goes directly to parent
  });

  n8nProcess.on('error', (err) => {
    console.error('Failed to start n8n:', err.message);
  });

  n8nProcess.on('close', (code) => {
    console.log(`n8n process exited with code ${code}`);
  });

  console.log('✅ n8n process started. Listening on port', port);
};

// --- Main Execution ---
validateEnvironment();

// When this script is executed directly, start the application
if (require.main === module) {
  startApplication();
}

module.exports = {
  validateEnvironment,
  startApplication,
  port
};