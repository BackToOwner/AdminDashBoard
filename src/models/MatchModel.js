/**
 * MatchModel - Domain Logic for AI Smart Match Pairs and Verification
 */

export const MatchConfidenceTier = {
  VERY_HIGH: 'Very High Confidence',
  HIGH: 'High Confidence',
  MODERATE: 'Moderate Confidence'
};

export class MatchModel {
  constructor(data = {}) {
    this.id = data.id || `MATCH-${Math.floor(100 + Math.random() * 900)}`;
    this.lostItem = data.lostItem || {};
    this.foundItem = data.foundItem || {};
    this.matchScore = Number(data.matchScore) || 80;
    this.confidenceLabel = data.confidenceLabel || MatchModel.getConfidenceLabel(this.matchScore);
    this.matchFactors = Array.isArray(data.matchFactors) ? data.matchFactors : [];
    this.status = data.status || 'pending_admin_approval';
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  static getConfidenceLabel(score) {
    if (score >= 95) return MatchConfidenceTier.VERY_HIGH;
    if (score >= 85) return MatchConfidenceTier.HIGH;
    return MatchConfidenceTier.MODERATE;
  }

  /**
   * Evaluates if this match meets the admin threshold
   */
  meetsThreshold(minScore = 80) {
    return this.matchScore >= minScore;
  }
}
