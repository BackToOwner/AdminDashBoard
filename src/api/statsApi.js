import { apiGet } from './client';

export const statsApi = {
  overview: () => apiGet('/stats/overview'),
  breakdown: () => apiGet('/stats/breakdown'),
};
