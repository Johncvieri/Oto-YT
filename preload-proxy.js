/**
 * Railway Proxy Configuration Preload Module
 * 
 * This module is loaded before any other modules to ensure
 * N8N_TRUST_PROXY is set before Express and rate-limiter initialize
 * NOTE: This is kept minimal to ensure proxy is set before any other modules
 */

// CRITICAL: Set trust proxy BEFORE any Express modules are loaded
process.env.N8N_TRUST_PROXY = 'true';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

console.log('🔧 Proxy configuration applied via preload module');
console.log(`   N8N_TRUST_PROXY: ${process.env.N8N_TRUST_PROXY} (CRITICAL FOR RAILWAY!)`);

// Only essential settings here to avoid conflicts with unified-config.js
process.env.N8N_PROTOCOL = 'https';