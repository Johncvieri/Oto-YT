@echo off
echo YouTube Shorts Automation System
echo ===============================

echo Checking dependencies...
node --version
if %errorlevel% neq 0 (
  echo Node.js is not installed or not in PATH
  pause
  exit /b 1
)

echo.
echo Verifying required packages...
node -e "require('fluent-ffmpeg'); require('ffmpeg-static'); require('google-tts-api'); console.log('All dependencies OK')"
if %errorlevel% neq 0 (
  echo Installing dependencies...
  npm install
)

echo.
echo To run the automation:
echo 1. Make sure n8n is installed (npm install -g n8n)
echo 2. Run: n8n
echo 3. Import the workflow file: youtube_automation_final.json
echo 4. Configure credentials as described in README.md
echo.

pause