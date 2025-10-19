/**
 * Railway-specific Express Configuration with Rate Limiting
 * 
 * This configuration addresses Railway's load balancer and X-Forwarded-For headers
 * to prevent the ValidationError mentioned in the issue.
 */

// Import required modules
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Create Express app
const app = express();

// === CRITICAL: Trust Proxy Configuration for Railway ===
// Railway uses load balancers that add X-Forwarded-For headers
// Without proper trust proxy setting, express-rate-limit fails
app.set('trust proxy', true); // Trust all proxies by IP address

// Alternative approach: Be more specific about proxy trust level
// For Railway, using the number indicates how many proxy hops to trust
// app.set('trust proxy', 1); // Trust only the first proxy (Railway's load balancer)

// Configure rate limiter specifically for Railway
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Explicitly enable trustProxy to handle Railway's load balancer
  trustProxy: true,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

// Apply the rate limiter
app.use(limiter);

// Additional security with Helmet
app.use(helmet());

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware to log IP information for debugging
app.use((req, res, next) => {
  console.log('--- Request Information ---');
  console.log('Raw IP:', req.ip);
  console.log('Original URL:', req.originalUrl);
  console.log('X-Forwarded-For:', req.headers['x-forwarded-for']);
  console.log('X-Forwarded-Proto:', req.headers['x-forwarded-proto']);
  console.log('X-Forwarded-Host:', req.headers['x-forwarded-host']);
  console.log('CF-Connecting-IP:', req.headers['cf-connecting-ip']); // Additional header that might be present
  console.log('--- End Request Information ---');
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running on Railway with proper proxy configuration',
    timestamp: new Date().toISOString(),
    clientIP: req.ip,
    trustedProxy: app.get('trust proxy'),
    forwardedFor: req.headers['x-forwarded-for']
  });
});

// Main API endpoint
app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello from Railway with proper proxy configuration!',
    requestIP: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date().toISOString(),
    proxyInfo: {
      forwardedFor: req.headers['x-forwarded-for'],
      proto: req.headers['x-forwarded-proto'],
      host: req.headers['x-forwarded-host'],
      originalIP: req.ip,
      trustedProxySetting: app.get('trust proxy')
    }
  });
});

// Example of custom rate limit for specific routes
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per windowMs
  message: {
    error: 'Rate limit exceeded. Maximum 20 requests per minute.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/api/data', apiLimiter, (req, res) => {
  res.json({
    message: 'API data endpoint with custom rate limiting',
    requestIP: req.ip,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An error occurred processing your request',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint was not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Get port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('=== Express App Starting on Railway ===');
  console.log(`Server listening on port ${PORT}`);
  console.log(`Trust proxy setting: ${app.get('trust proxy')}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (process.env.RAILWAY_PUBLIC_HOST) {
    console.log(`Railway Public Host: ${process.env.RAILWAY_PUBLIC_HOST}`);
  }
  console.log('========================================');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received: Closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received: Closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;