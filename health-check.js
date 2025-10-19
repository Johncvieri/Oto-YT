/**
 * Health Check Endpoint for Railway
 * 
 * This adds a simple health check endpoint that Railway can use to verify the application is running
 */

const express = require('express');
const app = express();

// Set trust proxy for Railway's load balancer
app.set('trust proxy', 1);

// Simple health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Health check successful',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5678;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Health check server running on port ${PORT}`);
});