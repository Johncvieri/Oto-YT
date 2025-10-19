/**
 * Advanced Workflow Monitoring for YouTube Automation System
 * 
 * This script provides real-time monitoring of workflow status,
 * execution tracking, and health reporting.
 */

const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

class WorkflowMonitor {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    this.n8nUrl = `https://${process.env.RAILWAY_PUBLIC_HOST}`;
    this.n8nAuth = {
      username: process.env.N8N_BASIC_AUTH_USER,
      password: process.env.N8N_BASIC_AUTH_PASSWORD
    };
    this.monitorInterval = 300000; // 5 minutes
    this.intervals = {};
  }

  /**
   * Check n8n workflow executions
   */
  async checkWorkflowExecutions() {
    try {
      const response = await axios.get(`${this.n8nUrl}/rest/executions`, {
        auth: this.n8nAuth,
        timeout: 10000
      });

      if (response.data && response.data.data) {
        return {
          success: true,
          count: response.data.data.length,
          executions: response.data.data.slice(0, 10) // Last 10 executions
        };
      } else {
        return {
          success: false,
          error: 'No data returned from n8n API'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `n8n API error: ${error.message}`
      };
    }
  }

  /**
   * Check workflow definitions
   */
  async checkWorkflowDefinitions() {
    try {
      const response = await axios.get(`${this.n8nUrl}/rest/workflows`, {
        auth: this.n8nAuth,
        timeout: 10000
      });

      if (response.data && response.data.data) {
        return {
          success: true,
          count: response.data.data.length,
          workflows: response.data.data
        };
      } else {
        return {
          success: false,
          error: 'No workflow data returned'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Workflow definitions error: ${error.message}`
      };
    }
  }

  /**
   * Get workflow status from database
   */
  async getWorkflowStatusFromDB() {
    try {
      // Check if workflow_monitoring table exists and query it
      const { data, error } = await this.supabase
        .from('workflow_monitoring')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        // If table doesn't exist, create it or return message
        if (error.code === '42P01') { // undefined table
          return {
            exists: false,
            message: 'workflow_monitoring table does not exist'
          };
        }
        throw error;
      }

      return {
        exists: true,
        success: true,
        records: data,
        count: data.length
      };
    } catch (error) {
      return {
        success: false,
        error: `Database error: ${error.message}`
      };
    }
  }

  /**
   * Check system health
   */
  async checkSystemHealth() {
    try {
      const healthResponse = await axios.get(`${this.n8nUrl}/healthz`, {
        timeout: 10000
      });

      return {
        success: true,
        health: healthResponse.data
      };
    } catch (error) {
      return {
        success: false,
        error: `Health check error: ${error.message}`
      };
    }
  }

  /**
   * Generate comprehensive status report
   */
  async generateStatusReport() {
    console.log('🔍 Generating comprehensive status report...');
    
    const [
      executions,
      definitions,
      dbStatus,
      health
    ] = await Promise.all([
      this.checkWorkflowExecutions(),
      this.checkWorkflowDefinitions(),
      this.getWorkflowStatusFromDB(),
      this.checkSystemHealth()
    ]);

    const report = {
      timestamp: new Date().toISOString(),
      n8n: {
        executions,
        definitions,
        health
      },
      database: dbStatus,
      summary: {
        n8n_status: health.success ? health.health.overall : 'unavailable',
        workflow_count: definitions.success ? definitions.count : 0,
        recent_executions: executions.success ? executions.count : 0,
        db_monitoring: dbStatus.exists
      }
    };

    console.log('📊 Status Report Generated:');
    console.log(`   Overall Status: ${report.summary.n8n_status}`);
    console.log(`   Workflows Configured: ${report.summary.workflow_count}`);
    console.log(`   Recent Executions: ${report.summary.recent_executions}`);
    console.log(`   DB Monitoring: ${report.summary.db_monitoring ? 'Enabled' : 'Disabled'}`);
    
    return report;
  }

  /**
   * Continuous monitoring
   */
  startMonitoring() {
    console.log('🔄 Starting continuous workflow monitoring...');
    
    // Initial status check
    this.generateStatusReport();
    
    // Set up periodic monitoring
    this.intervals.statusCheck = setInterval(() => {
      this.generateStatusReport().catch(error => {
        console.error('❌ Error in monitoring cycle:', error);
      });
    }, this.monitorInterval);

    // Monitor for shutdown signals
    process.on('SIGTERM', () => {
      this.stopMonitoring();
    });

    process.on('SIGINT', () => {
      this.stopMonitoring();
    });
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    console.log('🛑 Stopping workflow monitoring...');
    
    Object.keys(this.intervals).forEach(key => {
      if (this.intervals[key]) {
        clearInterval(this.intervals[key]);
      }
    });
    
    console.log('✅ Monitoring stopped');
  }
}

// Initialize and start monitoring if run directly
if (require.main === module) {
  // Check if required environment variables are available
  if (!process.env.N8N_BASIC_AUTH_USER || !process.env.N8N_BASIC_AUTH_PASSWORD) {
    console.error('❌ Missing required environment variables for n8n authentication');
    console.error('   Please set N8N_BASIC_AUTH_USER and N8N_BASIC_AUTH_PASSWORD');
    process.exit(1);
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Missing required Supabase environment variables');
    process.exit(1);
  }

  const monitor = new WorkflowMonitor();
  monitor.startMonitoring();
}

module.exports = WorkflowMonitor;