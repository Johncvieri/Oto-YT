# GitHub-Supabase Security Guidelines

This document outlines the security measures implemented to prevent sensitive data from being stored in GitHub while maintaining the collaboration between GitHub and Supabase.

## Data Classification

### ✅ Safe to Store in GitHub
- Workflow configuration files (n8n JSON files)
- Template files (video templates, image templates)
- AI prompts and scripts
- ETL processing algorithms
- Non-sensitive configuration values
- Versioned snapshots of processed data (with sensitive info redacted)
- Documentation and README files

### ❌ NEVER Store in GitHub
- API keys, tokens, secrets
- Passwords or authentication credentials
- Private user data (emails, personal info)
- Raw comment data with personal information
- Financial information
- Complete database dumps with sensitive data
- Environment configuration with sensitive variables

## Security Measures Implemented

1. **Data Redaction**: All backup scripts automatically redact sensitive information before storing in GitHub
2. **Validation Checks**: GitHub Actions workflows validate that no sensitive patterns exist in files
3. **Access Controls**: Use of Supabase service role key only in secure CI/CD environment
4. **Auditing**: All changes are tracked through Git history for audit purposes

## Implementation Details

### Backup Script Security
- The backup script (`github/scripts/backup-data.js`) redacts sensitive values
- Configuration values containing "key", "secret", "password", or "api" are replaced with "[REDACTED]"
- Only non-sensitive data from Supabase tables is included in backups

### Pipeline Security
- GitHub Actions use environment secrets (never plain text)
- Validation steps check for sensitive data patterns
- Service role key is only used in the secure CI/CD environment

## Safe Data Flow
GitHub (Version Control) ←→ Secure Processing ←→ Supabase (Runtime Database)

Data moves from Supabase to GitHub only after sensitive information is removed.
Data moves from GitHub to Supabase only for configuration and processing scripts.