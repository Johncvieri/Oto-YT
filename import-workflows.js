/**
 * Import n8n workflows using n8n's CLI import command
 * 
 * This script imports workflow files into n8n's database using the CLI
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
  
  // Verify n8n is available
  try {
    exec('n8n --version', { stdio: 'pipe' }, (error) => {
      if (error) {
        console.error('❌ n8n is not available in this environment');
        console.error('Error details:', error.message);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('❌ n8n is not available:', error.message);
    process.exit(1);
  }
  
  let successCount = 0;
  
  for (const workflowFile of WORKFLOW_FILES) {
    const workflowPath = path.join(__dirname, workflowFile);
    
    if (!fs.existsSync(workflowPath)) {
      console.log(`⚠️  Workflow file not found: ${workflowFile}`);
      continue;
    }
    
    console.log(`📥 Importing workflow: ${workflowFile}`);
    
    try {
      // Verify the workflow file is valid JSON
      const workflowContent = fs.readFileSync(workflowPath, 'utf8');
      JSON.parse(workflowContent);
      console.log(`   - Workflow file is valid JSON`);
    } catch (error) {
      console.error(`❌ Workflow file is not valid JSON: ${workflowFile}`, error.message);
      continue;
    }
    
    // Use n8n CLI to import workflow
    await new Promise((resolve, reject) => {
      const importProcess = spawn('n8n', ['import:workflow', '--input', workflowPath, '--force'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env }
      });
      
      let stdout = '';
      let stderr = '';
      
      importProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });
      
      importProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });
      
      importProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ Successfully imported workflow: ${workflowFile}`);
          successCount++;
        } else {
          console.log(`❌ Failed to import workflow: ${workflowFile}`);
          console.log(`   Exit code: ${code}`);
          if (stderr) console.log(`   Error: ${stderr}`);
          if (stdout) console.log(`   Output: ${stdout}`);
        }
        resolve();
      });
      
      importProcess.on('error', (error) => {
        console.error(`❌ Error spawning import process for ${workflowFile}:`, error.message);
        resolve();
      });
    });
  }
  
  console.log(`✅ Workflow import process completed. ${successCount}/${WORKFLOW_FILES.length} workflows imported successfully.`);
  
  if (successCount === 0) {
    console.error('❌ No workflows were imported successfully. This will result in an empty dashboard.');
    process.exit(1);
  }
}

// Run the import
if (require.main === module) {
  importWorkflows()
    .then(() => {
      console.log('🎉 Workflow import completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error during workflow import:', error);
      process.exit(1);
    });
}

module.exports = { importWorkflows };