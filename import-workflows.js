/**
 * Import n8n workflows script
 * 
 * This script imports workflow files into n8n before starting the main application.
 */

const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const WORKFLOW_FILES = [
  'youtube_automation_source.json',
  'youtube_automation_game.json',
  'youtube_automation_trend.json'
];

const importWorkflows = async () => {
  console.log('🔄 Starting workflow import process...');
  
  for (const workflowFile of WORKFLOW_FILES) {
    const workflowPath = path.join(__dirname, workflowFile);
    
    if (fs.existsSync(workflowPath)) {
      console.log(`📥 Importing workflow: ${workflowFile}`);
      
      try {
        // Use n8n's built-in import command
        const result = spawn('n8n', ['import:workflow', '--input', workflowPath], {
          stdio: 'inherit',
          env: { ...process.env }
        });
        
        await new Promise((resolve, reject) => {
          result.on('close', (code) => {
            if (code === 0) {
              console.log(`✅ Successfully imported workflow: ${workflowFile}`);
              resolve();
            } else {
              console.log(`⚠️  Workflow import may have failed for: ${workflowFile} (exit code: ${code})`);
              resolve(); // Continue with other imports even if one fails
            }
          });
        });
      } catch (error) {
        console.error(`❌ Error importing workflow ${workflowFile}:`, error.message);
      }
    } else {
      console.log(`⚠️  Workflow file not found: ${workflowFile}`);
    }
  }
  
  console.log('✅ Workflow import process completed.');
};

// Run the import
if (require.main === module) {
  importWorkflows().catch(console.error);
}

module.exports = { importWorkflows };