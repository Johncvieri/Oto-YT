/**
 * Unified Configuration and Startup for Railway
 * 
 * This file applies unified configuration before starting n8n
 * to ensure consistent settings across the application.
 */

// Apply unified configuration first
require('./unified-config');

// Start n8n directly with your proven configuration
const { startN8n } = require('./railway-direct-start');

// When this script is executed directly, start the application
if (require.main === module) {
  startN8n().catch(error => {
    console.error('❌ Critical error starting application:', error);
    process.exit(1);
  });
}