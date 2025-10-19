/**
 * Simple workflow import with minimal error handling
 * 
 * This script imports workflow files to n8n, continuing even if imports fail
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKFLOW_FILES = [
  'youtube_automation_source.json',
  'youtube_automation_game.json', 
  'youtube_automation_trend.json'
];

function importWorkflows() {
  console.log('🔄 Starting workflow import process (continuing regardless of success)...');
  
  for (const workflowFile of WORKFLOW_FILES) {
    const workflowPath = path.join(__dirname, workflowFile);
    
    if (!fs.existsSync(workflowPath)) {
      console.log(`⚠️  Workflow file not found: ${workflowFile}`);
      continue;
    }
    
    console.log(`📥 Processing: ${workflowFile}`);
    
    try {
      // Verify workflow file is valid JSON
      JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
      console.log(`   ✅ Valid JSON structure`);
      
      // Try to import with minimal error handling
      const result = execSync(`n8n import:workflow --input "${workflowPath}" --force`, {
        encoding: 'utf-8',
        env: { 
          ...process.env,
          N8N_TRUST_PROXY: 'true',
          N8N_USER_MANAGEMENT_DISABLED: 'false'
        },
        timeout: 45000  // 45 second timeout
      });
      
      console.log(`   ✅ Import command completed: ${workflowFile}`);
      if (result) console.log(`   Output: ${result.substring(0, 100)}...`); // Truncate output
      
    } catch (error) {
      console.log(`   ⚠️  Import may have issues for ${workflowFile} (continuing anyway)`);
      // Note: We continue anyway since the import is best-effort
    }
  }
  
  console.log('✅ Workflow import process completed (success not guaranteed, continuing startup)...');
}

// Run the import
if (require.main === module) {
  try {
    importWorkflows();
  } catch (error) {
    console.error('⚠️ Unexpected error during workflow import (continuing anyway):', error.message);
  }
  console.log('🎉 Workflow process completed - continuing with n8n startup');
}

module.exports = { importWorkflows };