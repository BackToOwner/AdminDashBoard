/**
 * StatsModel - Aggregated KPIs, recovery rates, and platform metrics
 */

export class StatsModel {
  constructor(data = {}) {
    this.itemsReturned = Number(data.itemsReturned) || 12483;
    this.itemsReturnedTrend = data.itemsReturnedTrend || '+14.8%';
    this.activeCases = Number(data.activeCases) || 3291;
    this.activeCasesTrend = data.activeCasesTrend || '-2.4%';
    this.successRate = Number(data.successRate) || 78.4;
    this.successRateTrend = data.successRateTrend || '+4.2%';
    this.pendingMatches = Number(data.pendingMatches) || 412;
    this.pendingMatchesTrend = data.pendingMatchesTrend || '+28 new today';
    this.totalRewardsPaid = data.totalRewardsPaid || '$148,950';
    this.avgResolutionTime = data.avgResolutionTime || '14.2 hrs';
    this.registeredUsers = Number(data.registeredUsers) || 48920;
    this.activeFinders = Number(data.activeFinders) || 6310;
  }

  /**
   * Recalculate metrics when an item is resolved/returned
   */
  resolveCase() {
    return new StatsModel({
      ...this,
      itemsReturned: this.itemsReturned + 1,
      activeCases: Math.max(0, this.activeCases - 1)
    });
  }

  /**
   * Recalculate metrics when a match is approved
   */
  approveMatch() {
    return new StatsModel({
      ...this,
      pendingMatches: Math.max(0, this.pendingMatches - 1)
    });
  }
}
