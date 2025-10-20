/**
 * Unified Configuration and Startup for Railway with Early Proxy Setup
 * 
 * This file applies unified configuration before starting n8n
 * to ensure consistent settings across the application.
 * CRITICAL: Proxy settings are now applied at the earliest possible time.
 */

// Apply early proxy setup first (at the module level, before any imports)
// This ensures N8N_TRUST_PROXY is set before Express modules initialize
require('./early-proxy-setup');

// Then apply unified configuration
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