/**
 * Sync Workflows from GitHub to Supabase
 * 
 * This script synchronizes workflow files from GitHub to Supabase
 * It reads workflow files from the repository and stores them in Supabase
 * as configuration data while maintaining versioning in Git.
 */

const { createClient } = require('@supabase/supabase-js');
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

// Function to read and validate workflow files
async function readWorkflowFiles() {
  const fs = require('fs');
  const path = require('path');
  
  // Find all workflow files in the repository
  const workflowFiles = [
    'youtube_automation_source.json',
    'youtube_automation_game.json',
    'youtube_automation_trend.json'
  ].filter(file => fs.existsSync(file));
  
  console.log(`🔍 Found ${workflowFiles.length} workflow files to sync`);
  
  const workflows = [];
  
  for (const file of workflowFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const workflow = JSON.parse(content);
      
      workflows.push({
        name: workflow.name || file.replace('.json', ''),
        content: content,
        file_name: file,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        active: workflow.active || true,
        description: `Workflow from GitHub: ${file}`,
        category: getWorkflowCategory(file)
      });
      
      console.log(`✅ Validated workflow: ${workflow.name || file}`);
    } catch (error) {
      console.error(`❌ Error reading workflow file ${file}:`, error.message);
      throw error;
    }
  }
  
  return workflows;
}

function getWorkflowCategory(fileName) {
  if (fileName.includes('source')) return 'content_analysis';
  if (fileName.includes('game')) return 'gaming';
  if (fileName.includes('trend')) return 'trend_analysis';
  return 'general';
}

// Function to sync workflows to Supabase
async function syncWorkflowsToSupabase(workflows) {
  console.log('🔄 Syncing workflows to Supabase...');
  
  for (const workflow of workflows) {
    try {
      // Check if workflow already exists in Supabase
      const { data: existing, error: selectError } = await supabase
        .from('system_config') // Using system_config table to store workflow references
        .select('id')
        .eq('config_key', `workflow_${workflow.file_name}`)
        .single();
      
      if (selectError && selectError.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('❌ Error checking existing workflow:', selectError.message);
        continue;
      }
      
      if (existing) {
        // Update existing workflow
        const { error: updateError } = await supabase
          .from('system_config')
          .update({
            config_value: workflow.content,
            description: workflow.description,
            updated_at: workflow.updated_at
          })
          .eq('id', existing.id);
        
        if (updateError) {
          console.error(`❌ Error updating workflow ${workflow.name}:`, updateError.message);
        } else {
          console.log(`✅ Updated workflow: ${workflow.name}`);
        }
      } else {
        // Insert new workflow
        const { error: insertError } = await supabase
          .from('system_config')
          .insert({
            config_key: `workflow_${workflow.file_name}`,
            config_value: workflow.content,
            description: workflow.description,
            updated_at: workflow.updated_at
          });
        
        if (insertError) {
          console.error(`❌ Error inserting workflow ${workflow.name}:`, insertError.message);
        } else {
          console.log(`✅ Inserted workflow: ${workflow.name}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing workflow ${workflow.name}:`, error.message);
    }
  }
}

// Run the sync process
async function runSync() {
  try {
    console.log('🚀 Starting workflow synchronization from GitHub to Supabase...');
    
    // Read workflow files from repository
    const workflows = await readWorkflowFiles();
    
    if (workflows.length === 0) {
      console.log('⚠️ No workflow files found to sync');
      return;
    }
    
    // Sync to Supabase
    await syncWorkflowsToSupabase(workflows);
    
    console.log('✅ Workflow synchronization completed successfully!');
  } catch (error) {
    console.error('❌ Workflow synchronization failed:', error.message);
    process.exit(1);
  }
}

// Execute if run directly
if (require.main === module) {
  runSync().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

module.exports = { runSync };