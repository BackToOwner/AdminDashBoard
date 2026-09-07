/**
 * Thin fetch wrapper for the BackToOwner Admin Backend API.
 * Attaches the admin JWT (if present) and normalizes error handling.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_STORAGE_KEY = 'bto_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/**
 * Core request helper. `path` is relative to API_BASE_URL (e.g. '/reports').
 */
export async function apiFetch(path, { method = 'GET', body, params } = {}) {
  let url = `${API_BASE_URL}${path}`;

  if (params) {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    if (query) url += `?${query}`;
  }

  const headers = { Accept: 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Unable to reach the BackToOwner API. Is the backend running?', 0);
  }

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    if (response.status === 401) setToken(null);
    throw new ApiError(payload?.message || `Request failed with status ${response.status}`, response.status);
  }

  return payload?.data !== undefined ? payload.data : payload;
}

export const apiGet = (path, params) => apiFetch(path, { method: 'GET', params });
export const apiPost = (path, body) => apiFetch(path, { method: 'POST', body: body ?? {} });
export const apiPatch = (path, body) => apiFetch(path, { method: 'PATCH', body: body ?? {} });
export const apiDelete = (path) => apiFetch(path, { method: 'DELETE' });
