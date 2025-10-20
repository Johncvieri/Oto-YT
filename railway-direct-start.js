/**
 * Railway-Optimized n8n Startup - Direct Execution Approach
 * 
 * This file directly executes n8n with your proven configuration settings
 * to ensure immediate success based on your .env setup.
 */

// Apply critical proxy settings from your proven .env FIRST, before anything else
process.env.N8N_TRUST_PROXY = 'true';  // Critical for Railway - prevents X-Forwarded-For error
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';  // Required for proxy handling
process.env.N8N_PROTOCOL = 'https';  // Required for Railway HTTPS

// Apply your proven execution settings from .env
process.env.EXECUTIONS_PROCESS = 'main';  // As per your successful .env configuration
process.env.N8N_RUNNERS_ENABLED = 'true';  // As per your successful .env configuration

// IMPORTANT: Don't override auth/UI settings that are configured in railway.json
// Let railway.json handle auth settings to ensure access to auth page
// process.env.N8N_BASIC_AUTH_ACTIVE = 'true';  // Let railway.json handle this
// process.env.N8N_DISABLE_UI = 'false';       // Let railway.json handle this  
// process.env.N8N_HEADLESS = 'false';         // Let railway.json handle this
// process.env.N8N_USER_MANAGEMENT_DISABLED = 'false';  // Let railway.json handle this

// Load environment to get other settings
require('dotenv').config();

// Ensure critical settings remain
process.env.N8N_TRUST_PROXY = 'true';  // Critical - don't let .env override
process.env.N8N_PROTOCOL = 'https';    // Critical - don't let .env override
process.env.EXECUTIONS_PROCESS = 'main';  // Your proven setting
process.env.N8N_RUNNERS_ENABLED = 'true'; // Your proven setting

console.log('🚀 Starting n8n with Railway-optimized configuration:');
console.log(`   N8N_TRUST_PROXY: ${process.env.N8N_TRUST_PROXY} (CRITICAL - prevents proxy error!)`);
console.log(`   EXECUTIONS_PROCESS: ${process.env.EXECUTIONS_PROCESS} (your proven setting)`);
console.log(`   N8N_RUNNERS_ENABLED: ${process.env.N8N_RUNNERS_ENABLED} (your proven setting)`);
console.log(`   Auth settings: Respecting railway.json configuration for auth page access`);

// Start n8n programmatically with your proven settings
async function startN8n() {
  try {
    // Using spawn to run n8n directly with proper proxy settings
    const { spawn } = require('child_process');
    
    // Set up environment with proxy configurations
    const env = {
      ...process.env,
      N8N_TRUST_PROXY: 'true',
      EXECUTIONS_PROCESS: 'main',
      N8N_RUNNERS_ENABLED: 'true'
    };
    
    return new Promise((resolve, reject) => {
      const n8nProcess = spawn('n8n', ['start'], {
        stdio: 'inherit',
        env: env
      });
      
      n8nProcess.on('error', (err) => {
        console.error('❌ Failed to start n8n:', err);
        reject(err);
      });
      
      n8nProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`n8n exited with code ${code}`));
        }
      });
    });
  } catch (error) {
    console.error('❌ Failed to start n8n programmatically:', error);
    throw error;
  }
}

// Export the function so it can be required by other modules
module.exports = { startN8n };

if (require.main === module) {
  startN8n().catch(error => {
    console.error('Critical error:', error);
    process.exit(1);
  });
}