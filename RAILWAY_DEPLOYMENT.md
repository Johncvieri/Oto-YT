# Railway Deployment Guide for YouTube Automation System

This guide explains how to deploy your YouTube automation system to Railway.

## Prerequisites

1. **Railway Account**: Create an account at [https://railway.app](https://railway.app)
2. **GitHub Account**: Your project should be hosted on GitHub
3. **Railway CLI (Optional)**: Install with `npm install -g @railway/cli`

## Deployment Steps

### 1. Connect Your GitHub Repository

1. Log in to Railway dashboard
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository with the YouTube automation system

### 2. Set Environment Variables

After connecting your repository, go to the "Variables" section and add all required environment variables:

#### Required Variables:
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

#### Optional Variables (for Production):
```
# For production environment
NODE_ENV=production

# For n8n workflow
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=your_secure_password

# Timezone for cron jobs
TZ=Asia/Jakarta
```

### 3. Configure the Deployment

The project includes a `railway.json` configuration file that sets up:
- CPU allocation: 1-2 cores
- Memory allocation: 1-2 GB RAM
- Auto-deploy on git changes
- Process restart policies

### 4. Deploy Your Application

1. Railway will automatically detect the `Dockerfile` in your repository
2. Click "Deploy Now" in the dashboard
3. Wait for the build to complete (this may take several minutes)

### 5. Post-Deployment Setup

After your application is deployed:

1. Access the n8n interface via your Railway deployment URL
2. Set up n8n credentials as described in the README
3. Import the appropriate workflow:
   - For media content: Upload `youtube_automation_source.json`
   - For game content: Upload `youtube_automation_game.json`
   - For trend content: Upload `youtube_automation_trend.json`

### 6. Importing Workflows

If you have workflow files locally:

1. SSH into your Railway deployment using the Railway CLI:
   ```
   railway ssh
   ```

2. Or upload your workflow files via the n8n UI at your Railway URL + `/workflow`

## Important Notes

- **Build Time**: The first deployment may take 5-10 minutes as it builds the Docker image with ffmpeg and other dependencies
- **Resource Usage**: The app is configured to use 1-2GB RAM due to the video processing requirements, but optimized to run only once daily per account to minimize resource consumption
- **Storage**: Railway ephemeral storage is limited, so consider using Supabase for persistent data
- **Process Limits**: Railway free tier has request timeout limits; the daily schedule helps manage these limitations effectively

## Troubleshooting

### Common Issues:

1. **"n8n command not found"**: The Dockerfile should install n8n properly, but if experiencing issues, check the build logs.

2. **Environment variables not loaded**: Make sure all required variables are set in the Railway dashboard under "Variables".

3. **Application crashes**: Check Railway logs in the dashboard for error messages.

### Viewing Logs:

1. In the Railway dashboard, go to your project
2. Click on the "Logs" tab to see real-time application logs
3. Look for any error messages that might indicate configuration issues

## Scaling Your Deployment

1. In the Railway dashboard, go to "Settings" → "Resources"
2. Adjust CPU and Memory allocation based on your workload
3. For heavy video processing, consider upgrading to a higher tier

## Health Checks

The application includes a health check script:
- Run `npm run health` to test the system status
- This can be used as a health check endpoint if needed

## Security Considerations

- Never commit API keys to version control
- Use Railway's environment variable system for all sensitive data
- The configuration enables basic auth for n8n by default
- Change the default username/password in production