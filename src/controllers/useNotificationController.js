import { useState, useCallback, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { NotificationModel } from '../models/NotificationModel';

export function useNotificationController() {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState('');

  const showToast = useCallback(({ title, message, type = 'success' }) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4200);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const refreshNotifications = useCallback(async () => {
    const token = localStorage.getItem('adminToken');

    if (!token) {
      setNotificationsError('Please log in as an administrator.');
      setNotificationsLoading(false);
      return;
    }

    setNotificationsLoading(true);
    setNotificationsError('');

    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to load notifications.');
      }

      const items = Array.isArray(result.data) ? result.data : [];

      setNotifications(
        items.map(item => new NotificationModel({
          ...item,
          time: item.createdAt
            ? new Date(item.createdAt).toLocaleString()
            : 'Just now',
        }))
      );
    } catch (error) {
      setNotificationsError(error.message || 'Failed to load notifications.');
    } finally {
      setNotificationsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const markNotificationRead = useCallback(async (notifId) => {
    const notification = notifications.find(n => n.id === notifId);

    if (!notification || notification.read) return;

    const token = localStorage.getItem('adminToken');

    if (!token) {
      setNotificationsError('Please log in as an administrator.');
      return;
    }

    setNotifications(prev =>
      prev.map(n => n.id === notifId
        ? new NotificationModel({ ...n, read: true })
        : n
      )
    );

    try {
      const response = await fetch(
        `${API_BASE_URL}/notifications/${encodeURIComponent(notifId)}/read`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to mark notification as read.');
      }

      setNotifications(prev =>
        prev.map(n => n.id === notifId
          ? new NotificationModel({ ...n, read: true })
          : n
        )
      );
      setNotificationsError('');
    } catch (error) {
      setNotifications(prev =>
        prev.map(n => n.id === notifId
          ? new NotificationModel({ ...n, read: false })
          : n
        )
      );
      setNotificationsError(error.message || 'Failed to mark notification as read.');
    }
  }, [notifications]);

  return {
    notifications,
    notificationsLoading,
    notificationsError,
    refreshNotifications,
    toasts,
    showToast,
    dismissToast,
    markNotificationRead,
  };
}
