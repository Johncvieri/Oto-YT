require('dotenv').config();
const { exec } = require('child_process');
const http = require('http');
const path = require('path');

/**
 * YouTube Automation System with AI Enhancement - Main Entry Point
 * 
 * This serves as the main entry point for the system that runs n8n workflows with AI-powered enhancements.
 */

console.log('YouTube Automation System with AI Enhancement');
console.log('================================================');
console.log('');

// Create a simple HTTP server for health checks
const server = http.createServer((req, res) => {
  if (req.url === '/healthz' || req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      service: 'YouTube Automation System' 
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Health check server running on port ${port}`);
});

// Check for required environment variables
const requiredEnvVars = ['GEMINI_API_KEY', 'SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn('Warning: The following environment variables are missing:');
  missingEnvVars.forEach(envVar => console.warn(`  - ${envVar}`));
  console.log('Please set these in your .env file or environment configuration.');
  console.log('');
}

// Function to start n8n with Railway-compatible settings
function startN8n() {
  // Set environment variables for n8n
  process.env.N8N_HOST = process.env.N8N_HOST || '0.0.0.0';
  process.env.N8N_PORT = process.env.PORT || '5678';
  process.env.N8N_BASIC_AUTH_ACTIVE = process.env.N8N_BASIC_AUTH_ACTIVE || 'false';
  process.env.N8N_SECURE_COOKIE = process.env.N8N_SECURE_COOKIE || 'false';
  process.env.N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS = process.env.N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS || 'false';
  process.env.N8N_PERSONALIZATION_ENABLED = process.env.N8N_PERSONALIZATION_ENABLED || 'false';
  process.env.WEBHOOK_URL = process.env.WEBHOOK_URL || `http://localhost:${process.env.PORT || 5678}`;
  
  console.log('Starting n8n with configurations:');
  console.log(`  - Host: ${process.env.N8N_HOST}`);
  console.log(`  - Port: ${process.env.N8N_PORT}`);
  console.log(`  - Basic Auth: ${process.env.N8N_BASIC_AUTH_ACTIVE}`);
  console.log('');
  
  // In production (like Railway), n8n should be started as a separate process or service
  // For Railway deployment, we'll just log the configuration
  if (process.env.NODE_ENV === 'production') {
    console.log('✅ Application initialized for production');
    console.log('💡 n8n will be started automatically by the deployment platform with the above configuration');
  } else {
    // For local development
    const n8nCmd = process.platform === 'win32' ? 'n8n.cmd' : 'n8n';
    const n8nProcess = exec(n8nCmd + ' start', { env: process.env }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting n8n: ${error}`);
        return;
      }
      console.log(`n8n started successfully!`);
    });
    
    n8nProcess.stdout.on('data', (data) => {
      console.log(`n8n: ${data}`);
    });
    
    n8nProcess.stderr.on('data', (data) => {
      console.error(`n8n error: ${data}`);
    });
    
    n8nProcess.on('close', (code) => {
      console.log(`n8n process exited with code ${code}`);
    });
  }
}

// If this file is run directly, start n8n
if (require.main === module) {
  console.log('This system runs through n8n workflows with AI-powered content analysis.');
  console.log('AI features powered by Google Gemini for better content selection and generation.');
  console.log('');
  
  // Wait a moment for setup before starting n8n
  setTimeout(() => {
    startN8n();
  }, 1000);
}

module.exports = { startN8n };