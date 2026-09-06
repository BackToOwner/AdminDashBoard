import { apiGet, apiPatch } from './client';

export const usersApi = {
  list: (params) => apiGet('/users', params),
  get: (id) => apiGet(`/users/${id}`),
  updateStatus: (id, status) => apiPatch(`/users/${id}/status`, { status }),
};
