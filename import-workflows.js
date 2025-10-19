/**
 * Import n8n workflows by copying to default n8n workflow directory
 * 
 * This script copies workflow files to n8n's default workflow directory
 * so they are automatically loaded when n8n starts.
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
require('dotenv').config();

const access = promisify(fs.access);
const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

const WORKFLOW_FILES = [
  'youtube_automation_source.json',
  'youtube_automation_game.json',
  'youtube_automation_trend.json'
];

async function ensureWorkflowDirectory() {
  // n8n default workflow directory
  const workflowDir = path.join(__dirname, '.n8n', 'workflows');
  
  try {
    await access(workflowDir, fs.constants.F_OK);
    console.log(`✅ Workflow directory exists: ${workflowDir}`);
  } catch (error) {
    // Directory doesn't exist, create it
    await mkdir(workflowDir, { recursive: true });
    console.log(`✅ Created workflow directory: ${workflowDir}`);
  }
  
  return workflowDir;
}

async function importWorkflows() {
  console.log('🔄 Starting workflow import process...');
  
  // Ensure the workflow directory exists
  const workflowDir = await ensureWorkflowDirectory();
  
  for (const workflowFile of WORKFLOW_FILES) {
    const sourcePath = path.join(__dirname, workflowFile);
    
    try {
      // Check if source file exists
      await access(sourcePath, fs.constants.F_OK);
      console.log(`📥 Processing workflow: ${workflowFile}`);
      
      // Copy workflow file to n8n's default workflow directory
      const destPath = path.join(workflowDir, workflowFile);
      await copyFile(sourcePath, destPath);
      
      console.log(`✅ Workflow copied to n8n: ${workflowFile}`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`⚠️  Workflow file not found: ${workflowFile}`);
      } else {
        console.error(`❌ Error copying workflow ${workflowFile}:`, error.message);
      }
    }
  }
  
  console.log('✅ Workflow import process completed. Workflows will be available when n8n starts.');
}

// Run the import
if (require.main === module) {
  importWorkflows()
    .then(() => {
      console.log('🎉 All workflow preparations completed!');
    })
    .catch(error => {
      console.error('❌ Error during workflow import:', error);
      process.exit(1);
    });
}

module.exports = { importWorkflows };