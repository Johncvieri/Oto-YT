-- YouTube Automation System - Database Schema

-- Table for storing video engagement metrics and analytics
CREATE TABLE video_engagement (
  video_id TEXT PRIMARY KEY,
  account TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT,
  trending_topic TEXT,
  upload_time TIMESTAMP DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  watch_time INTEGER DEFAULT 0,  -- in seconds
  region_dominant TEXT,  -- primary region based on views
  viral_index REAL GENERATED ALWAYS AS ((views / 1000.0) + (likes * 0.5) + (watch_time / 300.0)) STORED,
  is_winning BOOLEAN DEFAULT FALSE,  -- TRUE if viral_index > 20
  next_recommendation TEXT,  -- AI-generated recommendation for next video
  last_checked TIMESTAMP DEFAULT NOW()
);

-- Index for faster query by account and upload time
CREATE INDEX idx_video_engagement_account_time ON video_engagement(account, upload_time DESC);

-- Table for storing trend analysis logs
CREATE TABLE trend_logs (
  id SERIAL PRIMARY KEY,
  topic TEXT NOT NULL,
  trend_score REAL NOT NULL,  -- 0-100 score
  region_relevance REAL,  -- 0-1 score for regional relevance
  region_dominant TEXT,  -- dominant region for this trend
  source TEXT,  -- where the trend came from (YouTube, TikTok, etc.)
  fetched_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster trend analysis
CREATE INDEX idx_trend_logs_fetched_at ON trend_logs(fetched_at DESC);

-- Table for storing generated scripts
CREATE TABLE scripts (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  language_primary TEXT NOT NULL,  -- primary language of script
  language_secondary TEXT,  -- secondary language for subtitles
  topic TEXT NOT NULL,  -- the trending topic this script is based on
  created_at TIMESTAMP DEFAULT NOW(),
  used_in_video_id TEXT REFERENCES video_engagement(video_id)  -- when script is used
);

-- Table for storing video upload logs
CREATE TABLE upload_logs (
  id SERIAL PRIMARY KEY,
  video_id TEXT REFERENCES video_engagement(video_id),
  account TEXT NOT NULL,  -- which YouTube account was used
  title TEXT NOT NULL,
  language TEXT NOT NULL,  -- primary language of the video
  region_target TEXT,  -- target region for this upload
  video_url TEXT,  -- direct link to uploaded video
  upload_status TEXT DEFAULT 'pending',  -- pending, success, failed
  upload_time TIMESTAMP DEFAULT NOW(),
  upload_attempts INTEGER DEFAULT 0,
  failure_reason TEXT  -- if upload failed, why
);

-- Table for storing comment sentiment analysis
CREATE TABLE comment_sentiment (
  id SERIAL PRIMARY KEY,
  video_id TEXT REFERENCES video_engagement(video_id),
  comment_id TEXT,  -- unique identifier for the comment
  author_name TEXT,
  original_text TEXT,
  translated_text TEXT,  -- translation if original wasn't English/Indonesian
  sentiment TEXT NOT NULL,  -- 'positive', 'neutral', 'negative'
  language TEXT,  -- language of original comment
  region_origin TEXT,  -- estimated region of comment author
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster comment analysis
CREATE INDEX idx_comment_sentiment_video_sentiment ON comment_sentiment(video_id, sentiment);

-- Table for storing configuration settings
CREATE TABLE system_config (
  id SERIAL PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  config_value TEXT,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default configuration values
INSERT INTO system_config (config_key, config_value, description) VALUES
  ('trend_score_threshold', '60', 'Minimum trend score to pursue a topic'),
  ('region_relevance_threshold', '0.6', 'Minimum region relevance to create regional content'),
  ('viral_index_threshold', '20', 'Viral index threshold to mark content as winning'),
  ('retry_attempts', '10', 'Number of retry attempts for failed uploads'),
  ('comment_analysis_limit', '100', 'Maximum number of comments to analyze per video'),
  ('sentiment_positive_threshold', '60', 'Percentage of positive comments to adjust content strategy');

-- Function to update viral_index when engagement metrics change
-- Note: In PostgreSQL, we use triggers to update generated columns if needed
-- This is just an example of how to update the last_checked timestamp
CREATE OR REPLACE FUNCTION update_last_checked_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_checked = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_video_engagement_last_checked 
    BEFORE UPDATE ON video_engagement
    FOR EACH ROW
    EXECUTE FUNCTION update_last_checked_column();

-- Additional indexes for common queries
CREATE INDEX idx_video_engagement_region_dominant ON video_engagement(region_dominant);
CREATE INDEX idx_video_engagement_winning ON video_engagement(is_winning);
CREATE INDEX idx_video_engagement_viral_index ON video_engagement(viral_index DESC);