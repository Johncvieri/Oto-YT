/**
 * Import n8n workflows with detailed logging
 * 
 * This script imports workflow files into n8n's database
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const WORKFLOW_FILES = [
  'youtube_automation_source.json',
  'youtube_automation_game.json', 
  'youtube_automation_trend.json'
];

async function importWorkflows() {
  console.log('🔄 Starting workflow import process...');
  
  // First, check if n8n is available
  try {
    const { execSync } = require('child_process');
    const version = execSync('n8n --version', { encoding: 'utf-8' });
    console.log(`✅ n8n version: ${version.trim()}`);
  } catch (error) {
    console.error('❌ n8n is not available in this environment');
    console.error('Error details:', error.message);
    // Don't exit, continue anyway for debugging
  }
  
  let successCount = 0;
  
  for (const workflowFile of WORKFLOW_FILES) {
    const workflowPath = path.join(__dirname, workflowFile);
    
    if (!fs.existsSync(workflowPath)) {
      console.log(`❌ Workflow file does not exist: ${workflowFile}`);
      continue;
    }
    
    console.log(`📥 Checking workflow: ${workflowFile}`);
    
    try {
      // Verify the workflow file is valid JSON
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      const workflowObj = JSON.parse(workflowContent);
      console.log(`   - File structure: ${workflowObj.nodes?.length || 0} nodes, name: ${workflowObj.name || 'unnamed'}`);
    } catch (error) {
      console.error(`❌ Workflow file is not valid JSON: ${workflowFile}`, error.message);
      continue;
    }
    
    // Attempt workflow import with detailed error handling
    console.log(`   - Attempting import via CLI...`);
    
    try {
      const { execSync } = require('child_process');
      // Try import with timeout and detailed logging
      const result = execSync(`n8n import:workflow --input "${workflowPath}" --force`, {
        encoding: 'utf-8',
        env: { ...process.env, N8N_TRUST_PROXY: 'true' },
        timeout: 30000  // 30 second timeout
      });
      
      console.log(`✅ Successfully imported workflow: ${workflowFile}`);
      console.log(`   Result: ${result || 'Import completed successfully'}`);
      successCount++;
    } catch (error) {
      console.log(`⚠️  Workflow import may have issues for: ${workflowFile}`);
      console.log(`   Error message: ${error.message}`);
      if (error.stderr) console.log(`   stderr: ${error.stderr}`);
      if (error.stdout) console.log(`   stdout: ${error.stdout}`);
      // Continue with other workflows
    }
  }
  
  console.log(`\n📊 Import Summary: ${successCount}/${WORKFLOW_FILES.length} workflows processed.`);
  
  // Even if imports fail, continue to allow n8n to start
  console.log('✅ Workflow check process completed. Continuing with n8n startup...');
}

// Run the import
if (require.main === module) {
  importWorkflows()
    .then(() => {
      console.log('🎉 Workflow verification completed!');
    })
    .catch(error => {
      console.error('⚠️ Error during workflow process:', error);
      // Don't exit with error code to allow n8n to start
    });
}

module.exports = { importWorkflows };