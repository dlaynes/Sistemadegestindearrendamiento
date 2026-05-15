// Unified User Types

export type UserRole = 'administrador' | 'arrendador' | 'inquilino';

export type UserStatus = 'activo' | 'inactivo' | 'suspendido';

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: string;
  avatar?: string;
  properties?: (string | number)[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthReady: boolean;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}
