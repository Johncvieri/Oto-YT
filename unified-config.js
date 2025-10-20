/**
 * Unified Configuration for Railway Deployment with Early Proxy Setup
 * 
 * This file provides a single source of truth for all critical configurations
 * and ensures proxy settings are applied BEFORE any Express modules load.
 */

// CRITICAL: Apply proxy settings BEFORE loading any other modules that might initialize Express
process.env.N8N_TRUST_PROXY = 'true';           // Critical for Railway's load balancer
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // Required for proxy handling
process.env.N8N_PROTOCOL = 'https';             // Required for Railway HTTPS

// Tell n8n to use our configuration file
process.env.N8N_CONFIG_FILES = './config/n8n.config.js';

// Additional critical settings from n8n documentation
process.env.N8N_USER_MANAGEMENT_ENABLED = 'true'; // According to documentation

// Load environment variables from .env file
require('dotenv').config();

console.log('🔧 Loading unified configuration...');

// Apply Railway-specific root URL configuration
process.env.N8N_ROOT_URL = process.env.N8N_ROOT_URL || 
  process.env.WEBHOOK_URL || 
  (process.env.RAILWAY_PUBLIC_HOST && `https://${process.env.RAILWAY_PUBLIC_HOST}`) || 
  `http://localhost:${process.env.PORT || 5678}`;

process.env.WEBHOOK_URL = process.env.WEBHOOK_URL || 
  (process.env.RAILWAY_PUBLIC_HOST && `https://${process.env.RAILWAY_PUBLIC_HOST}`) || 
  `http://localhost:${process.env.PORT || 5678}`;

// Apply your proven execution settings from .env
process.env.EXECUTIONS_PROCESS = process.env.EXECUTIONS_PROCESS || 'main';
process.env.N8N_RUNNERS_ENABLED = process.env.N8N_RUNNERS_ENABLED || 'true';

// CRITICAL: Authentication and UI settings (consistent across the application)
process.env.N8N_BASIC_AUTH_ACTIVE = 'true';           // Enable basic auth to show auth page instead of setup
process.env.N8N_DISABLE_UI = 'false';                 // Enable UI for monitoring
process.env.N8N_HEADLESS = 'false';                   // Non-headless mode
process.env.N8N_USER_MANAGEMENT_ENABLED = 'true';     // Enable user management for monitoring
process.env.N8N_USER_MANAGEMENT_DISABLED = 'false';   // Enable user management for monitoring (DEPRECATED - use N8N_USER_MANAGEMENT_ENABLED)

// Security settings
process.env.N8N_SECURE_COOKIE = process.env.N8N_SECURE_COOKIE || 'true';
process.env.N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS = 'false';

// Additional important settings
process.env.N8N_HOST = process.env.N8N_HOST || '0.0.0.0';
process.env.N8N_PORT = process.env.N8N_PORT || process.env.PORT || '5678';
process.env.PORT = process.env.PORT || '5678';

// Database settings
process.env.N8N_DB_TYPE = process.env.N8N_DB_TYPE || 'sqlite';
process.env.DB_SQLITE_PATH = process.env.DB_SQLITE_PATH || './n8n-database.db';
process.env.N8N_EXECUTIONS_MODE = process.env.N8N_EXECUTIONS_MODE || 'regular';

// Monitoring and health settings
process.env.N8N_HEALTH_CHECKER = process.env.N8N_HEALTH_CHECKER || 'true';
process.env.N8N_DIAGNOSTICS_ENABLED = process.env.N8N_DIAGNOSTICS_ENABLED || 'true';
process.env.N8N_METRICS = process.env.N8N_METRICS || 'true';
process.env.N8N_INTERNAL_HOOKS_DISABLED = 'false';

// Timezone
process.env.TZ = process.env.TZ || 'Asia/Jakarta';

// Personalization and telemetry
process.env.N8N_PERSONALIZATION_ENABLED = 'false';
process.env.N8N_TELEMETRY_DISABLED = 'true';
process.env.N8N_NPS_DISABLED = 'true';

// FINAL CHECK: Ensure critical settings remain after loading .env
process.env.N8N_TRUST_PROXY = 'true';           // CRITICAL - prevent .env override
process.env.N8N_PROTOCOL = 'https';             // CRITICAL - ensure HTTPS
process.env.N8N_BASIC_AUTH_ACTIVE = 'true';     // CRITICAL - ensure auth page (not setup)
process.env.N8N_DISABLE_UI = 'false';           // CRITICAL - enable UI
process.env.N8N_HEADLESS = 'false';             // CRITICAL - non-headless
process.env.N8N_USER_MANAGEMENT_ENABLED = 'true';   // CRITICAL - enable user management
process.env.N8N_USER_MANAGEMENT_DISABLED = 'false'; // CRITICAL - enable user management (DEPRECATED - use N8N_USER_MANAGEMENT_ENABLED)

console.log('✅ Unified configuration applied:');
console.log(`   N8N_TRUST_PROXY: ${process.env.N8N_TRUST_PROXY} (CRITICAL!)`);
console.log(`   N8N_CONFIG_FILES: ${process.env.N8N_CONFIG_FILES} (ENSURING CONFIG FILE READ!)`);
console.log(`   N8N_BASIC_AUTH_ACTIVE: ${process.env.N8N_BASIC_AUTH_ACTIVE} (MUST BE true FOR AUTH!)`);
console.log(`   N8N_DISABLE_UI: ${process.env.N8N_DISABLE_UI}`);
console.log(`   N8N_HEADLESS: ${process.env.N8N_HEADLESS}`);
console.log(`   N8N_USER_MANAGEMENT_DISABLED: ${process.env.N8N_USER_MANAGEMENT_DISABLED}`);
console.log(`   N8N_ROOT_URL: ${process.env.N8N_ROOT_URL}`);
console.log(`   EXECUTIONS_PROCESS: ${process.env.EXECUTIONS_PROCESS} (proven setting)`);
console.log(`   N8N_RUNNERS_ENABLED: ${process.env.N8N_RUNNERS_ENABLED} (proven setting)`);

module.exports = {
  // Export function to ensure configurations are applied
  ensureUnifiedConfig: () => {
    // Configurations are applied at module load time
    return true;
  }
};