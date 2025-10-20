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
    
    // Determine the correct n8n URL
    this.n8nUrl = this.getAppUrl();
    
    // Set up authentication
    this.n8nAuth = {
      username: process.env.N8N_BASIC_AUTH_USER,
      password: process.env.N8N_BASIC_AUTH_PASSWORD
    };
    
    this.monitorInterval = 300000; // 5 minutes
    this.intervals = {};
  }

  /**
   * Determine the correct app URL
   */
  getAppUrl() {
    if (process.env.RAILWAY_PUBLIC_HOST) {
      return `https://${process.env.RAILWAY_PUBLIC_HOST}`;
    } else if (process.env.HEROKU_APP_NAME) {
      return `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`;
    } else if (process.env.WEBHOOK_URL) {
      return process.env.WEBHOOK_URL;
    } else if (process.env.N8N_ROOT_URL) {
      return process.env.N8N_ROOT_URL;
    } else {
      // Fallback - this might not work in cloud environment
      const port = process.env.PORT || '5678';
      return `http://localhost:${port}`;
    }
  }

  /**
   * Check n8n workflow executions
   */
  async checkWorkflowExecutions() {
    try {
      // Use the correct authentication method for n8n API
      const auth = {
        username: this.n8nAuth.username,
        password: this.n8nAuth.password
      };
      
      const response = await axios.get(`${this.n8nUrl}/rest/executions`, {
        auth: auth,
        timeout: 15000, // Increased timeout
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
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
        error: `n8n API error: ${error.message}`,
        details: error.response ? error.response.status : 'no-response'
      };
    }
  }

  /**
   * Check workflow definitions
   */
  async checkWorkflowDefinitions() {
    try {
      const auth = {
        username: this.n8nAuth.username,
        password: this.n8nAuth.password
      };
      
      const response = await axios.get(`${this.n8nUrl}/rest/workflows`, {
        auth: auth,
        timeout: 15000, // Increased timeout
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
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
        error: `Workflow definitions error: ${error.message}`,
        details: error.response ? error.response.status : 'no-response'
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
          console.log('ℹ️ workflow_monitoring table does not exist - this is normal for new deployments');
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
      const response = await axios.get(`${this.n8nUrl}/healthz`, {
        timeout: 15000, // Increased timeout
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        health: response.data
      };
    } catch (error) {
      // If health check endpoint doesn't exist, check basic connectivity
      try {
        const response = await axios.get(this.n8nUrl, {
          timeout: 10000,
          headers: {
            'Accept': 'text/html,application/json'
          }
        });
        
        return {
          success: true,
          health: {
            overall: 'partially_available',
            message: 'Basic connectivity OK but health endpoint not available',
            timestamp: new Date().toISOString()
          }
        };
      } catch (fallbackError) {
        return {
          success: false,
          error: `Health check error: ${error.message}`
        };
      }
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
      n8nUrl: this.n8nUrl,
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
        db_monitoring: dbStatus.exists,
        url: this.n8nUrl
      }
    };

    console.log('📊 Status Report Generated:');
    console.log(`   n8n URL: ${this.n8nUrl}`);
    console.log(`   Overall Status: ${report.summary.n8n_status}`);
    console.log(`   Workflows Configured: ${report.summary.workflow_count}`);
    console.log(`   Recent Executions: ${report.summary.recent_executions}`);
    console.log(`   DB Monitoring: ${report.summary.db_monitoring ? 'Enabled' : 'Disabled'}`);
    
    if (executions.success) {
      console.log('✅ n8n executions API accessible');
    } else {
      console.log(`❌ n8n executions API: ${executions.error} (${executions.details || 'unknown'})`);
    }
    
    if (definitions.success) {
      console.log('✅ n8n workflows API accessible');
    } else {
      console.log(`❌ n8n workflows API: ${definitions.error} (${definitions.details || 'unknown'})`);
    }
    
    if (health.success) {
      console.log('✅ System health check passed');
    } else {
      console.log(`❌ System health check: ${health.error}`);
    }
    
    return report;
  }

  /**
   * Continuous monitoring
   */
  startMonitoring() {
    console.log('🔄 Starting continuous workflow monitoring...');
    console.log(`   Monitoring URL: ${this.n8nUrl}`);
    
    // Initial status check
    this.generateStatusReport().catch(error => {
      console.error('❌ Initial status check failed:', error.message);
    });
    
    // Set up periodic monitoring
    this.intervals.statusCheck = setInterval(() => {
      this.generateStatusReport().catch(error => {
        console.error('❌ Error in monitoring cycle:', error.message);
        console.error('   This could be due to n8n still starting up or network issues');
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
    console.warn('⚠️ Missing n8n authentication variables - monitoring may not work properly');
    console.warn('   Please set N8N_BASIC_AUTH_USER and N8N_BASIC_AUTH_PASSWORD');
    // Don't exit, but warn that monitoring may fail
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️ Missing Supabase variables - database monitoring may not work properly');
    // Don't exit, but warn that database monitoring may fail
  }

  try {
    const monitor = new WorkflowMonitor();
    monitor.startMonitoring();
  } catch (error) {
    console.error('❌ Failed to initialize monitor:', error.message);
    process.exit(1);
  }
}

module.exports = WorkflowMonitor;