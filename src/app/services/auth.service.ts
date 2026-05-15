import type { User, UserRole, AuthResponse } from '../types/user';
import { apiPost, apiGet, apiPut, setToken, clearToken, apiFetch } from './api-client';

export interface AuthService {
  getAllUsers(): Promise<User[]>;
  getById(userId: string | number): Promise<User | undefined>;
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getSession(): Promise<User | null>;
  hasRole(user: User | null, roles: UserRole | UserRole[]): boolean;
  updateUser(userId: string | number, userData: Partial<User>): Promise<User>;
  getTenants(): Promise<User[]>;
  acceptInvitation(token: string, name: string, password: string): Promise<AuthResponse>;
}

const USER_STORAGE_KEY = 'rentmanager_user';

function normalizeRole(role: string): UserRole {
  return role.toLowerCase() as UserRole;
}

function getRole(): UserRole | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    return normalizeRole((JSON.parse(raw) as { role: string }).role);
  } catch {
    return null;
  }
}

function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as User;
    return { ...parsed, role: normalizeRole(parsed.role) };
  } catch {
    return null;
  }
}

function setStoredUser(user: User): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export class ApiAuthService implements AuthService {
  async getAllUsers(): Promise<User[]> {
    return apiGet<User[]>('/admin/users');
  }

  async getById(userId: string | number): Promise<User | undefined> {
    try {
      return await apiGet<User>(`/admin/users/${userId}`);
    } catch {
      return undefined;
    }
  }

  async login(email: string, password: string): Promise<User> {
    const response = await apiPost<AuthResponse>('/auth/login', { email, password });
    setToken(response.token);
    const user: User = {
      id: response.id,
      name: response.name,
      email: response.email,
      role: normalizeRole(response.role),
      status: 'activo',
      avatar: response.avatar,
    };
    setStoredUser(user);
    return user;
  }

  async logout(): Promise<void> {
    clearToken();
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  async getSession(): Promise<User | null> {
    return getStoredUser();
  }

  hasRole(user: User | null, roles: UserRole | UserRole[]): boolean {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }

  async updateUser(userId: string | number, userData: Partial<User>): Promise<User> {
    return apiPut<User>(`/admin/users/${userId}`, userData);
  }

  async getTenants(): Promise<User[]> {
    const role = getRole();
    if (role === 'administrador') {
      const all = await this.getAllUsers();
      return all.filter((u) => u.role === 'inquilino');
    }
    return apiGet<User[]>('/landlord/tenants');
  }

  async acceptInvitation(token: string, name: string, password: string): Promise<AuthResponse> {
    const res = await apiFetch('/tenant/accept-invitation', {
      method: 'POST',
      body: JSON.stringify({ token, name, password }),
    });
    const response = (await res.json()) as AuthResponse;
    setToken(response.token);
    const user: User = {
      id: response.id,
      name: response.name,
      email: response.email,
      role: normalizeRole(response.role),
      status: 'activo',
      avatar: response.avatar,
    };
    setStoredUser(user);
    return response;
  }
}
