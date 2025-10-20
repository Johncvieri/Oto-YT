/**
 * Railway Optimized n8n Startup with Proxy Configuration
 * 
 * This approach prioritizes fixing the proxy error first, then adding functionality
 */

// Ensure the most critical setting for Railway is applied first
process.env.N8N_TRUST_PROXY = 'true';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.N8N_PROTOCOL = 'https';

// Your configurations from .env
process.env.EXECUTIONS_PROCESS = 'main';  // As in your .env
process.env.N8N_RUNNERS_ENABLED = 'true';  // As in your .env

// Start n8n directly with critical parameters
const { spawn } = require('child_process');

console.log('🚀 Starting n8n with Railway-optimized proxy configuration...');

// Spawn n8n with explicit proxy settings
const n8nProcess = spawn('n8n', ['start'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    // Re-ensure critical settings
    N8N_TRUST_PROXY: 'true',
    NODE_TLS_REJECT_UNAUTHORIZED: '0',
    N8N_PROTOCOL: 'https'
  }
});

n8nProcess.on('error', (err) => {
  console.error('❌ Failed to start n8n:', err.message);
});

n8nProcess.on('close', (code) => {
  console.log(`⚠️ n8n process exited with code ${code}`);
});