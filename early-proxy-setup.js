/**
 * Early Proxy Setup Module
 * 
 * This module is designed to be loaded before n8n starts to ensure
 * N8N_TRUST_PROXY is set at the absolute earliest possible time,
 * before ANY Express modules are loaded by n8n.
 */

// CRITICAL: Apply trust proxy setting at the module level BEFORE any imports
process.env.N8N_TRUST_PROXY = 'true';
process.env.N8N_USER_MANAGEMENT_ENABLED = 'true';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

console.log('🛡️  Early proxy setup applied at module level:');
console.log(`   N8N_TRUST_PROXY: ${process.env.N8N_TRUST_PROXY} (CRITICAL - EARLIEST SETUP!)`);
console.log(`   NODE_TLS_REJECT_UNAUTHORIZED: ${process.env.NODE_TLS_REJECT_UNAUTHORIZED}`);

// This module is intended to be loaded via NODE_OPTIONS or require at startup
// to ensure proxy settings are applied before n8n initializes Express
module.exports = {};