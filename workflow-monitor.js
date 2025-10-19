/**
 * Workflow Status Monitor
 * 
 * Script to check workflow status and generate reports
 */

const { createClient } = require('@supabase/supabase-js');

async function checkWorkflowStatus() {
  console.log('🔍 Checking workflow status...');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // Get recent workflow executions
    const { data: recentRuns, error } = await supabase
      .from('workflow_monitoring') // This table needs to be created
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('❌ Error fetching workflow status:', error.message);
      return null;
    }
    
    if (!recentRuns || recentRuns.length === 0) {
      console.log('ℹ️ No recent workflow runs found');
      return { recentRuns: [] };
    }
    
    // Calculate stats
    const stats = {
      totalRuns: recentRuns.length,
      successful: recentRuns.filter(run => run.status === 'success').length,
      failed: recentRuns.filter(run => run.status === 'failed').length,
      running: recentRuns.filter(run => run.status === 'running').length,
      avgDuration: recentRuns.reduce((sum, run) => sum + (run.duration_ms || 0), 0) / recentRuns.length
    };
    
    console.log('📊 Recent Workflow Stats:');
    console.log(`   Total runs: ${stats.totalRuns}`);
    console.log(`   Successful: ${stats.successful}`);
    console.log(`   Failed: ${stats.failed}`);
    console.log(`   Avg duration: ${stats.avgDuration.toFixed(2)}ms`);
    
    return { recentRuns, stats };
    
  } catch (error) {
    console.error('❌ Error checking workflow status:', error.message);
    return null;
  }
}

async function generateDailyReport() {
  console.log('📈 Generating daily report...');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // Get daily stats
    const { data: dailyStats, error } = await supabase
      .from('workflow_daily_stats')
      .select('*')
      .order('date', { ascending: false })
      .limit(7); // Last 7 days
    
    if (error) {
      console.error('❌ Error fetching daily stats:', error.message);
      return null;
    }
    
    if (!dailyStats || dailyStats.length === 0) {
      console.log('ℹ️ No daily stats available');
      return { dailyStats: [] };
    }
    
    console.log('📅 Daily Stats (Last 7 Days):');
    dailyStats.forEach(stat => {
      console.log(`   ${stat.date}: ${stat.executions_count} runs (${stat.success_count} success, ${stat.failure_count} failed)`);
    });
    
    return { dailyStats };
    
  } catch (error) {
    console.error('❌ Error generating daily report:', error.message);
    return null;
  }
}

// Run monitoring
async function runMonitoring() {
  console.log('🚀 Starting workflow monitoring...');
  
  const status = await checkWorkflowStatus();
  if (status) {
    console.log('✅ Status check completed');
  }
  
  const report = await generateDailyReport();
  if (report) {
    console.log('✅ Daily report generated');
  }
  
  return { status, report };
}

// Run if executed directly
if (require.main === module) {
  runMonitoring()
    .then(result => {
      console.log('🎯 Monitoring completed');
    })
    .catch(error => {
      console.error('❌ Monitoring failed:', error);
    });
}

module.exports = { runMonitoring, checkWorkflowStatus, generateDailyReport };