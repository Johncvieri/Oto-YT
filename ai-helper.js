// AI Helper for Gemini API
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
const visionModel = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// Function to generate content based on prompt
async function generateContent(prompt, options = {}) {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content with Gemini:', error.message);
    throw error;
  }
}

// Function to analyze video clip for viral potential
async function analyzeVideoClip(videoUrl, description) {
  const prompt = `
    Analyze this video content for viral potential. Consider:
    - What makes this content engaging?
    - What are the emotional hooks?
    - What would make viewers watch until the end?
    - What's the most "click-worthy" moment?
    
    Video description: ${description}
    
    Based on this analysis, suggest:
    1. The best 5-15 second clip to highlight
    2. An engaging title for this clip
    3. A hook line that would make people want to watch
    4. Why this content has viral potential
  `;
  
  return await generateContent(prompt);
}

// Function to generate educational narrative from source content
async function generateEducationalNarrative(sourceContent, topic) {
  const prompt = `
    Create an educational narrative that transforms this source content into valuable insights.
    Focus on educational value rather than pure entertainment.
    
    Source content: ${sourceContent}
    Topic: ${topic}
    
    Generate:
    1. An educational title (not clickbait)
    2. A 30-second educational script that:
       - Explains the lesson/insight from this content
       - Provides value beyond the original content
       - Uses educational language
    3. Key takeaway points
  `;
  
  return await generateContent(prompt);
}

// Function to generate click-worthy title and description
async function generateEngagingTitleDescription(contentSummary) {
  const prompt = `
    Create an engaging title and description for YouTube Shorts that will maximize views and engagement.
    
    Content summary: ${contentSummary}
    
    Generate:
    1. A click-worthy title (under 100 characters)
    2. An engaging description (under 500 characters)
    3. 5 relevant hashtags
    4. Call-to-action to increase engagement
  `;
  
  return await generateContent(prompt);
}

// Function to select best template based on content
async function selectBestTemplate(contentType, emotionalTone, duration) {
  const prompt = `
    Based on these content parameters, recommend the best video template:
    
    Content type: ${contentType}
    Emotional tone: ${emotionalTone}
    Duration: ${duration}
    
    Choose from these templates:
    - Life_Lesson_Template.mp4
    - Game_Insight_Template.mp4
    - Trend_Analysis_Template.mp4
    - Quick_Insight_Template.mp4
    - Gaming_Analysis_Template.mp4
    - Quick_Viral_Insight_Template.mp4
    - Trend_Education_Template.mp4
    - Social_Phenomenon_Template.mp4
    
    Explain why this template is best and what elements make it suitable.
  `;
  
  return await generateContent(prompt);
}

// Function to analyze engagement potential
async function analyzeEngagementPotential(videoContent) {
  const prompt = `
    Analyze this video content's potential for engagement (views, likes, comments).
    
    Video content: ${videoContent}
    
    Rate on a scale of 1-10:
    - Viral potential (1-10)
    - Emotional impact (1-10)
    - Shareability (1-10)
    - Comment potential (1-10)
    
    Also provide suggestions to improve engagement if score is below 7.
  `;
  
  return await generateContent(prompt);
}

module.exports = {
  generateContent,
  analyzeVideoClip,
  generateEducationalNarrative,
  generateEngagingTitleDescription,
  selectBestTemplate,
  analyzeEngagementPotential
};