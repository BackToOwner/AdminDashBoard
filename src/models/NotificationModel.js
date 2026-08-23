/**
 * NotificationModel - Domain logic for live alerts, notifications, and geo-broadcasts
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

export class GeoBroadcastPayload {
  constructor({ title, message, radius = '3.0', priority = 'high' }) {
    this.id = `BROADCAST-${Date.now()}`;
    this.title = title;
    this.message = message;
    this.radiusKm = parseFloat(radius);
    this.priority = priority;
    this.sentAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  toNotification() {
    return new NotificationModel({
      id: this.id,
      title: `Geo-Alert: ${this.title}`,
      message: `${this.message} (${this.radiusKm}km radius)`,
      time: 'Just now',
      read: false,
      type: NotificationType.LOCATION
    });
  }
}
