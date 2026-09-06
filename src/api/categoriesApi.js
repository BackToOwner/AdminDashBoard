import { apiGet, apiPost, apiPatch, apiDelete } from './client';

export const categoriesApi = {
  list: () => apiGet('/categories'),
  create: (data) => apiPost('/categories', data),
  update: (id, data) => apiPatch(`/categories/${id}`, data),
  remove: (id) => apiDelete(`/categories/${id}`),
};
