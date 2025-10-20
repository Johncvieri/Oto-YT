/**
 * Preload Configuration for Railway Deployment
 * 
 * This file is loaded before n8n starts to ensure critical settings
 * are applied at the earliest possible time to prevent proxy errors.
 * NOTE: Now primarily focused on proxy settings to avoid conflicts
 * with unified-config.js
 */

// Set critical proxy configurations BEFORE n8n starts
process.env.N8N_TRUST_PROXY = 'true';
process.env.N8N_USER_MANAGEMENT_ENABLED = 'true';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

console.log('🔧 Preload proxy configuration applied:');
console.log(`   N8N_TRUST_PROXY: ${process.env.N8N_TRUST_PROXY} (CRITICAL!)`);
console.log(`   NODE_TLS_REJECT_UNAUTHORIZED: ${process.env.NODE_TLS_REJECT_UNAUTHORIZED}`);

// Export to make this module available
module.exports = {};