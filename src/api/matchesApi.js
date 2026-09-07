import { apiGet, apiPost } from './client';

export const matchesApi = {
  list: (status) => apiGet('/matches', { status }),
  create: (data) => apiPost('/matches', data),
  approve: (id) => apiPost(`/matches/${id}/approve`),
  reject: (id) => apiPost(`/matches/${id}/reject`),
};
