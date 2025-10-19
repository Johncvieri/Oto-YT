/**
 * YouTube Automation System with AI Enhancement - Main Entry Point
 * 
 * This serves as the main entry point for the system.
 * The actual automation runs through n8n workflows with AI-powered enhancements.
 * 
 * To run the system:
 * 1. Install n8n globally: npm install -g n8n
 * 2. Set up your environment variables in .env (including GEMINI_API_KEY)
 * 3. Configure n8n credentials as described in README.md
 * 4. Import the appropriate workflow:
 *    - For media content: n8n import:workflow --input=youtube_automation_source.json
 *    - For game content: n8n import:workflow --input=youtube_automation_game.json
 *    - For trend content: n8n import:workflow --input=youtube_automation_trend.json
 * 5. Start n8n: n8n
 */

console.log('YouTube Automation System with AI Enhancement');
console.log('================================================');
console.log('');
console.log('This system runs through n8n workflows with AI-powered content analysis.');
console.log('AI features powered by Google Gemini for better content selection and generation.');
console.log('');
console.log('To start the automation:');
console.log('1. Make sure all dependencies are installed: npm install');
console.log('2. Configure your .env file with all required credentials (including GEMINI_API_KEY)');
console.log('3. Install n8n globally: npm install -g n8n');
console.log('4. Set up n8n credentials');
console.log('5. Import workflow based on content type:');
console.log('   - Media content: n8n import:workflow --input=youtube_automation_source.json');
console.log('   - Game content: n8n import:workflow --input=youtube_automation_game.json');
console.log('   - Trend content: n8n import:workflow --input=youtube_automation_trend.json');
console.log('6. Start n8n: n8n');
console.log('');
console.log('For more information, check README.md and PRODUCTION.md');