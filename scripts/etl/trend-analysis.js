/**
 * Trend Analysis Script
 * 
 * Analyzes trend data from Supabase to identify patterns and insights
 * This script is stored in GitHub for versioning and reproducibility
 */

function analyzeTrends(trendData) {
  // Calculate trend statistics
  const stats = {
    totalTrends: trendData.length,
    avgTrendScore: 0,
    avgRegionRelevance: 0,
    topSources: {},
    peakTrends: [],
    decliningTrends: []
  };
  
  if (trendData.length > 0) {
    // Calculate averages
    stats.avgTrendScore = trendData.reduce((sum, trend) => sum + (trend.trend_score || 0), 0) / trendData.length;
    stats.avgRegionRelevance = trendData.reduce((sum, trend) => sum + (trend.region_relevance || 0), 0) / trendData.length;
    
    // Count sources
    trendData.forEach(trend => {
      stats.topSources[trend.source] = (stats.topSources[trend.source] || 0) + 1;
    });
    
    // Identify peak trends (high trend score)
    stats.peakTrends = trendData
      .filter(trend => trend.trend_score > stats.avgTrendScore * 1.5)
      .sort((a, b) => b.trend_score - a.trend_score)
      .slice(0, 5); // Top 5 peak trends
    
    // Identify declining trends (trend_score significantly below average)
    stats.decliningTrends = trendData
      .filter(trend => trend.trend_score < stats.avgTrendScore * 0.5)
      .sort((a, b) => a.trend_score - b.trend_score)
      .slice(0, 5); // Top 5 declining trends
  }
  
  return stats;
}

function findTrendPatterns(trendData) {
  // This function would implement more complex pattern recognition
  // such as trend lifecycle stages, seasonal patterns, etc.
  
  const patterns = {
    trendingUp: [],
    plateauing: [],
    declining: [],
    seasonal: [],
    regional: {}
  };
  
  // Simple implementation: identify trend directions based on timestamp
  // In a real implementation, we'd need multiple data points per trend over time
  const recentTrends = trendData.slice(0, 20); // Most recent 20 trends
  
  recentTrends.forEach(trend => {
    // Categorize by score level
    if (trend.trend_score > 80) {
      patterns.trendingUp.push(trend);
    } else if (trend.trend_score < 20) {
      patterns.declining.push(trend);
    } else {
      patterns.plateauing.push(trend);
    }
    
    // Group by region
    if (trend.region_dominant) {
      if (!patterns.regional[trend.region_dominant]) {
        patterns.regional[trend.region_dominant] = [];
      }
      patterns.regional[trend.region_dominant].push(trend);
    }
  });
  
  return patterns;
}

module.exports = {
  analyzeTrends,
  findTrendPatterns
};