/**
 * Express Application with Rate Limiting for Railway Deployment
 * 
 * This application demonstrates proper configuration for Railway deployment,
 * including trust proxy settings to handle X-Forwarded-For headers correctly.
 */

// Import required modules
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Create Express app
const app = express();

// Configure trust proxy for Railway's load balancer
// This is crucial for handling X-Forwarded-For headers properly
app.set('trust proxy', 1); // Trust first proxy (Railway's load balancer)

// Configure rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  // Use the X-Forwarded-For header to determine the client's IP
  skip: (req, res) => {
    // Optionally skip rate limiting for certain paths or conditions
    if (req.path === '/health' || req.path === '/favicon.ico') {
      return true;
    }
    return false;
  }
});

// Apply rate limiting middleware globally
app.use(limiter);

// Use Helmet for security headers
app.use(helmet());

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    clientIP: req.ip,
    forwardedFor: req.headers['x-forwarded-for']
  });
});

// Example API endpoint
app.get('/api/data', (req, res) => {
  res.json({
    message: 'This is an example API endpoint',
    requestIP: req.ip,
    clientIP: req.clientIp, // This will only work if properly configured
    timestamp: new Date().toISOString(),
    forwardedHeaders: {
      'x-forwarded-for': req.headers['x-forwarded-for'],
      'x-forwarded-proto': req.headers['x-forwarded-proto'],
      'x-forwarded-host': req.headers['x-forwarded-host']
    }
  });
});

// Example endpoint with different rate limits
const sensitiveLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit to 10 requests per windowMs for sensitive endpoints
  message: {
    error: 'Too many requests to sensitive endpoint, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.get('/api/sensitive', sensitiveLimiter, (req, res) => {
  res.json({
    message: 'This is a sensitive endpoint with stricter rate limiting',
    requestIP: req.ip,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Get port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Trust proxy setting: ${app.get('trust proxy')}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // If deployed on Railway, show the deployment URL
  if (process.env.RAILWAY_PUBLIC_HOST) {
    console.log(`Railway deployment URL: https://${process.env.RAILWAY_PUBLIC_HOST}`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;