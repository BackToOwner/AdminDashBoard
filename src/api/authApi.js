import { apiGet, apiPost } from './client';

export const authApi = {
  login: (email, password) => apiPost('/auth/login', { email, password }),
  me: () => apiGet('/auth/me'),
};
