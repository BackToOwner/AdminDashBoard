/**
 * UserModel - Entity representing BackToOwner registered citizens, finders, and transit partners.
 */

export class UserModel {
  constructor(data = {}) {
    this.id = data.id || `USR-${Math.floor(1000 + Math.random() * 9000)}`;
    this.name = data.name || 'Anonymous User';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.role = data.role || 'Verified Citizen';
    this.avatar = data.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
    this.itemsReported = Number(data.itemsReported) || 0;
    this.itemsFound = Number(data.itemsFound) || 0;
    this.trustScore = typeof data.trustScore === 'number' ? data.trustScore : 95;
    this.status = data.status || 'active';
    this.joined = data.joined || '2024';
  }

  isHighTrust() {
    return this.trustScore >= 95;
  }
}
