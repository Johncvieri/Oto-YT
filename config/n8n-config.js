/**
 * n8n Configuration for Railway Deployment
 * 
 * This configuration ensures n8n runs properly in Railway environment
 * with proper proxy settings and security configurations.
 */

// Load environment variables
require('dotenv').config();

// Base configuration
const config = {
  // Database configuration
  database: {
    type: process.env.N8N_DB_TYPE || 'sqlite',
    sqlite: {
      database: process.env.DB_SQLITE_PATH || './n8n-database.db',
      pool: {
        min: 0,
        acquireTimeoutMillis: 60000,
      }
    }
  },
  
  // Web server configuration
  endpoints: {
    rest: 'rest',
    webhook: 'webhook',
    webhookTest: 'webhook-test',
    metrics: process.env.N8N_METRICS && process.env.N8N_METRICS === 'true' ? '/metrics' : undefined
  },
  
  // Externally hosted editor UI configuration
  editorBaseUrl: process.env.N8N_EDITOR_BASE_URL || process.env.WEBHOOK_URL || `https://${process.env.RAILWAY_PUBLIC_HOST || 'localhost:5678'}`,
  
  // Webhook configuration
  webhookBaseUrl: process.env.WEBHOOK_URL || `https://${process.env.RAILWAY_PUBLIC_HOST || 'localhost:5678'}`,
  
  // Security
  security: {
    basicAuth: {
      active: process.env.N8N_BASIC_AUTH_ACTIVE !== 'false',
      user: process.env.N8N_BASIC_AUTH_USER || 'admin',
      password: process.env.N8N_BASIC_AUTH_PASSWORD || 'password'
    },
    excludeEndpoints: process.env.N8N_PUBLIC_API_DISABLED === 'true' ? 'me,users' : ''
  },
  
  // Proxy settings for Railway
  trustProxy: process.env.N8N_TRUST_PROXY || '1',
  
  // SSL/HTTPS settings
  protocol: process.env.N8N_PROTOCOL || 'https',
  
  // Host and port
  host: process.env.N8N_HOST || '0.0.0.0',
  port: parseInt(process.env.N8N_PORT) || 5678,
  
  // Additional settings
  https: {
    key: process.env.N8N_SSL_KEY,
    cert: process.env.N8N_SSL_CERT,
  },
  
  // Execution settings
  executions: {
    mode: process.env.N8N_EXECUTIONS_MODE || 'regular',
    saveDataOnError: true,
    saveDataOnSuccess: true,
    saveExecutionProgress: false,
    maxExecutionTimeout: Number(process.env.N8N_EXECUTIONS_TIMEOUT) || 3600000, // 1 hour
    timeout: Number(process.env.N8N_EXECUTIONS_TIMEOUT) || 3600000,
    webhookTimeout: Number(process.env.N8N_WEBHOOK_TIMEOUT) || 120000, // 120 seconds
  },
  
  // Queue and worker settings for horizontal scaling
  queue: {
    bull: {
      prefix: 'n8n',
      redis: {
        db: Number(process.env.N8N_REDIS_DB) || 0,
        port: Number(process.env.N8N_REDIS_PORT) || 6379,
        host: process.env.N8N_REDIS_HOST || 'localhost',
        password: process.env.N8N_REDIS_PASSWORD || undefined,
        timeoutThreshold: Number(process.env.N8N_REDIS_TIMEOUT_THRESHOLD) || 100,
      },
    },
  }
};

module.exports = config;