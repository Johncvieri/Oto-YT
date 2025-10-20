/**
 * Railway-Optimized n8n Startup with Unified Configuration
 * 
 * This file directly executes n8n with unified configuration settings
 * to ensure consistency across the application.
 */

// NOTE: Configuration is now handled by unified-config.js
// This file focuses only on the startup process itself

console.log('🚀 Starting n8n with unified configuration...');

// Start n8n programmatically with unified settings
async function startN8n() {
  try {
    // Using spawn to run n8n directly with unified settings
    const { spawn } = require('child_process');
    
    // Use the current process environment which has unified configuration
    const env = {
      ...process.env
    };
    
    console.log('🔧 Starting n8n with settings:');
    console.log(`   N8N_TRUST_PROXY: ${env.N8N_TRUST_PROXY} (CRITICAL!)`);
    console.log(`   N8N_BASIC_AUTH_ACTIVE: ${env.N8N_BASIC_AUTH_ACTIVE} (UNIFIED)`);
    console.log(`   N8N_DISABLE_UI: ${env.N8N_DISABLE_UI} (UNIFIED)`);
    console.log(`   EXECUTIONS_PROCESS: ${env.EXECUTIONS_PROCESS} (UNIFIED)`);
    console.log(`   N8N_RUNNERS_ENABLED: ${env.N8N_RUNNERS_ENABLED} (UNIFIED)`);
    
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