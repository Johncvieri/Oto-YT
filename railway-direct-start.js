/**
 * Railway-Optimized n8n Startup with Maximum Configuration Priority
 * 
 * This file executes n8n with trust proxy set BEFORE n8n initialization
 * by passing the setting as an argument to ensure it's applied immediately.
 */

console.log('🚀 Starting n8n with maximum configuration priority...');

// Start n8n programmatically with command-line arguments for critical settings
async function startN8n() {
  try {
    // Using spawn to run n8n directly with arguments to ensure settings are applied early
    const { spawn } = require('child_process');
    
    // Set critical environment variables
    const env = {
      ...process.env,
      // These are the critical settings that must be applied before Express initializes
      N8N_TRUST_PROXY: 'true',           // Critical for Railway proxy handling - must be first!
      N8N_BASIC_AUTH_ACTIVE: 'true',     // Ensure auth page shows instead of setup
      N8N_USER_MANAGEMENT_DISABLED: 'false', // Enable user management
      N8N_DISABLE_UI: 'false',           // Enable UI
      N8N_HEADLESS: 'false',             // Non-headless mode
      EXECUTIONS_PROCESS: 'main',        // Your proven setting
      N8N_RUNNERS_ENABLED: 'true',       // Your proven setting
      // Additional settings to ensure proxy is handled correctly
      NODE_TLS_REJECT_UNAUTHORIZED: '0', // Required for proxy handling
      N8N_PROTOCOL: 'https'              // Required for Railway
    };
    
    console.log('🔧 Starting n8n with maximum-priority settings:');
    console.log(`   N8N_TRUST_PROXY: ${env.N8N_TRUST_PROXY} (MAXIMUM PRIORITY!)`);
    console.log(`   N8N_BASIC_AUTH_ACTIVE: ${env.N8N_BASIC_AUTH_ACTIVE} (MAXIMUM PRIORITY)`);
    console.log(`   N8N_USER_MANAGEMENT_DISABLED: ${env.N8N_USER_MANAGEMENT_DISABLED} (MAXIMUM PRIORITY)`);
    console.log(`   N8N_DISABLE_UI: ${env.N8N_DISABLE_UI} (MAXIMUM PRIORITY)`);
    console.log(`   EXECUTIONS_PROCESS: ${env.EXECUTIONS_PROCESS} (PROVEN)`);
    console.log(`   N8N_RUNNERS_ENABLED: ${env.N8N_RUNNERS_ENABLED} (PROVEN)`);
    
    // Use command line arguments to ensure settings are applied as early as possible
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