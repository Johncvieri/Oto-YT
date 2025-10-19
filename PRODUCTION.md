## Production Environment Configuration

## Environment Variables for Production

### Required Variables
```
# YouTube API Keys and Channels (3 accounts for rotation)
YOUTUBE_API_1=your_youtube_api_key_1
YOUTUBE_CHANNEL_1=your_youtube_channel_url_1
YOUTUBE_API_2=your_youtube_api_key_2
YOUTUBE_CHANNEL_2=your_youtube_channel_url_2
YOUTUBE_API_3=your_youtube_api_key_3
YOUTUBE_CHANNEL_3=your_youtube_channel_url_3

# Google Gemini API for comment analysis and content generation
GEMINI_API_KEY=your_gemini_api_key

# Supabase for database and storage
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Telegram for notifications
TELEGRAM_API_KEY=your_telegram_bot_api_key
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

### Optional Variables
```
# For production environment
NODE_ENV=production

# For n8n workflow
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_secure_password

# Timezone for cron jobs
TZ=Asia/Jakarta
```

## Production Deployment Steps

1. Set up your hosting environment (e.g., Railway, AWS, GCP)
2. Clone the repository
3. Install dependencies: `npm install`
4. Set environment variables as shown above
5. Set up n8n credentials as described in README.md
6. Import the appropriate workflow:
   - For media insights: `n8n import:workflow --input=youtube_automation_source.json`
   - For game insights: `n8n import:workflow --input=youtube_automation_game.json`
   - For trend analysis: `n8n import:workflow --input=youtube_automation_trend.json`
7. Start the service: `n8n`

## Health Check Commands

- Check system status: `npm run health`

## Resource Requirements

### For Source-Based Analysis Workflow (Recommended for Resource-Limited Environments):
- Disk space: Minimum 2GB free space
- Memory: At least 1GB RAM
- CPU: 1-2 cores sufficient (using template-based processing)
- Network: Stable connection for API calls and uploads

### For Full Processing Workflow:
- Disk space: Minimum 5GB free space for video processing
- Memory: At least 2GB RAM for video processing
- CPU: Multi-core recommended for faster video encoding
- Network: Stable connection for API calls and uploads

## Security Considerations

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Implement proper error handling without exposing secrets
- Regularly rotate API keys
- Use HTTPS for all API communications

## Monetization Safety Guidelines

- All content should provide educational value, not just entertainment
- Use fair use approach with commentary and analysis
- Avoid reuploading full copyrighted content
- Focus on transformational content from source material
- Implement proper attribution where applicable