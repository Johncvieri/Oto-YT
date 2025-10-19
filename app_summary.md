# AI YouTube Shorts Automation with GitHub Integration

**AI Executor** for YouTube Shorts creation, upload, and analysis with VIRAL QUALITY approach. Utilizes GitHub API integration for enhanced deployment, versioning, and configuration management. Targets trending content for 10,000+ views & 1,000+ likes in 24 hours using 3 accounts.

---

## 🔧 Configuration
Use `.env` variables:
- YouTube API keys & channels (3 accounts)
- Supabase URL & key
- Gemini API key
- Telegram API & chat ID
- GitHub API token (for automated deployments)

---

## 🔄 Core Workflows

### 1. Trend Discovery
- Monitor real-time YouTube/Twitter/TikTok trends (1-4h window)
- Target >100K views, >5K likes, high emotion triggers
- Save only viral_score > 85 content
- **GitHub Integration**: Store trend analysis configurations in GitHub for version control

### 2. Template Execution  
- Use top 3 premium templates from assets/
- Add overlays: arrows, highlights, text effects
- Extend to 60-70s for engagement
- Rotate templates across accounts
- **GitHub Integration**: Template configurations and metadata stored in GitHub repository

### 3. AI Enhancement (Gemini)
- Generate viral titles: "this is what happens when..."
- Create 3 deep insight points
- Add emotional hooks & compelling CTAs
- Boost with positive sentiment words
- **GitHub Integration**: AI prompt templates and configurations synced via GitHub

### 4. Multi-Account Upload
- **Account 1**: Daily trending analysis (12:00 WIB)
- **Account 2**: Daily trending analysis (12:00 WIB)  
- **Account 3**: Daily trending analysis (12:00 WIB)
- Different topics per account to avoid duplicates
- **GitHub Integration**: Account management configurations stored and versioned in GitHub

### 5. Performance Tracking
- Monitor each account every 1h for 6h
- Track: views, engagement, viral_index
- Pause underperforming accounts (engagement < 5%)
- Target: 1 account >10K views/day
- **GitHub Integration**: Performance metrics and configurations tracked via GitHub

### 6. Community Engagement
- Share to 2-3 groups when active
- Organic reach via personal network
- Avoid bot engagement, focus on genuine interaction
- **GitHub Integration**: Engagement strategies and templates managed through GitHub

### 7. GitHub Integration Workflows
- **Automated Deployments**: Use GitHub Actions for system updates
- **Version Control**: All configurations and templates in Git repository
- **CI/CD Pipeline**: Automated testing and deployment workflows
- **Configuration Management**: Store non-sensitive configs in GitHub
- **Backup & Recovery**: Git repository as backup source for configurations
- **Change Tracking**: Comprehensive history of system modifications

---

## 🎯 Objectives
- **Daily**: 10K+ views & 1K+ likes per successful account
- **Total**: 30K+ views & 3K+ likes across 3 accounts
- **Upload**: 1 video per account daily (max 3/day)
- **Strategy**: Premium execution per account, not quantity
- **Platform**: Free tier with 3-account risk distribution
- **Development**: GitHub-integrated CI/CD for reliable and scalable updates