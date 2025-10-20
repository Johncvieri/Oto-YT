/**
 * Preload Configuration for Railway Deployment
 * 
 * This file is loaded before n8n starts to ensure critical settings
 * are applied at the earliest possible time to prevent proxy errors.
 */

// Set critical Railway configurations BEFORE n8n starts
process.env.N8N_TRUST_PROXY = 'true';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.N8N_PROXY_HOST = process.env.RAILWAY_PUBLIC_HOST || '0.0.0.0';
process.env.N8N_PROXY_PORT = '443';
process.env.N8N_PROXY_SSL = 'true';
process.env.N8N_ROOT_URL = process.env.WEBHOOK_URL || `https://${process.env.RAILWAY_PUBLIC_HOST || 'localhost:5678'}`;

console.log('🔧 Preload configuration applied:');
console.log(`   N8N_TRUST_PROXY: ${process.env.N8N_TRUST_PROXY} (CRITICAL!)`);
console.log(`   NODE_TLS_REJECT_UNAUTHORIZED: ${process.env.NODE_TLS_REJECT_UNAUTHORIZED}`);
console.log(`   N8N_ROOT_URL: ${process.env.N8N_ROOT_URL}`);

// Export to make this module available
module.exports = {};