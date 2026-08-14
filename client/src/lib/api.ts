const TOKEN_KEY = 'hireexact_admin_token';

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/api${path}`, { ...options, headers });
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = typeof data?.error === 'string' ? data.error : 'Request failed';
    throw new Error(message);
  }
  return data as T;
}

export const api = {
  // Public
  getCandidates: (params?: { region?: string; stack?: string; seniority?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<{ candidates: any[] }>(`/candidates${qs ? `?${qs}` : ''}`);
  },
  createBooking: (payload: any) =>
    request<{ booking: any }>('/bookings', { method: 'POST', body: JSON.stringify(payload) }),
  createApplication: (payload: any) =>
    request<{ application: any }>('/applications', { method: 'POST', body: JSON.stringify(payload) }),
  matchTalent: (payload: any) =>
    request<{ success?: boolean; fallback?: boolean; message?: string; data: any }>('/ai/match-talent', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Admin auth
  login: (email: string, password: string) =>
    request<{ token: string; admin: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request<{ admin: any }>('/auth/me'),

  // Admin data
  getStats: () => request<any>('/dashboard/stats'),
  getAllCandidates: () => request<{ candidates: any[] }>('/candidates/admin/all'),
  createCandidate: (payload: any) =>
    request<{ candidate: any }>('/candidates', { method: 'POST', body: JSON.stringify(payload) }),
  updateCandidate: (id: string, payload: any) =>
    request<{ candidate: any }>(`/candidates/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteCandidate: (id: string) => request<void>(`/candidates/${id}`, { method: 'DELETE' }),

  getBookings: (status?: string) =>
    request<{ bookings: any[] }>(`/bookings${status && status !== 'all' ? `?status=${status}` : ''}`),
  updateBooking: (id: string, payload: any) =>
    request<{ booking: any }>(`/bookings/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),

  getApplications: (status?: string) =>
    request<{ applications: any[] }>(`/applications${status && status !== 'all' ? `?status=${status}` : ''}`),
  updateApplication: (id: string, payload: any) =>
    request<{ application: any }>(`/applications/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
};
