# GitHub Integration for YouTube Automation System

This document explains how the YouTube Automation System integrates with GitHub for deployment, versioning, configuration management, and integration with external services like Supabase and Google Gemini.

## Features

### 1. Automated Deployments
- Continuous Integration/Continuous Deployment (CI/CD) pipeline
- Automatic testing on code changes
- Automated deployment to production on main branch updates

### 2. Version Control
- All configurations and templates stored in Git repository
- Complete history of system changes
- Ability to rollback to previous versions

### 3. Configuration Management
- Non-sensitive configurations stored in the repository
- Sensitive data (API keys) stored securely as GitHub Secrets
- Configuration synchronization across environments

### 4. Service Integration
- Integration with GitHub API for enhanced functionality
- Automated synchronization with Supabase database
- AI enhancement using Google Gemini API through GitHub API

### 5. Backup & Recovery
- Git repository serves as backup source for all configurations
- Automated backup process with daily schedule
- Easy recovery from any point in Git history

### 6. Change Tracking
- Comprehensive history of all system modifications
- Detailed commit messages for each change
- Version tagging for releases

## Setup Instructions

### 1. Repository Configuration
1. Create a new GitHub repository for your project
2. Push this codebase to your repository
3. Set up repository secrets in Settings > Secrets and variables

### 2. GitHub Secrets Required
Add these secrets to your GitHub repository:
- `YOUTUBE_API_1`, `YOUTUBE_API_2`, `YOUTUBE_API_3` - Your YouTube API keys
- `YOUTUBE_CHANNEL_1`, `YOUTUBE_CHANNEL_2`, `YOUTUBE_CHANNEL_3` - Your YouTube channel URLs
- `GEMINI_API_KEY` - Google Gemini API key
- `SUPABASE_URL`, `SUPABASE_KEY` - Supabase credentials
- `TELEGRAM_API_KEY`, `TELEGRAM_CHAT_ID` - Telegram credentials
- `GITHUB_API_KEY` - GitHub API key for integration with Supabase and Gemini
- `DEPLOY_KEY` - SSH key for deployment server (if applicable)
- `SERVER_HOST`, `SERVER_USER` - Server connection details (if applicable)

### 3. GitHub Environments
Create these environments in your repository settings:
- `development` - For testing changes before production
- `production` - For live deployment (only main branch)

## GitHub API Integration

### Purpose
The GitHub API key enables enhanced integration between your GitHub repository, Supabase database, and Google Gemini services. This allows for:

1. **Automated schema synchronization** between GitHub and Supabase
2. **AI-powered code analysis** using Gemini to review changes
3. **Enhanced security scanning** using both GitHub and Gemini APIs
4. **Automated documentation generation** from code changes

### Implementation
The GitHub Actions workflow includes steps that use the GitHub API to communicate with Supabase and Gemini services, allowing for advanced automation capabilities.

## GitHub Actions Workflows

The system includes a CI/CD workflow in `.github/workflows/ci-cd.yml` that:
1. Runs tests on multiple Node.js versions
2. Builds and tests on Railway nixpacks
3. Integrates with Supabase and Gemini using GitHub API
4. Deploys to production when main branch is updated

## Commands

The system includes npm scripts for GitHub operations:

- `npm run github:setup` - Initialize GitHub integration
- `npm run github:sync-config` - Sync configurations with GitHub
- `npm run github:backup` - Create backup and push to GitHub
- `npm run github:version` - Create new version tag

## Best Practices

1. **Never commit sensitive information** directly to the repository
2. **Use pull requests** for all changes to main branch
3. **Review code changes** before merging to production
4. **Test in development environment** before production deployment
5. **Monitor deployment logs** after each deployment
6. **Regularly rotate API keys** for security
7. **Use branch protection rules** for the main branch