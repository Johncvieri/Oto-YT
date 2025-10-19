/**
 * Simple workflow import - direct to database
 * 
 * Uses n8n CLI to import workflows to database directly (should work without n8n server running)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Workflow files to import
const WORKFLOW_FILES = [
  'youtube_automation_source.json',
  'youtube_automation_game.json', 
  'youtube_automation_trend.json'
];

function importWorkflows() {
  console.log('🔄 Starting workflow import to database (n8n does not need to be running)...');
  
  // Check if n8n is available
  try {
    const version = execSync('n8n --version', { encoding: 'utf-8' });
    console.log(`✅ n8n available: ${version.trim()}`);
  } catch (error) {
    console.log(`❌ n8n not available, skipping import: ${error.message}`);
    return;
  }
  
  let importedCount = 0;
  
  for (const workflowFile of WORKFLOW_FILES) {
    const workflowPath = path.join(__dirname, workflowFile);
    
    // Check if file exists
    if (!fs.existsSync(workflowPath)) {
      console.log(`❌ Workflow file missing: ${workflowFile}`);
      continue;
    }
    
    // Verify it's valid JSON
    try {
      JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
    } catch (error) {
      console.log(`❌ Invalid JSON in ${workflowFile}: ${error.message}`);
      continue;
    }
    
    console.log(`📥 Importing ${workflowFile} to database...`);
    
    try {
      // Import workflow directly to database - should work without n8n running
      const result = execSync(`n8n import:workflow --input "${workflowPath}" --force`, {
        encoding: 'utf-8',
        env: { ...process.env }, // Use current environment
        stdio: 'pipe',
        timeout: 60000  // 60 second timeout
      });
      
      console.log(`   ✅ Successfully imported: ${workflowFile}`);
      importedCount++;
      
      if (result) {
        console.log(`   Result: ${result.substring(0, 200)}...`); // First 200 chars
      }
      
    } catch (error) {
      // Don't fail the entire process for one workflow
      console.log(`   ⚠️  Failed to import ${workflowFile}: ${error.message}`);
      console.log(`   This may be due to n8n not running or other factors`);
    }
  }
  
  console.log(`\n📊 Import completed: ${importedCount}/${WORKFLOW_FILES.length} workflows imported`);
  console.log('   These should appear in the dashboard after login');
}

// Run the import
if (require.main === module) {
  console.log('🎯 Running workflow import process...');
  try {
    importWorkflows();
    console.log('✅ Workflow import process finished');
  } catch (error) {
    console.error('❌ Critical error during import process:', error);
    // Still continue because this should not stop n8n from starting
  }
}

module.exports = { importWorkflows };