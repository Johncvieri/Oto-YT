module.exports = {
  /**
   * Railway-Optimized n8n Configuration
   * 
   * This configuration file is loaded by n8n before Express initialization
   * to prevent X-Forwarded-For proxy errors in Railway environment.
   */

  // Database configuration
  database: {
    type: process.env.N8N_DB_TYPE || 'sqlite',
    sqlite: {
      database: process.env.DB_SQLITE_PATH || './n8n-database.db',
    }
  },

  // Trust proxy settings - CRITICAL for Railway
  trustProxy: true, // This is the key setting that was causing errors

  // Web server configuration
  webhooks: {
    configuredHttpMethods: ['GET', 'POST', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  },
  
  // Externally hosted editor UI configuration
  editorBaseUrl: process.env.N8N_EDITOR_BASE_URL || process.env.WEBHOOK_URL || `https://${process.env.RAILWAY_PUBLIC_HOST || 'localhost:5678'}`,
  
  // Webhook configuration
  webhookBaseUrl: process.env.WEBHOOK_URL || `https://${process.env.RAILWAY_PUBLIC_HOST || 'localhost:5678'}`,

  // Security
  // User management settings - CRITICAL for auth vs setup page  
  userManagement: {
    enabled: process.env.N8N_USER_MANAGEMENT_ENABLED !== 'false', // Enable user management
    isInstanceOwnerSetUp: true, // CRITICAL: Skip setup flow since we configure via env vars
    skipInstanceOwnerSetup: true, // Skip the initial setup wizard entirely
  },
  
  security: {
    basicAuth: {
      active: process.env.N8N_BASIC_AUTH_ACTIVE !== 'false',
      user: process.env.N8N_BASIC_AUTH_USER || 'admin',
      password: process.env.N8N_BASIC_AUTH_PASSWORD || 'password'
    },
    excludeCredentialsFromResponse: false, // Ensure credentials work properly
  },

  // Host and port
  host: process.env.N8N_HOST || '0.0.0.0',
  port: parseInt(process.env.N8N_PORT) || parseInt(process.env.PORT) || 5678,

  // Protocol (HTTPS for Railway)
  protocol: process.env.N8N_PROTOCOL || 'https',
  
  // HTTPS settings
  https: {
    key: process.env.N8N_SSL_KEY,
    cert: process.env.N8N_SSL_CERT,
  },

  // Execution settings (as per your .env)
  executions: {
    mode: process.env.EXECUTIONS_PROCESS || 'main', // As in your .env
    saveDataOnError: true,
    saveDataOnSuccess: true,
    maxExecutionTimeout: Number(process.env.N8N_EXECUTIONS_TIMEOUT) || 3600000, // 1 hour
    timeout: Number(process.env.N8N_EXECUTIONS_TIMEOUT) || 3600000,
    webhookTimeout: Number(process.env.N8N_WEBHOOK_TIMEOUT) || 120000, // 120 seconds
  },

  // Additional settings
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
  },

  // Enable/disable features
  endpoints: {
    rest: 'rest',
    webhook: 'webhook',
    webhookTest: 'webhook-test',
  },

  // Metrics
  metrics: {
    enable: process.env.N8N_METRICS === 'true',
  },

  // Runner settings (as per your .env)
  runners: {
    enabled: process.env.N8N_RUNNERS_ENABLED === 'true', // As in your .env
  },
};