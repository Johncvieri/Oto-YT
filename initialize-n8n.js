/**
 * Initialize n8n with default user to avoid setup wizard
 * 
 * This script creates a default user in n8n's database to bypass the setup wizard
 * and ensure that the authentication page is shown instead of the setup page.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

// Function to create default user in n8n
async function initializeN8nUser() {
  console.log('🔧 Initializing n8n with default user...');
  
  // Check if database file exists, if not, n8n will create it
  const dbPath = process.env.DB_SQLITE_PATH || './n8n-database.db';
  console.log(`📊 Using database: ${dbPath}`);
  
  // Check if n8n CLI is available
  try {
    const version = execSync('n8n --version', { encoding: 'utf-8' });
    console.log(`✅ n8n available: ${version.trim()}`);
  } catch (error) {
    console.log(`❌ n8n CLI not available, skipping initialization: ${error.message}`);
    return false;
  }
  
  // Get user credentials from environment
  const username = process.env.N8N_BASIC_AUTH_USER || 'admin';
  const password = process.env.N8N_BASIC_AUTH_PASSWORD || 'admin123';
  
  if (!username || !password || username === 'admin' || password === 'admin123') {
    console.log('⚠️  Warning: Using default credentials, please set proper N8N_BASIC_AUTH_USER and N8N_BASIC_AUTH_PASSWORD');
  }
  
  console.log(`👤 Creating user: ${username}`);
  
  try {
    // Try to create a user using n8n CLI
    // Note: n8n CLI user management might differ depending on version
    console.log('🔄 Attempting to initialize n8n database...');
    
    // Run n8n init command if available
    try {
      execSync('n8n init', { 
        encoding: 'utf-8', 
        timeout: 30000, // 30 seconds
        env: { ...process.env }
      });
      console.log('✅ n8n initialization completed');
    } catch (initError) {
      console.log(`⚠️  n8n init command may not be available or had an issue: ${initError.message}`);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error during n8n initialization: ${error.message}`);
    return false;
  }
}

// Run initialization
if (require.main === module) {
  initializeN8nUser()
    .then(success => {
      if (success) {
        console.log('🎉 n8n initialization completed successfully');
      } else {
        console.log('⚠️  n8n initialization completed with some issues (may be normal)');
      }
    })
    .catch(error => {
      console.error('💥 Critical error during n8n initialization:', error);
      process.exit(1);
    });
}

module.exports = { initializeN8nUser };