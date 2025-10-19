# YouTube Shorts Automation System (Source-Based Analysis)

This project automates the creation of YouTube Shorts by analyzing trending content from reliable sources (YouTube, TikTok, etc.) with global audience targeting. The system works by identifying trending videos, creating educational analysis, and uploading insights while maintaining monetization safety.

## 🚀 Deployment Options

### Railway Deployment (Recommended)
Easiest way to get started with a one-click deployment:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/your-repo/your-project)

For detailed Railway deployment instructions, see [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

### Docker Deployment
Build and run locally or on any container platform:

```bash
docker build -t youtube-automation .
docker run -p 5678:5678 -e GEMINI_API_KEY=your_key -e SUPABASE_URL=your_url -e SUPABASE_KEY=your_key youtube-automation
```

### Local Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Install n8n globally: `npm install -g n8n`
4. Set up your `.env` file with all required credentials
5. Start the service: `n8n`

## System Components

### 1. Global Trend Analysis
- Fetches trending content from YouTube API and RSS feeds
- Selects videos with high potential (views, engagement, recency)
- Calculates relevance for different audiences

### 2. Content Transformation Engine
- Uses trending videos as **educational examples** (not entertainment)  
- Creates **original analysis and commentary** from source material
- Applies **fair use principles** with commentary and educational value
- Ensures **monetization safety** through educational approach

### 3. Template-Based Processing (Resource Efficient)
- Uses pre-made templates for efficient processing
- Adds **original overlays and commentary** to source clips
- Maintains **resource efficiency** for free tier compatibility
- Applies **educational context** to trending content

### 4. Auto-Retry Upload System (No Limit)
- Rotates 3 YouTube accounts (1-3) sequentially
- Uploads with educational titles and descriptions
- Implements exponential backoff retry: 10s, 30s, 60s, then 5min interval

### 5. Regional Adaptation & Analytics
- Collects performance metrics after 24 hours
- Determines `region_dominant` from countries with ≥40% of total views
- Calculates `viral_index = (views / 1000) + (likes * 0.5) + (watch_time / 300)`
- Marks winning content (`is_winning = TRUE`) for future style replication

### 6. Cross-Language Comment Analysis
- Fetches top 100 comments from each video
- Auto-detects languages and translates non-English/Indonesian content using OpenAI
- Performs sentiment analysis (positive/neutral/negative)
- Identifies preferred regions from positive comment patterns

### 7. Daily Automated Cycle (Source-Based)
- Runs trend analysis and source selection once daily
- Selects appropriate trending content based on category
- Applies educational transformation to source content
- Stores all logs in Supabase database
- Sends Telegram notifications on successful uploads

## Workflow Specifics

### Workflow 1: Insight from Media (`youtube_automation_source.json`)
- Focus: Film, Kartun, Anime analysis
- Source: YouTube trending videos with entertainment content
- Approach: Educational analysis from entertainment content
- Schedule: Daily at 12:00 WIB

### Workflow 2: Game Insights (`youtube_automation_game.json`) 
- Focus: Gaming content analysis
- Source: YouTube trending game videos
- Approach: Tips and insights from gaming content
- Schedule: Daily at 12:00 WIB

### Workflow 3: Trend Analysis (`youtube_automation_trend.json`)
- Focus: General trend analysis
- Source: General YouTube trending content
- Approach: Social phenomenon and trend analysis
- Schedule: Daily at 12:00 WIB

## Configuration

### Environment Variables
Copy `.env` and update with your actual credentials:

```bash
YOUTUBE_API_1=your_youtube_api_key_1
YOUTUBE_CHANNEL_1=your_youtube_channel_url_1
YOUTUBE_API_2=your_youtube_api_key_2
YOUTUBE_CHANNEL_2=your_youtube_channel_url_2
YOUTUBE_API_3=your_youtube_api_key_3
YOUTUBE_CHANNEL_3=your_youtube_channel_url_3
GEMINI_API_KEY=your_gemini_api_key  # For AI content analysis and generation
TELEGRAM_API_KEY=your_telegram_bot_api_key
TELEGRAM_CHAT_ID=your_telegram_chat_id
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

### Credentials Setup in n8n
You need to set up these credentials in n8n:
1. Supabase Postgres account
2. YouTube Account1, Account2, Account3
3. Telegram Bot

## Database Schema

The system requires multiple tables for complete functionality:

### video_engagement table:
```sql
CREATE TABLE video_engagement (
  video_id TEXT PRIMARY KEY,
  account TEXT,
  title TEXT,
  description TEXT,
  tags TEXT,
  trending_topic TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  watch_time INTEGER DEFAULT 0,
  upload_time TIMESTAMP DEFAULT NOW(),
  region_dominant TEXT,
  viral_index REAL GENERATED ALWAYS AS ((views / 1000.0) + (likes * 0.5) + (watch_time / 300.0)) STORED,
  is_winning BOOLEAN DEFAULT FALSE,
  next_recommendation TEXT
);
```

### trend_logs table:
```sql
CREATE TABLE trend_logs (
  id SERIAL PRIMARY KEY,
  topic TEXT,
  trend_score REAL,
  region_relevance REAL,
  region_dominant TEXT,
  fetched_at TIMESTAMP DEFAULT NOW()
);
```

### scripts table:
```sql
CREATE TABLE scripts (
  id SERIAL PRIMARY KEY,
  content TEXT,
  language_primary TEXT,
  language_secondary TEXT,
  topic TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### upload_logs table:
```sql
CREATE TABLE upload_logs (
  id SERIAL PRIMARY KEY,
  video_id TEXT,
  account TEXT,
  title TEXT,
  language TEXT,
  region_target TEXT,
  video_url TEXT,
  upload_time TIMESTAMP DEFAULT NOW()
);
```

### comment_sentiment table:
```sql
CREATE TABLE comment_sentiment (
  id SERIAL PRIMARY KEY,
  video_id TEXT,
  language TEXT,
  original_text TEXT,
  translated_text TEXT,
  sentiment TEXT, -- positive, neutral, negative
  region_origin TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Project Structure

The system follows this directory structure:
```
Youtube-Otomatisasi/
├── assets/                 # Template videos for processing
│   ├── Life_Lesson_Template.mp4
│   ├── Game_Insight_Template.mp4
│   ├── Trend_Analysis_Template.mp4
│   └── ... (other template files)
├── temp/                   # Temporary files during processing
├── upload/                 # Final videos ready for upload
├── .env                    # Environment variables
├── package.json            # Project dependencies
├── youtube_automation_source.json   # Media insight workflow
├── youtube_automation_game.json     # Game insight workflow  
├── youtube_automation_trend.json    # General trend workflow
├── workflow-selector.sh    # Script to choose between workflows
├── workflow-selector.bat   # Windows version of workflow selector
├── README.md               # This file
├── PRODUCTION.md           # Production deployment guide
├── app_summary.md          # System requirements
├── test.js                 # Comprehensive test file
├── index.js                # Main entry point
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose configuration
├── docker-compose.yml          # Docker Compose configuration
├── .nvmrc                  # Node version specification
└── start.bat               # Startup script
```

## Free Tier Compatible Approach

✅ **Source-Based with Educational Value**: Instead of simple reuploads, the system creates educational analysis of trending content, which is safer for monetization.

✅ **Resource Efficient**: Uses templates and minimal processing to stay within free tier limits.

✅ **Fair Use Compliance**: Applies commentary and educational context to trending clips rather than entertainment-only reuploads.

✅ **Multiple Workflows**: Separate workflows for different content categories to maintain thematic consistency.

✅ **Optimized Frequency**: Reduced to 1 video per account per day to minimize resource usage while maintaining consistent output.

## Local Development Setup

1. Install dependencies: `npm install`
2. Set up your `.env` file with appropriate credentials
3. Ensure all required directories exist (automatically created by setup)
4. Set up n8n credentials
5. Import the appropriate workflow:
   - For media content: `youtube_automation_source.json`
   - For game content: `youtube_automation_game.json`
   - For general trends: `youtube_automation_trend.json`
6. Activate the workflow - it will run once daily at 12:00 WIB
7. Run tests: `npm test`

## Running with Docker (Recommended for Production)

1. Make sure Docker and Docker Compose are installed
2. Set up your `.env` file with all required credentials
3. Run the service:
```bash
docker-compose up -d
```

The n8n interface will be available at `http://localhost:5678`

## Production Deployment

### Deploy to Cloud Platforms

#### Using Docker
```bash
# Build and run with Docker
docker build -t youtube-automation .
docker run -d --env-file .env -p 5678:5678 --name youtube-automation youtube-automation
```

#### Using Docker Compose
```bash
# Run with docker-compose (recommended)
docker-compose up -d --build
```

### Docker Compose Deployment (Free Tier Compatible)

For source-based analysis workflow (optimized for limited resources):
```bash
docker-compose up -d --build
```

## Assets Directory

For template workflow, the system uses these MP4 files:
```
assets/
├── Life_Lesson_Template.mp4
├── Game_Insight_Template.mp4
├── Trend_Analysis_Template.mp4
├── Quick_Insight_Template.mp4
├── Gaming_Analysis_Template.mp4
├── Quick_Viral_Insight_Template.mp4
├── Trend_Education_Template.mp4
└── Social_Phenomenon_Template.mp4
```

## Testing

Run the comprehensive test suite:
```bash
npm test
```

For health check:
```bash
npm run health
```

## Free Tier Deployment Guide

✅ **Good News**: The source-based workflow with template processing is designed to work better on resource-limited environments like free tiers, with only 1 video upload per account per day.

### Requirements for Source-Based Workflow:
1. Template video files in the `assets/` directory
2. Valid YouTube, Supabase, and other API credentials
3. Minimal CPU/RAM requirements (compared to full AI workflow)
4. Internet connection for API calls and uploads

### Steps:
1. Ensure you have all required template files in `assets/` directory
2. Configure your `.env` with all necessary credentials
3. Import appropriate workflow files into n8n based on content category
4. Deploy using Docker Compose:
   ```bash
   docker-compose up -d --build
   ```

### Important Considerations:
- With daily uploads per account, resource usage is minimized for free tier compatibility
- The 1-upload-per-day-per-account schedule is specifically optimized for free tier limitations
- Monitor resource usage to avoid timeouts

## AI Enhancement Features

This system now includes AI-powered enhancements using Google Gemini API to:

- **Analyze trending content** for viral potential and engagement
- **Generate educational narratives** that add value to source content
- **Select optimal templates** based on content type and emotional tone
- **Create engaging titles and descriptions** that maximize views
- **Assess engagement potential** before publishing

### AI Helper Functions

The system includes an `ai-helper.js` module with these capabilities:
- `analyzeVideoClip()` - Analyzes video content for viral potential
- `generateEducationalNarrative()` - Creates educational content from source material
- `generateEngagingTitleDescription()` - Creates click-worthy content
- `selectBestTemplate()` - Recommends optimal video templates
- `analyzeEngagementPotential()` - Predicts engagement metrics

## Security Considerations

- Store API keys securely in environment variables
- Don't commit `.env` file to version control
- Use strong passwords for n8n basic auth in production
- Regularly rotate API keys
- Monitor logs for security events
- Use HTTPS in production deployments

## GitHub Integration

This system includes comprehensive GitHub integration for deployment, versioning, configuration management, and advanced integration with external services as described in the `GITHUB_INTEGRATION.md` file.

### Features

1. **Automated Deployments**: CI/CD pipeline with automated testing and deployment
2. **Version Control**: All configurations and templates stored in Git repository
3. **Configuration Management**: Non-sensitive configs stored in GitHub, sensitive data in secrets
4. **Service Integration**: Enhanced integration with Supabase and Google Gemini via GitHub API
5. **Backup & Recovery**: Git repository as backup source for configurations
6. **Change Tracking**: Comprehensive history of system modifications

### GitHub-Specific Commands

- `npm run github:setup` - Initialize GitHub integration
- `npm run github:sync-config` - Sync configurations with GitHub
- `npm run github:sync-services` - Sync with Supabase and Gemini services via GitHub API
- `npm run github:backup` - Create backup and push to GitHub
- `npm run github:version` - Create new version tag

### Workflow Integration

The system includes a GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that:
- Runs tests on multiple Node.js versions
- Builds and tests Docker containers
- Integrates with Supabase and Gemini using GitHub API
- Deploys to production when main branch is updated
- Provides notifications on deployment status

### GitHub API Integration

The system now supports advanced integration with GitHub API to enable:
- Automated schema synchronization between GitHub and Supabase
- AI-powered code analysis using Gemini through GitHub API
- Enhanced security scanning using both GitHub and Gemini APIs
- Automated documentation generation from code changes

For complete setup instructions, see `GITHUB_INTEGRATION.md`.

<!-- Added for GitHub integration test -->