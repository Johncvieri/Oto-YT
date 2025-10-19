/**
 * Environment Variables Verification Script
 * 
 * This script verifies that all required environment variables are properly set
 * for both local development and Railway deployment.
 */

require('dotenv').config();

console.log('🔍 Verifying environment variables...\n');

// Define required environment variables
const requiredEnvVars = {
  youtube: [
    'YOUTUBE_API_1',
    'YOUTUBE_CHANNEL_1', 
    'YOUTUBE_API_2',
    'YOUTUBE_CHANNEL_2',
    'YOUTUBE_API_3', 
    'YOUTUBE_CHANNEL_3'
  ],
  supabase: [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ],
  ai: [
    'GEMINI_API_KEY'
  ],
  telegram: [
    'TELEGRAM_API_KEY',
    'TELEGRAM_CHAT_ID'
  ],
  n8n: [
    'N8N_BASIC_AUTH_USER',
    'N8N_BASIC_AUTH_PASSWORD'
  ]
};

// Track missing variables
const missingVars = [];

// Check each category
Object.keys(requiredEnvVars).forEach(category => {
  console.log(`📋 ${category.toUpperCase()} Variables:`);
  
  requiredEnvVars[category].forEach(varName => {
    const value = process.env[varName];
    
    if (!value || value.includes('your_')) {
      console.log(`  ❌ ${varName}: Missing or placeholder value`);
      missingVars.push(varName);
    } else {
      // Mask sensitive values when displaying
      let displayValue = value;
      if (varName.includes('KEY') || varName.includes('PASSWORD') || varName.includes('TOKEN')) {
        displayValue = '*'.repeat(Math.min(value.length, 16));
      }
      console.log(`  ✅ ${varName}: ${displayValue}`);
    }
  });
  
  console.log('');
});

// Check for Railway-specific variables
console.log('🔍 Railway Deployment Variables:');
const railwayVars = ['RAILWAY_PUBLIC_HOST', 'NODE_ENV'];
railwayVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value}`);
  } else {
    console.log(`  ⚠️  ${varName}: Not set (may not be required for local development)`);
  }
});
console.log('');

// Check for additional important variables
console.log('🔍 Additional Important Variables:');
const additionalVars = ['PORT', 'TZ', 'WEBHOOK_URL'];
additionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value}`);
  } else {
    console.log(`  ⚠️  ${varName}: Not set`);
  }
});
console.log('');

// Summary
if (missingVars.length > 0) {
  console.log(`❌ Found ${missingVars.length} missing environment variables:`);
  missingVars.forEach(varName => console.log(`  - ${varName}`));
  console.log('\n👉 Please set these variables in your environment or .env file');
  console.log('👉 Check .env.template for reference');
} else {
  console.log('✅ All required environment variables are properly set!');
}

// Check if running in Railway context
const isRailway = process.env.RAILWAY_DEPLOYMENT_ID;
if (isRailway) {
  console.log('\n✅ Running in Railway environment');
} else {
  console.log('\nℹ️  Running in local environment');
}

// Check Node version compatibility
const nodeVersion = process.version;
const nodeMajor = parseInt(nodeVersion.split('.')[0].substring(1));
if (nodeMajor >= 16) {
  console.log(`✅ Node version ${nodeVersion} is supported (>=16.0.0)`);
} else {
  console.log(`⚠️  Node version ${nodeVersion} may be outdated (>=16.0.0 recommended)`);
}

console.log('\n🎉 Environment verification completed');

// Exit with error code if critical variables are missing
if (missingVars.some(varName => 
  ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'GEMINI_API_KEY'].includes(varName)
)) {
  console.log('\n❌ Critical environment variables missing - application will not function properly');
  process.exit(1);
}

module.exports = { requiredEnvVars, missingVars };