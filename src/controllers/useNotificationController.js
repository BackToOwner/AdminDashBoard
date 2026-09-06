import { useState, useCallback, useEffect } from 'react';
import { notificationsApi } from '../api';
import { NotificationModel } from '../models/NotificationModel';
import { formatTimeAgo } from '../utils/format';

function mapApiNotification(apiNotif) {
  return new NotificationModel({
    ...apiNotif,
    time: formatTimeAgo(apiNotif.createdAt),
  });
}

export function useNotificationController() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await notificationsApi.list();
      setNotifications(data.map(mapApiNotification));
    } catch {
      // Non-fatal: notification bell just stays empty if this fails.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /**
   * Display a floating toast message
   */
  const showToast = useCallback(({ title, message, type = 'success' }) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4200);
  }, []);

  /**
   * Dismiss toast
   */
  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  /**
   * Mark notification as read
   */
  const markNotificationRead = useCallback(async (notifId) => {
    setNotifications(prev => prev.map(n => (n.id === notifId ? new NotificationModel({ ...n, read: true }) : n)));
    try {
      await notificationsApi.markRead(notifId);
    } catch {
      // Local state already reflects "read"; a background failure here isn't
      // worth reverting the UI over.
    }
  }, []);

  /**
   * Dispatch area geo-broadcast
   */
  const dispatchGeoBroadcast = useCallback(async (broadcastData) => {
    try {
      const created = await notificationsApi.broadcast(broadcastData);
      const newNotification = mapApiNotification(created);
      setNotifications(prev => [newNotification, ...prev]);
      showToast({
        title: 'Geo-Alert Dispatched 📡',
        message: `Broadcasted to active mobile devices within ${broadcastData.radius}km radius.`,
        type: 'info',
      });
      return newNotification;
    } catch (err) {
      showToast({
        title: 'Broadcast Failed',
        message: err.message || 'Could not send the geo-alert. Please try again.',
        type: 'alert',
      });
      return null;
    }
  }, [showToast]);

  return {
    notifications,
    loading,
    toasts,
    showBroadcastModal,
    setShowBroadcastModal,
    showToast,
    dismissToast,
    markNotificationRead,
    dispatchGeoBroadcast,
  };
}
