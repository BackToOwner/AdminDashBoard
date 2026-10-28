export class StatsModel {
  constructor(data = {}) {
    this.itemsClosed = Number(data.itemsClosed ?? 0);
    this.itemsClosedTrend = data.itemsClosedTrend ?? '';
    this.activeCases = Number(data.activeCases ?? 0);
    this.activeCasesTrend = data.activeCasesTrend ?? '';
    this.successRate = Number(data.successRate ?? 0);
    this.successRateTrend = data.successRateTrend ?? '';
    this.pendingMatches = Number(data.pendingMatches ?? 0);

    const rewards = Number(data.totalRewardsPaid ?? 0);
    this.totalRewardsPaid = Number.isFinite(rewards)
      ? rewards.toLocaleString(undefined, {
          style: 'decimal',
          maximumFractionDigits: 2,
        })
      : '0';

    const hours = data.avgResolutionTime;

    if (
      hours === null ||
      hours === undefined ||
      hours === '' ||
      !Number.isFinite(Number(hours)) ||
      Number(hours) < 0
    ) {
      this.avgResolutionTime = 'N/A';
    } else {
      const totalHours = Math.round(Number(hours));

      if (totalHours < 24) {
        this.avgResolutionTime = `${totalHours} hrs`;
      } else {
        const days = Math.floor(totalHours / 24);
        const remainingHours = totalHours % 24;

        this.avgResolutionTime = remainingHours
          ? `${days} days ${remainingHours} hrs`
          : `${days} days`;
      }
    }

    this.registeredUsers = Number(data.registeredUsers ?? 0);
    this.activeFinders = Number(data.activeFinders ?? 0);
  }

  resolveCase() {
    return new StatsModel({
      ...this,
      itemsClosed: this.itemsClosed + 1,
      activeCases: Math.max(0, this.activeCases - 1),
    });
  }

  approveMatch() {
    return new StatsModel({
      ...this,
      pendingMatches: Math.max(0, this.pendingMatches - 1),
    });
  }
}
