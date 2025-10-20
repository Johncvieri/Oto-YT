/**
 * Minimal Proxy Configuration for Railway
 * 
 * This file focuses only on applying proxy configuration before starting n8n
 * to avoid X-Forwarded-For errors, without changing your auth configuration.
 */

// Apply only critical proxy settings - don't interfere with auth settings from Railway
process.env.N8N_TRUST_PROXY = 'true';  // CRITICAL for Railway proxy
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';  // Required for proxy

// Load your environment variables
require('dotenv').config();

// Re-ensure proxy settings after dotenv load
process.env.N8N_TRUST_PROXY = 'true';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Start n8n directly with your proven configuration
const { startN8n } = require('./railway-direct-start');

// When this script is executed directly, start the application
if (require.main === module) {
  startN8n().catch(error => {
    console.error('❌ Critical error starting application:', error);
    process.exit(1);
  });
}