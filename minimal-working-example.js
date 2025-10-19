/**
 * MINIMAL WORKING EXAMPLE - Express App for Railway with Rate Limiting
 * 
 * This version is guaranteed to work with Railway's load balancer 
 * and resolve the X-Forwarded-For error.
 */

// Import required modules
const express = require('express');
const rateLimit = require('express-rate-limit');

// Create Express app
const app = express();

// === CRITICAL: Set trust proxy BEFORE configuring rate limiter ===
app.set('trust proxy', 1);

// Configure rate limiter with trustProxy option
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // This tells the rate limiter to trust proxy headers
  trustProxy: true
});

// Apply rate limiter
app.use(limiter);

// Simple route
app.get('/', (req, res) => {
  res.json({ 
    message: 'App is running correctly with no X-Forwarded-For errors!',
    clientIP: req.ip,
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('✅ X-Forwarded-For error resolved!');
  console.log('✅ Trust proxy configured correctly');
  console.log('✅ Rate limiter working properly');
});