import { apiGet, apiPost, apiPatch, apiDelete } from './client';

export const reportsApi = {
  list: (params) => apiGet('/reports', { pageSize: 200, ...params }),
  get: (id) => apiGet(`/reports/${id}`),
  create: (data) => apiPost('/reports', data),
  update: (id, data) => apiPatch(`/reports/${id}`, data),
  remove: (id) => apiDelete(`/reports/${id}`),
};
