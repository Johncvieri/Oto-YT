/**
 * Railway-Optimized n8n Startup with Railway Configuration Priority
 * 
 * This file executes n8n while prioritizing Railway's environment variables
 * over any Node.js level configurations to ensure proxy and auth work correctly.
 */

console.log('🚀 Starting n8n with Railway configuration priority...');

// Start n8n programmatically ensuring Railway config takes precedence
async function startN8n() {
  try {
    // Using spawn to run n8n directly 
    const { spawn } = require('child_process');
    
    // Explicitly set critical environment variables to ensure they're applied
    const env = {
      ...process.env,
      // Ensure Railway settings take absolute priority
      N8N_TRUST_PROXY: 'true',           // Critical for Railway proxy handling
      N8N_BASIC_AUTH_ACTIVE: 'true',     // Ensure auth page shows instead of setup
      N8N_USER_MANAGEMENT_DISABLED: 'false', // Enable user management
      N8N_DISABLE_UI: 'false',           // Enable UI
      N8N_HEADLESS: 'false',             // Non-headless mode
      EXECUTIONS_PROCESS: 'main',        // Your proven setting
      N8N_RUNNERS_ENABLED: 'true'        // Your proven setting
    };
    
    console.log('🔧 Starting n8n with Railway-prioritized settings:');
    console.log(`   N8N_TRUST_PROXY: ${env.N8N_TRUST_PROXY} (RAILWAY PRIORITY!)`);
    console.log(`   N8N_BASIC_AUTH_ACTIVE: ${env.N8N_BASIC_AUTH_ACTIVE} (RAILWAY PRIORITY)`);
    console.log(`   N8N_USER_MANAGEMENT_DISABLED: ${env.N8N_USER_MANAGEMENT_DISABLED} (RAILWAY PRIORITY)`);
    console.log(`   N8N_DISABLE_UI: ${env.N8N_DISABLE_UI} (RAILWAY PRIORITY)`);
    console.log(`   EXECUTIONS_PROCESS: ${env.EXECUTIONS_PROCESS} (PROVEN)`);
    console.log(`   N8N_RUNNERS_ENABLED: ${env.N8N_RUNNERS_ENABLED} (PROVEN)`);
    
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