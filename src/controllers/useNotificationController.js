import { useState, useCallback } from 'react';
import { notificationsList } from '../data/mockData';
import { NotificationModel, GeoBroadcastPayload } from '../models/NotificationModel';

export function useNotificationController() {
  const [notifications, setNotifications] = useState(() => 
    notificationsList.map(data => new NotificationModel(data))
  );
  const [toasts, setToasts] = useState([]);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

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
  const markNotificationRead = useCallback((notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? new NotificationModel({ ...n, read: true }) : n));
  }, []);

  /**
   * Dispatch area geo-broadcast
   */
  const dispatchGeoBroadcast = useCallback((broadcastData) => {
    const payload = new GeoBroadcastPayload(broadcastData);
    const newNotification = payload.toNotification();

    setNotifications(prev => [newNotification, ...prev]);
    showToast({
      title: 'Geo-Alert Dispatched 📡',
      message: `Broadcasted to active mobile devices within ${payload.radiusKm}km radius.`,
      type: 'info'
    });
    return payload;
  }, [showToast]);

  return {
    notifications,
    toasts,
    showBroadcastModal,
    setShowBroadcastModal,
    showToast,
    dismissToast,
    markNotificationRead,
    dispatchGeoBroadcast
  };
}
