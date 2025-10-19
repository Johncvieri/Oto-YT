/**
 * Sentiment Analysis Processing Script
 * 
 * Processes comment sentiment data and calculates metrics
 * This script is stored in GitHub for versioning and reproducibility
 */

function calculateSentimentMetrics(comments) {
  // Calculate sentiment distribution
  const sentimentCounts = {
    positive: 0,
    neutral: 0,
    negative: 0
  };
  
  comments.forEach(comment => {
    const sentiment = comment.sentiment ? comment.sentiment.toLowerCase() : 'neutral';
    if (sentimentCounts.hasOwnProperty(sentiment)) {
      sentimentCounts[sentiment]++;
    } else {
      sentimentCounts.neutral++; // Default to neutral for unknown sentiment
    }
  });
  
  const totalComments = comments.length;
  
  const metrics = {
    totalComments,
    sentimentCounts,
    sentimentPercentages: {
      positive: totalComments > 0 ? (sentimentCounts.positive / totalComments) * 100 : 0,
      neutral: totalComments > 0 ? (sentimentCounts.neutral / totalComments) * 100 : 0,
      negative: totalComments > 0 ? (sentimentCounts.negative / totalComments) * 100 : 0
    },
    overallSentimentScore: totalComments > 0 ? 
      ((sentimentCounts.positive * 1) + (sentimentCounts.neutral * 0) + (sentimentCounts.negative * -1)) / totalComments : 0
  };
  
  return metrics;
}

function identifySentimentPatterns(comments) {
  // Identify patterns in sentiment by language, region, or time
  const patterns = {
    byLanguage: {},
    byRegion: {},
    timeBased: {} // Would need timestamp data in a real implementation
  };
  
  comments.forEach(comment => {
    // Group by language
    const lang = comment.language || 'unknown';
    if (!patterns.byLanguage[lang]) {
      patterns.byLanguage[lang] = { positive: 0, neutral: 0, negative: 0, total: 0 };
    }
    const langSentiment = comment.sentiment ? comment.sentiment.toLowerCase() : 'neutral';
    if (patterns.byLanguage[lang].hasOwnProperty(langSentiment)) {
      patterns.byLanguage[lang][langSentiment]++;
    }
    patterns.byLanguage[lang].total++;
    
    // Group by region
    const region = comment.region_origin || 'unknown';
    if (!patterns.byRegion[region]) {
      patterns.byRegion[region] = { positive: 0, neutral: 0, negative: 0, total: 0 };
    }
    if (patterns.byRegion[region].hasOwnProperty(langSentiment)) {
      patterns.byRegion[region][langSentiment]++;
    }
    patterns.byRegion[region].total++;
  });
  
  return patterns;
}

function generateSentimentInsights(metrics, patterns) {
  const insights = [];
  
  // Positive sentiment insights
  if (metrics.sentimentPercentages.positive > 70) {
    insights.push({
      type: 'high_positive',
      message: 'High positive sentiment detected in comments',
      confidence: 'high'
    });
  }
  
  // Negative sentiment warnings
  if (metrics.sentimentPercentages.negative > 30) {
    insights.push({
      type: 'high_negative',
      message: 'High negative sentiment detected, consider content adjustment',
      confidence: 'medium'
    });
  }
  
  // Language-specific patterns
  Object.entries(patterns.byLanguage).forEach(([lang, data]) => {
    if (data.total > 5) { // Only consider if we have enough data
      const positiveRatio = data.positive / data.total;
      if (positiveRatio > 0.8) {
        insights.push({
          type: 'language_positive',
          message: `Language "${lang}" shows very high positive sentiment`,
          data: data
        });
      } else if (positiveRatio < 0.2) {
        insights.push({
          type: 'language_negative',
          message: `Language "${lang}" shows low positive sentiment`,
          data: data
        });
      }
    }
  });
  
  return insights;
}

module.exports = {
  calculateSentimentMetrics,
  identifySentimentPatterns,
  generateSentimentInsights
};