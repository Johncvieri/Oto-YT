-- Table untuk monitoring workflow status
CREATE TABLE workflow_monitoring (
  id SERIAL PRIMARY KEY,
  workflow_name TEXT NOT NULL,
  status TEXT DEFAULT 'running', -- success, failed, running, warning
  start_time TIMESTAMP DEFAULT NOW(),
  end_time TIMESTAMP,
  duration_ms INTEGER,
  result_summary TEXT,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index untuk query monitoring
CREATE INDEX idx_workflow_monitoring_workflow_name ON workflow_monitoring(workflow_name);
CREATE INDEX idx_workflow_monitoring_created_at ON workflow_monitoring(created_at DESC);
CREATE INDEX idx_workflow_monitoring_status ON workflow_monitoring(status);

-- Table untuk stats harian
CREATE TABLE workflow_daily_stats (
  id SERIAL PRIMARY KEY,
  date DATE DEFAULT CURRENT_DATE,
  workflow_name TEXT NOT NULL,
  executions_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  avg_duration_ms REAL,
  last_execution TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(date, workflow_name)
);

-- Index untuk stats
CREATE INDEX idx_daily_stats_date ON workflow_daily_stats(date DESC);