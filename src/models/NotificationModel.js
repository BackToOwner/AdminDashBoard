/**
 * NotificationModel - Domain model for admin notifications
 */

export const NotificationType = {
  MATCH: 'match',
  REWARD: 'reward',
  SUCCESS: 'success',
  LOCATION: 'location',
  INFO: 'info'
};

export class NotificationModel {
  constructor(data = {}) {
    this.id = data.id || `NOTIF-${Date.now()}`;
    this.title = data.title || 'System Notification';
    this.message = data.message || '';
    this.time = data.time || 'Just now';
    this.read = Boolean(data.read);
    this.type = data.type || NotificationType.INFO;
    this.meta = data.meta || {};
  }
}
