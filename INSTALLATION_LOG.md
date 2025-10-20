# Railway Deployment and Dependency Installation Guide for Oto-YT Project

This document outlines the installation of dependencies and configuration for the Oto-YT project, optimized for Railway deployment and Windows systems with limited specifications (2GHz CPU, 4GB RAM).

## Installation Process Completed

As of 2025-10-20, the following has been completed:

### 1. Project Configuration Files Created/Updated
- package.json: Updated with Railway-compatible scripts and memory optimization flags
- .env: Created with default values and low-spec optimizations
- railway.json: Configuration file for Railway deployment
- .dockerignore: Removed (no longer needed)
- start-monitoring.js: Enhanced startup script with unified configuration
- railway-direct-start.js: Direct n8n startup for Railway
- unified-config.js: Centralized configuration system

### 2. Project Configuration Files Updated
- package.json: Removed Docker-related scripts and updated for Railway deployment
- .env: Created with default values and low-spec optimizations
- README.md: Updated with instructions for Railway deployment

### 3. Setup Scripts Updated
- setup.bat: Batch script updated for Railway deployment
- setup.ps1: PowerShell script updated for Railway deployment
- Both scripts include memory-optimized installation commands

### 4. Documentation Updated
- README.md: Updated for Railway-focused deployment
- PROJECT_ANALYSIS.md: Tracking document for work completed on the project

## Railway Deployment Requirements

For Railway deployment on your system (2GHz CPU, 4GB RAM):

1. **System Requirements:**
   - Node.js 18+ installed
   - Git for Windows (for repository management)
   - Railway CLI (optional, for local management)

2. **Configuration:**
   - Memory limit: Configured in application for low usage
   - Environment variables: Set according to Railway requirements
   - Port binding: Configured to use Railway-provided PORT variable

## Optimized Installation Commands

The setup has been configured with these optimizations:

```bash
# Memory-optimized dependency installation
npm ci --max-old-space-size=1024

# Memory-optimized n8n startup for Railway
node start-monitoring.js
```

## Current Status

- [x] Railway configuration files created and optimized
- [x] Memory and resource limits implemented
- [x] Low-spec Windows setup scripts created
- [x] Environment variables configured for low-spec operation
- [x] Documentation updated for installation and deployment
- [x] Railway deployment configuration implemented

## Next Steps

To complete the setup on your system:

1. Ensure Node.js 18+ is installed
2. Run either `setup.bat` (as Administrator) or `./setup.ps1` (as Administrator)
3. Follow the instructions in README.md to start the application

## Railway Deployment Ready

The application is configured for deployment to:
https://oto-yt-production.up.railway.app/

The executor.js script will:
- Push changes to the repository
- Monitor the live deployment status
- Verify that the site shows auth page (not setup page)
- Monitor workflow status to ensure they are running