/**
 * ReportModel - Entity and Domain Logic for Lost & Found Reports
 * Represents items submitted exclusively by mobile app users and finders.
 */

export const ReportStatus = {
  OPEN: 'open',
  IN_REVIEW: 'in_review',
  MATCHED: 'matched',
  RETURNED: 'returned',
  CLOSED: 'closed'
};

export const ReportType = {
  LOST: 'lost',
  FOUND: 'found'
};

export class ReportModel {
  constructor(data = {}) {
    this.id = data.id || `REP-${Math.floor(10000 + Math.random() * 90000)}`;
    this.title = data.title || 'Untitled Item';
    this.type = data.type || ReportType.LOST;
    this.category = data.category || 'other';
    this.status = data.status || ReportStatus.OPEN;
    this.location = data.location || 'Unknown Location';
    this.coordinates = data.coordinates || { lat: 40.7128, lng: -74.0060 };
    this.distanceKm = typeof data.distanceKm === 'number' ? data.distanceKm : 0.5;
    this.timeAgo = data.timeAgo || 'Just now';
    this.date = data.date || new Date().toISOString().slice(0, 16).replace('T', ' ');
    this.reward = data.reward ? Number(data.reward) : null;
    this.matched = Boolean(data.matched || data.status === ReportStatus.MATCHED);
    this.matchedWithId = data.matchedWithId || null;
    this.matchScore = data.matchScore || null;
    this.reporter = data.reporter || null;
    this.finder = data.finder || null;
    this.description = data.description || '';
    this.images = Array.isArray(data.images) ? data.images : [];
    this.verificationDetails = data.verificationDetails || {};
  }

  /**
   * Determine if item is within a given radar radius
   */
  isWithinRadius(radiusKm) {
    return (this.distanceKm || 0) <= radiusKm;
  }

  /**
   * Format reward string
   */
  getFormattedReward() {
    return this.reward ? `LKR ${this.reward}` : null;
  }

  /**
   * Determine responsible party display name
   */
  getUploaderName() {
    if (this.reporter) return this.reporter.name;
    if (this.finder) return this.finder.name;
    return 'Anonymous User';
  }

  /**
   * Determine uploader role label
   */
  getUploaderRole() {
    return this.type === ReportType.LOST ? '📱 App User (Owner)' : '🔍 Verified Finder';
  }

  /**
   * Generate CSV row data
   */
  toCsvRow() {
    const user = this.getUploaderName();
    return `"${this.id}","${this.title}","${this.type}","${this.category}","${this.status}","${this.location}","${this.reward || 0}","${user}","${this.date}"\n`;
  }
}

/**
 * Filter reports based on query criteria
 */
export function filterReports(reports, { search = '', type = 'all', category = 'all', status = 'all' }) {
  const lowerSearch = search.toLowerCase().trim();

  return reports.filter(item => {
    const matchesSearch = !lowerSearch ||
      item.title.toLowerCase().includes(lowerSearch) ||
      item.location.toLowerCase().includes(lowerSearch) ||
      item.id.toLowerCase().includes(lowerSearch) ||
      (item.reporter && item.reporter.name.toLowerCase().includes(lowerSearch)) ||
      (item.finder && item.finder.name.toLowerCase().includes(lowerSearch));

    const matchesType = type === 'all' || item.type === type;
    const matchesCat = category === 'all' || item.category === category;
    const matchesStatus = status === 'all' || item.status === status;

    return matchesSearch && matchesType && matchesCat && matchesStatus;
  });
}
