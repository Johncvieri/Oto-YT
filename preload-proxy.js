/**
 * Railway Proxy Configuration Preload Module
 * 
 * This module is loaded before any other modules to ensure
 * N8N_TRUST_PROXY is set before Express and rate-limiter initialize
 */

// CRITICAL: Set trust proxy BEFORE any Express modules are loaded
process.env.N8N_TRUST_PROXY = 'true';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

console.log('🔧 Proxy configuration applied via preload module');
console.log(`   N8N_TRUST_PROXY: ${process.env.N8N_TRUST_PROXY} (CRITICAL FOR RAILWAY!)`);

// Ensure other important settings
process.env.N8N_PROTOCOL = 'https';
process.env.N8N_ROOT_URL = process.env.WEBHOOK_URL || `https://${process.env.RAILWAY_PUBLIC_HOST || 'localhost:5678'}`;