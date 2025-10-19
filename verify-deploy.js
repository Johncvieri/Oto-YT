/**
 * Verification script to check if all necessary files exist
 * before deploying to Railway
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying files for n8n workflow deployment...\n');

// Check main application files
const mainFiles = [
  'index.js',
  'import-workflows.js', 
  'package.json',
  'start.sh'
];

let allMainFilesExist = true;
for (const file of mainFiles) {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allMainFilesExist = false;
}

console.log('');

// Check workflow files
const workflowFiles = [
  'youtube_automation_source.json',
  'youtube_automation_game.json',
  'youtube_automation_trend.json'
];

let allWorkflowFilesExist = true;
for (const file of workflowFiles) {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allWorkflowFilesExist = false;
}

console.log('');

// Check for n8n dependency
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const hasN8n = packageJson.dependencies && packageJson.dependencies.n8n;
console.log(`${hasN8n ? '✅' : '❌'} n8n dependency in package.json`);

console.log('');

if (allMainFilesExist && allWorkflowFilesExist && hasN8n) {
  console.log('🎉 All files are present for successful deployment!');
  console.log('✅ Main application files: OK');
  console.log('✅ Workflow files: OK'); 
  console.log('✅ Dependencies: OK');
  console.log('\nYour dashboard should show workflows after deployment.');
  process.exit(0);
} else {
  console.log('❌ Some files are missing - deployment may fail or dashboard will be empty!');
  
  if (!allMainFilesExist) {
    console.log('Missing main application files - these are required');
  }
  
  if (!allWorkflowFilesExist) {
    console.log('Missing workflow files - these are required for the dashboard');
  }
  
  if (!hasN8n) {
    console.log('Missing n8n dependency - this is required');
  }
  
  process.exit(1);
}