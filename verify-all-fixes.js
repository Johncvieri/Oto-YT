/**
 * Comprehensive Verification Script for YouTube Automation System
 * 
 * This script verifies that all fixes and improvements have been properly implemented:
 * 1. Environment variables are correctly configured
 * 2. Supabase connection works and data can be seeded
 * 3. X-Forwarded-For error is resolved through trust proxy setting
 * 4. RLS policies are properly set up (verification through documentation)
 * 5. Workflow sync to production is properly configured
 * 6. All required scripts and processes are functioning
 */

const { runSeeding } = require('./seed-supabase');
const { requiredEnvVars, missingVars } = require('./verify-env');
const fs = require('fs');
const path = require('path');

async function verifyEnvironment() {
  console.log('🔍 Verifying environment configuration...');
  
  // Check all required environment variables
  const allCategories = Object.values(requiredEnvVars).flat();
  const missingCritical = missingVars.filter(varName => 
    ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'GEMINI_API_KEY'].includes(varName)
  );
  
  if (missingCritical.length > 0) {
    console.log('❌ Critical environment variables missing:');
    missingCritical.forEach(var => console.log(`  - ${var}`));
    return false;
  }
  
  console.log('✅ All critical environment variables are set');
  return true;
}

async function verifySupabaseConnection() {
  console.log('\n🔍 Verifying Supabase connection...');
  
  try {
    // Test the seeding process
    const seedingSuccess = await runSeeding();
    if (!seedingSuccess) {
      console.log('❌ Supabase seeding failed');
      return false;
    }
    
    console.log('✅ Supabase connection and seeding verified');
    return true;
  } catch (error) {
    console.log('❌ Supabase verification failed:', error.message);
    return false;
  }
}

async function verifyTrustProxySetting() {
  console.log('\n🔍 Verifying trust proxy configuration...');
  
  // Check that trust proxy is enabled in environment
  if (process.env.N8N_TRUST_PROXY === 'true' || process.env.N8N_TRUST_PROXY === true) {
    console.log('✅ Trust proxy setting is properly configured');
    return true;
  } else {
    console.log('⚠️  Trust proxy setting may not be properly configured');
    console.log(`   Current value: ${process.env.N8N_TRUST_PROXY}`);
    return false;
  }
}

async function verifyWorkflowFilesExist() {
  console.log('\n🔍 Verifying workflow files...');
  
  const expectedWorkflows = [
    'youtube_automation_source.json',
    'youtube_automation_game.json', 
    'youtube_automation_trend.json'
  ];
  
  let allExist = true;
  for (const workflow of expectedWorkflows) {
    const workflowPath = path.join(__dirname, workflow);
    if (!fs.existsSync(workflowPath)) {
      console.log(`❌ Workflow file missing: ${workflow}`);
      allExist = false;
    } else {
      console.log(`✅ Workflow file exists: ${workflow}`);
    }
  }
  
  return allExist;
}

async function verifyScripts() {
  console.log('\n🔍 Verifying system scripts...');
  
  const scriptsToCheck = [
    'import-workflows.js',
    'seed-supabase.js', 
    'verify-env.js',
    'auto-seed-workflows.js'
  ];
  
  let allScriptsExist = true;
  for (const script of scriptsToCheck) {
    const scriptPath = path.join(__dirname, script);
    if (!fs.existsSync(scriptPath)) {
      console.log(`❌ Script missing: ${script}`);
      allScriptsExist = false;
    } else {
      console.log(`✅ Script exists: ${script}`);
    }
  }
  
  return allScriptsExist;
}

async function verifyRLSConfiguration() {
  console.log('\n🔍 Verifying RLS configuration...');
  
  const rlsSqlPath = path.join(__dirname, 'supabase-rls-setup.sql');
  if (!fs.existsSync(rlsSqlPath)) {
    console.log('❌ RLS setup SQL script missing');
    return false;
  }
  
  const rlsSql = fs.readFileSync(rlsSqlPath, 'utf8');
  if (rlsSql.includes('ENABLE ROW LEVEL SECURITY') && rlsSql.includes('CREATE POLICY')) {
    console.log('✅ RLS setup script contains proper configuration');
    console.log('ℹ️  Note: RLS policies must be applied to the Supabase database manually or via migrations');
    return true;
  } else {
    console.log('❌ RLS setup script does not contain proper configuration');
    return false;
  }
}

async function verifyDeploymentConfiguration() {
  console.log('\n🔍 Verifying deployment configuration...');
  
  // Check railway.json for proper deployment command
  const railwayConfigPath = path.join(__dirname, 'railway.json');
  if (!fs.existsSync(railwayConfigPath)) {
    console.log('❌ Railway configuration missing');
    return false;
  }
  
  const railwayConfig = JSON.parse(fs.readFileSync(railwayConfigPath, 'utf8'));
  
  if (!railwayConfig.deploy?.cmd?.[1]?.includes('verify-env') ||
      !railwayConfig.deploy?.cmd?.[1]?.includes('seed-supabase') ||
      !railwayConfig.deploy?.cmd?.[1]?.includes('import-workflows')) {
    console.log('❌ Railway deployment command does not include verification steps');
    return false;
  }
  
  console.log('✅ Railway deployment configuration includes verification steps');
  
  // Check that required environment variables are set as required
  const requiredVars = railwayConfig.variables || {};
  const expectedRequired = [
    'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_ANON_KEY', 'SUPABASE_URL',
    'GEMINI_API_KEY', 'YOUTUBE_API_1', 'YOUTUBE_CHANNEL_1'
  ];
  
  let allRequiredVarsSet = true;
  for (const varName of expectedRequired) {
    if (!requiredVars[varName]) {
      console.log(`⚠️  Variable ${varName} not marked as required in Railway config`);
      allRequiredVarsSet = false;
    }
  }
  
  if (allRequiredVarsSet) {
    console.log('✅ All required variables are properly configured in Railway');
  }
  
  return true;
}

async function runFullVerification() {
  console.log('🚀 Starting comprehensive verification of all fixes...\n');
  
  let overallSuccess = true;
  
  // Run all verification checks
  const checks = [
    { name: 'Environment Configuration', fn: verifyEnvironment },
    { name: 'Supabase Connection', fn: verifySupabaseConnection },
    { name: 'Trust Proxy Setting', fn: verifyTrustProxySetting },
    { name: 'Workflow Files', fn: verifyWorkflowFilesExist },
    { name: 'System Scripts', fn: verifyScripts },
    { name: 'RLS Configuration', fn: verifyRLSConfiguration },
    { name: 'Deployment Configuration', fn: verifyDeploymentConfiguration }
  ];
  
  for (const check of checks) {
    try {
      const result = await check.fn();
      if (!result) {
        overallSuccess = false;
        console.log(`❌ ${check.name} verification failed`);
      } else {
        console.log(`✅ ${check.name} verification passed`);
      }
    } catch (error) {
      console.log(`❌ ${check.name} verification error:`, error.message);
      overallSuccess = false;
    }
    console.log(''); // Add spacing
  }
  
  // Summary
  console.log('📊 Verification Summary');
  console.log('=====================');
  
  if (overallSuccess) {
    console.log('🎉 All verifications passed! The YouTube Automation System is properly configured.');
    console.log('');
    console.log('✅ Fixed issues:');
    console.log('   - X-Forwarded-For error resolved via trust proxy setting');
    console.log('   - Supabase connection established with service role access');
    console.log('   - RLS policies documented for secure access');
    console.log('   - Workflow sync configured for production deployment');
    console.log('   - Environment variables properly validated');
    console.log('   - Automatic seeding scripts created');
    console.log('');
    console.log('🎯 The system is ready for deployment!');
  } else {
    console.log('❌ Some verifications failed. Please check the issues above.');
  }
  
  return overallSuccess;
}

// Run the verification if this file is executed directly
if (require.main === module) {
  runFullVerification()
    .then(success => {
      if (!success) {
        console.log('\n⚠️  Some issues were detected during verification');
        process.exit(1);
      } else {
        console.log('\n✅ All verifications completed successfully!');
        process.exit(0);
      }
    })
    .catch(error => {
      console.error('❌ Unexpected error during verification:', error);
      process.exit(1);
    });
}

module.exports = { runFullVerification };