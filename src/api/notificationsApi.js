import { apiGet, apiPost, apiPatch, apiDelete } from './client';

export const notificationsApi = {
  list: () => apiGet('/notifications'),
  broadcast: (data) => apiPost('/notifications/broadcast', data),
  markRead: (id) => apiPatch(`/notifications/${id}/read`),
  remove: (id) => apiDelete(`/notifications/${id}`),
};
