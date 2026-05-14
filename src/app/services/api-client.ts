const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

export function clearToken(): void {
  localStorage.removeItem('token');
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE}${path}`;
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => 'Error');
    throw new Error(text || `HTTP ${response.status}`);
  }

  return response;
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await apiFetch(path, { method: 'GET' });
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await apiFetch(path, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function apiDelete(path: string): Promise<void> {
  await apiFetch(path, { method: 'DELETE' });
}
