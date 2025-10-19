/**
 * Railway Configuration for n8n with Proxy Trust
 * 
 * This script ensures proper proxy configuration for Railway deployment
 * to resolve X-Forwarded-For validation errors in n8n.
 */

// Set environment variables before anything else
process.env.N8N_TRUST_PROXY = 'true';
process.env.N8N_ROOT_URL = `https://${process.env.RAILWAY_PUBLIC_HOST}`;
process.env.N8N_HOST = '0.0.0.0';
process.env.N8N_DIAGNOSTICS_ENABLED = 'true';
process.env.N8N_PUBLIC_API_DISABLED = 'false';
process.env.N8N_EXECUTIONS_MODE = 'regular';

console.log('🔧 Setting up n8n environment for Railway...');
console.log(`N8N_TRUST_PROXY: ${process.env.N8N_TRUST_PROXY}`);
console.log(`N8N_ROOT_URL: ${process.env.N8N_ROOT_URL}`);
console.log(`RAILWAY_PUBLIC_HOST: ${process.env.RAILWAY_PUBLIC_HOST}`);

// Load the main application after setting environment
require('./index.js');