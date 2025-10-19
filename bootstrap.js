#!/usr/bin/env node

/**
 * Comprehensive N8N Startup with Proxy Configuration
 * 
 * This script ensures proper proxy configuration before n8n starts
 * to prevent X-Forwarded-For validation errors.
 */

// Set proxy configuration BEFORE requiring any modules
process.env.N8N_TRUST_PROXY = 'true';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
process.env.N8N_USER_MANAGEMENT_DISABLED = 'true';
process.env.N8N_METRICS = 'false';
process.env.N8N_NPS_DISABLED = 'true';
process.env.N8N_TELEMETRY_DISABLED = 'true';

// Only now require the main application
require('./index.js');