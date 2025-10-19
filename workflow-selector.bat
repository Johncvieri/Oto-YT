@echo off
REM Workflow Selector Script for Windows
REM Use this script to select between different workflow configurations

echo ==========================================================
echo YouTube Automation System - Workflow Selector
echo ==========================================================
echo.
echo Choose your workflow configuration:
echo.
echo 1) Source-Based Analysis (youtube_automation_source.json)
echo    - Analyzes trending media content (film/kartun/anime)
echo    - Creates educational insights from source content
echo    - Free tier compatible with educational approach
echo.
echo 2) Game Insights (youtube_automation_game.json)
echo    - Analyzes trending game content
echo    - Creates gaming tips and insights
echo    - Free tier compatible with educational approach
echo.
echo 3) General Trend Analysis (youtube_automation_trend.json)
echo    - Analyzes general trending content
echo    - Creates social phenomenon analysis
echo    - Free tier compatible with educational approach
echo.
echo ==========================================================
set /p choice="Enter your choice (1, 2, or 3): "

if "%choice%"=="1" (
    echo Selected: Source-Based Analysis (Media)
    echo This workflow analyzes trending media content with educational value.
    echo Workflow file: youtube_automation_source.json
) else if "%choice%"=="2" (
    echo Selected: Game Insights
    echo This workflow analyzes trending game content with educational value.
    echo Workflow file: youtube_automation_game.json
) else if "%choice%"=="3" (
    echo Selected: General Trend Analysis
    echo This workflow analyzes general trends with educational value.
    echo Workflow file: youtube_automation_trend.json
) else (
    echo Invalid choice. Please run the script again and select 1, 2, or 3.
    pause
    exit /b 1
)

echo.
echo Next steps:
echo 1. Make sure n8n is installed: npm install -g n8n
echo 2. Configure your credentials as described in README.md
echo 3. Import the selected workflow file into n8n:
echo    n8n import:workflow --input=^<selected_workflow_file^>
echo 4. Start n8n: n8n
echo.
echo For Docker Compose deployment, see README.md
pause