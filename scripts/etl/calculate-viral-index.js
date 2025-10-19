/**
 * Viral Index Calculation Script
 * 
 * This script calculates the viral index for videos based on engagement metrics
 * The algorithm is stored in GitHub for versioning and audit, but processes 
 * data from Supabase
 */

// The viral_index formula from the database schema:
// viral_index REAL GENERATED ALWAYS AS ((views / 1000.0) + (likes * 0.5) + (watch_time / 300.0)) STORED

function calculateViralIndex(views, likes, watchTime) {
  // This is the same formula used in the database schema
  const viralIndex = (views / 1000.0) + (likes * 0.5) + (watchTime / 300.0);
  return Math.max(0, viralIndex); // Ensure non-negative value
}

function isWinningContent(viralIndex) {
  // Default threshold from schema is 20
  return viralIndex > 20;
}

module.exports = {
  calculateViralIndex,
  isWinningContent
};