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
  
  // Verify n8n is available before starting
  try {
    execSync('n8n --version', { stdio: 'pipe' });
    console.log('✅ n8n is available in environment');
  } catch (error) {
    console.error('❌ n8n is not available in environment. Please ensure n8n is properly installed.');
    console.error('Error details:', error.message);
    return;
  }
  
  for (const workflowFile of WORKFLOW_FILES) {
    const workflowPath = path.join(__dirname, workflowFile);
    
    if (fs.existsSync(workflowPath)) {
      console.log(`📥 Importing workflow: ${workflowFile}`);
      
      try {
        // Read workflow file to validate it before import
        const workflowContent = fs.readFileSync(workflowPath, 'utf8');
        const workflow = JSON.parse(workflowContent);
        
        console.log(`   - Workflow name: ${workflow.name}`);
        console.log(`   - Active: ${workflow.active}`);
        console.log(`   - Node count: ${workflow.nodes?.length || 0}`);
        
        // Use n8n's built-in import command
        // Add --force flag to overwrite existing workflows if needed
        const result = spawn('n8n', ['import:workflow', '--input', workflowPath, '--force'], {
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
        if (error instanceof SyntaxError) {
          console.error(`❌ The workflow file ${workflowFile} may be corrupted or not valid JSON`);
        }
      }
    } else {
      console.log(`⚠️  Workflow file not found: ${workflowFile}`);
      console.log(`   - Expected path: ${workflowPath}`);
      console.log(`   - Available files in directory:`, fs.readdirSync(__dirname).filter(f => f.endsWith('.json')));
    }
  }
  
  // Wait a moment to ensure all workflows are properly registered
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('✅ Workflow import process completed.');
};

// Run the import
if (require.main === module) {
  importWorkflows().catch(console.error);
}

module.exports = { importWorkflows };