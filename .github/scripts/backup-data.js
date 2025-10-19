/**
 * Backup Script for GitHub-Supabase Collaboration
 * 
 * This script creates versioned backups of non-sensitive data from Supabase
 * and stores them in the GitHub repository for versioning and audit trail.
 * Only non-sensitive configuration data is backed up to maintain security.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { validateBackupData, redactSensitiveData } = require('./security-validation');
require('dotenv').config();

// Initialize Supabase client with service role key for full access
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    }
  }
);

// Function to backup configuration data
async function backupConfigData() {
  console.log('💾 Backing up configuration data...');
  
  try {
    // Fetch configuration data from Supabase (non-sensitive)
    const { data: config, error: configError } = await supabase
      .from('system_config')
      .select('*');
    
    if (configError) {
      console.error('❌ Error fetching configuration:', configError.message);
      throw configError;
    }
    
    // Validate and secure configuration data
    const safeConfig = validateBackupData(config, 'system_config');
    
    // Create backup directory if it doesn't exist
    const backupDir = './data-backups';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Create timestamped backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `versioned-data-${timestamp}.json`;
    const filePath = path.join(backupDir, fileName);
    
    const backupData = {
      timestamp: new Date().toISOString(),
      tableName: 'system_config',
      recordCount: safeConfig.length,
      data: safeConfig
    };
    
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));
    console.log(`✅ Configuration backup saved to: ${filePath}`);
    
    return filePath;
  } catch (error) {
    console.error('❌ Error in configuration backup:', error.message);
    throw error;
  }
}

// Function to backup workflow references from Supabase
async function backupWorkflowData() {
  console.log('💾 Backing up workflow references...');
  
  try {
    // Fetch workflow data from Supabase (stored in system_config)
    const { data: workflows, error: workflowError } = await supabase
      .from('system_config')
      .select('*')
      .ilike('config_key', 'workflow_%');
    
    if (workflowError) {
      console.error('❌ Error fetching workflows:', workflowError.message);
      throw workflowError;
    }
    
    if (workflows.length === 0) {
      console.log('ℹ️ No workflow data found to backup');
      return null;
    }
    
    // Create backup directory if it doesn't exist
    const backupDir = './data-backups';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Create timestamped backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `workflows-backup-${timestamp}.json`;
    const filePath = path.join(backupDir, fileName);
    
    // Validate and secure workflow data
    const safeWorkflows = validateBackupData(workflows, 'system_config_workflows');
    
    const backupData = {
      timestamp: new Date().toISOString(),
      tableName: 'system_config_workflows',
      recordCount: safeWorkflows.length,
      data: safeWorkflows
    };
    
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));
    console.log(`✅ Workflow backup saved to: ${filePath}`);
    
    return filePath;
  } catch (error) {
    console.error('❌ Error in workflow backup:', error.message);
    throw error;
  }
}

// Function to backup script templates and configurations
async function backupScriptData() {
  console.log('💾 Backing up script templates...');
  
  try {
    // Fetch script data from Supabase
    const { data: scripts, error: scriptError } = await supabase
      .from('scripts')
      .select('id, content, language_primary, language_secondary, topic, created_at')
      .order('created_at', { ascending: false })
      .limit(100); // Limit to avoid too much data
    
    if (scriptError) {
      console.error('❌ Error fetching scripts:', scriptError.message);
      throw scriptError;
    }
    
    if (scripts.length === 0) {
      console.log('ℹ️ No scripts found to backup');
      return null;
    }
    
    // Create backup directory if it doesn't exist
    const backupDir = './data-backups';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Create timestamped backup file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `scripts-backup-${timestamp}.json`;
    const filePath = path.join(backupDir, fileName);
    
    const backupData = {
      timestamp: new Date().toISOString(),
      tableName: 'scripts',
      recordCount: scripts.length,
      data: scripts
    };
    
    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));
    console.log(`✅ Script backup saved to: ${filePath}`);
    
    return filePath;
  } catch (error) {
    console.error('❌ Error in script backup:', error.message);
    throw error;
  }
}

// The redactSensitiveData function is now imported from security-validation.js
// This placeholder is kept for reference but the actual implementation is in the imported module

// Main backup process
async function runBackup() {
  try {
    console.log('🚀 Starting backup process...');
    
    const backupFiles = [];
    
    // 1. Backup configuration data
    const configBackup = await backupConfigData();
    if (configBackup) backupFiles.push(configBackup);
    
    // 2. Backup workflow data
    const workflowBackup = await backupWorkflowData();
    if (workflowBackup) backupFiles.push(workflowBackup);
    
    // 3. Backup script templates
    const scriptBackup = await backupScriptData();
    if (scriptBackup) backupFiles.push(scriptBackup);
    
    console.log(`✅ Backup process completed! Created ${backupFiles.length} backup files.`);
    console.log('Backup files:', backupFiles);
    
    // Create a summary file
    const summary = {
      timestamp: new Date().toISOString(),
      backupFiles: backupFiles,
      totalBackups: backupFiles.length
    };
    
    const summaryPath = './data-backups/backup-summary.json';
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`📋 Backup summary saved to: ${summaryPath}`);
    
  } catch (error) {
    console.error('❌ Backup process failed:', error.message);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  runBackup().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { runBackup };