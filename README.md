# YouTube Automation (Oto-YT) for Low-Spec Windows Systems

This project is optimized for deployment on low-spec systems such as Windows laptops with 2GHz CPU and 4GB RAM.

## Prerequisites for Windows (Low-Spec)

- Windows 10/11 (64-bit)
- Node.js 18+ (with limited memory usage)
- At least 2GB free disk space
- Stable internet connection

## Quick Setup for Windows (Recommended)

### Option 1: Automatic Setup Script (Batch)
```cmd
# Run as Administrator
setup.bat
```

### Option 2: Automatic Setup Script (PowerShell)
```powershell
# Run as Administrator
./setup.ps1
```

## Manual Setup Steps

1. **Clone the repository:**
   ```cmd
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install Node.js dependencies with memory limits:**
   ```cmd
   npm ci --max-old-space-size=1024
   ```

3. **Create .env file with necessary configurations:**
   ```cmd
   # Copy the template
   copy .env.template .env
   # Then edit .env with your actual credentials
   ```

4. **(Optional) For local development, you can install n8n globally:**
   - npm install -g n8n

## Running the Application

### For Local Development (Limited Resources):
```cmd
npm run n8n -- --max-old-space-size=512
```

### For Railway Deployment:
```cmd
npm start
```

### For direct n8n start:
```cmd
npm run start:direct
```

## Configuration for Railway Deployment

This project is configured for Railway deployment with these environment variables:
- `N8N_BASIC_AUTH_USER`: Username for n8n authentication
- `N8N_BASIC_AUTH_PASSWORD`: Password for n8n authentication
- `N8N_ENCRYPTION_KEY`: Encryption key for credentials
- `SUPABASE_URL` and `SUPABASE_ANON_KEY`: Supabase database connection
- `GITHUB_TOKEN`: GitHub personal access token
- `YOUTUBE_API_KEY`: YouTube API key
- `GEMINI_API_KEY`: Google Gemini API key

## Resource Optimizations

This project includes several optimizations for low-spec systems:
1. Memory limits in all Node.js configurations
2. SQLite database instead of PostgreSQL for lower resource usage
3. Limited background processes
4. Optimized n8n configuration with efficient memory usage
5. Disabled non-essential services and telemetry

## Troubleshooting for Low-Spec Systems

- Use `npm run n8n -- --max-old-space-size=512` to limit memory usage
- Monitor system resources using Windows Task Manager
- If experiencing memory issues, adjust the max-old-space-size parameter
- For Railway deployment, ensure environment variables are properly configured

## Monitoring Resource Usage

The application includes monitoring capabilities via the executor.js script which:
- Monitors the n8n workflow status
- Checks the live deployment status
- Automatically pushes updates to the repository
- Runs with optimized memory usage settings

## Railway Deployment

The application automatically deploys to Railway after git push at: https://oto-yt-production.up.railway.app/

For local Railway access:
```cmd
railway link -p 15b9723a-aa56-4e25-92fb-c435fac78885
```