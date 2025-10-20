/**
 * Environment Configuration for Railway Deployment
 * 
 * This file ensures that all environment variables from .env are properly applied
 * with additional Railway-specific configurations to ensure smooth operation.
 * NOTE: Preload config already sets critical proxy settings, so we focus on other configurations here.
 */

// Load environment variables from .env file first
require('dotenv').config();

// Ensure Railway-specific configurations are applied
console.log('🔧 Applying additional Railway-specific configurations...');

// Apply your specific settings from .env with fallbacks (avoiding proxy settings already set in preload)
process.env.N8N_PROTOCOL = process.env.N8N_PROTOCOL || 'https';
process.env.N8N_HOST = process.env.N8N_HOST || '0.0.0.0';
process.env.N8N_PORT = process.env.N8N_PORT || process.env.PORT || '5678';
process.env.PORT = process.env.PORT || '5678';

// Default to your Railway URL if not set (but don't overwrite what's already in preload)
process.env.N8N_ROOT_URL = process.env.N8N_ROOT_URL || 
  process.env.WEBHOOK_URL || 
  (process.env.RAILWAY_PUBLIC_HOST && `https://${process.env.RAILWAY_PUBLIC_HOST}`) || 
  'http://localhost:5678';
  
process.env.WEBHOOK_URL = process.env.WEBHOOK_URL || 
  (process.env.RAILWAY_PUBLIC_HOST && `https://${process.env.RAILWAY_PUBLIC_HOST}`) || 
  `http://localhost:${process.env.PORT}`;

// Apply your execution settings
process.env.EXECUTIONS_PROCESS = process.env.EXECUTIONS_PROCESS || 'main';
process.env.N8N_RUNNERS_ENABLED = process.env.N8N_RUNNERS_ENABLED || 'true';

// Apply timezone setting
process.env.TZ = process.env.TZ || 'Asia/Jakarta';

// Security and authentication settings
process.env.N8N_BASIC_AUTH_ACTIVE = process.env.N8N_BASIC_AUTH_ACTIVE || 'true';
process.env.N8N_SECURE_COOKIE = process.env.N8N_SECURE_COOKIE || 'true';

// Database settings
process.env.N8N_DB_TYPE = process.env.N8N_DB_TYPE || 'sqlite';
process.env.DB_SQLITE_PATH = process.env.DB_SQLITE_PATH || './n8n-database.db';
process.env.N8N_EXECUTIONS_MODE = process.env.N8N_EXECUTIONS_MODE || 'regular';

// Monitoring and health settings
process.env.N8N_HEALTH_CHECKER = process.env.N8N_HEALTH_CHECKER || 'true';
process.env.N8N_DIAGNOSTICS_ENABLED = process.env.N8N_DIAGNOSTICS_ENABLED || 'true';

// Ensure UI is enabled for monitoring
process.env.N8N_DISABLE_UI = 'false';
process.env.N8N_HEADLESS = 'false';

console.log('✅ Additional Railway-specific configurations applied');
console.log(`   N8N_ROOT_URL: ${process.env.N8N_ROOT_URL}`);
console.log(`   WEBHOOK_URL: ${process.env.WEBHOOK_URL}`);
console.log(`   N8N_PROTOCOL: ${process.env.N8N_PROTOCOL}`);
console.log(`   TZ: ${process.env.TZ}`);

// Log proxy settings that were set in preload
console.log(`   N8N_TRUST_PROXY (from preload): ${process.env.N8N_TRUST_PROXY} (CRITICAL FOR RAILWAY)`);

module.exports = {
  // Export function to ensure configurations are applied
  ensureRailwayConfig: () => {
    // Configurations are applied at module load time
    return true;
  }
};