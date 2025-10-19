/**
 * AI Helper for YouTube Automation - Gemini API Integration
 * 
 * This module provides AI-powered functionality for YouTube content automation,
 * including content analysis, title generation, and template selection.
 */

// --- Dependencies ---
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// --- Constants ---
const GEMINI_MODEL_NAME = "gemini-flash-latest";
const TEMPLATE_LIST = [
  "Life_Lesson_Template.mp4",
  "Game_Insight_Template.mp4", 
  "Trend_Analysis_Template.mp4",
  "Quick_Insight_Template.mp4",
  "Gaming_Analysis_Template.mp4",
  "Quick_Viral_Insight_Template.mp4",
  "Trend_Education_Template.mp4",
  "Social_Phenomenon_Template.mp4"
];

// --- AI Model Initialization ---
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn("Warning: GEMINI_API_KEY is not set. AI features will not work properly.");
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });
const visionModel = genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });

// --- Core Functions ---

/**
 * Generic function to generate content using Gemini API
 * @param {string} prompt - The prompt to send to the AI
 * @param {Object} options - Additional options for generation
 * @returns {Promise<string>} The generated content
 */
const generateContent = async (prompt, options = {}) => {
  try {
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content with Gemini:', error.message);
    throw error;
  }
};

/**
 * Analyze video clip for viral potential
 * @param {string} videoUrl - URL of the video to analyze
 * @param {string} description - Description of the video content
 * @returns {Promise<string>} Analysis results with suggestions
 */
const analyzeVideoClip = async (videoUrl, description) => {
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
};

/**
 * Generate educational narrative from source content
 * @param {string} sourceContent - The original content to transform
 * @param {string} topic - The topic of the content
 * @returns {Promise<string>} Educational narrative
 */
const generateEducationalNarrative = async (sourceContent, topic) => {
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
};

/**
 * Generate click-worthy title and description for YouTube Shorts
 * @param {string} contentSummary - Summary of the content
 * @returns {Promise<string>} Generated title, description and hashtags
 */
const generateEngagingTitleDescription = async (contentSummary) => {
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
};

/**
 * Select the best template based on content characteristics
 * @param {string} contentType - Type of content
 * @param {string} emotionalTone - Emotional tone of content
 * @param {string} duration - Duration of content
 * @returns {Promise<string>} Template recommendation
 */
const selectBestTemplate = async (contentType, emotionalTone, duration) => {
  const availableTemplates = TEMPLATE_LIST.join("\n- ");
  
  const prompt = `
Based on these content parameters, recommend the best video template:

Content type: ${contentType}
Emotional tone: ${emotionalTone}
Duration: ${duration}

Choose from these templates:
- ${availableTemplates}

Explain why this template is best and what elements make it suitable.
`;

  return await generateContent(prompt);
};

/**
 * Analyze engagement potential of content
 * @param {string} videoContent - Description of the video content
 * @returns {Promise<string>} Engagement potential analysis
 */
const analyzeEngagementPotential = async (videoContent) => {
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
};

// --- Module Exports ---
module.exports = {
  generateContent,
  analyzeVideoClip,
  generateEducationalNarrative,
  generateEngagingTitleDescription,
  selectBestTemplate,
  analyzeEngagementPotential
};