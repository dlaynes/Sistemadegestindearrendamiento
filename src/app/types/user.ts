// Unified User Types

export type UserRole = 'administrador' | 'arrendador' | 'inquilino';

export type UserStatus = 'activo' | 'inactivo';

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  avatar?: string;
  properties?: (string | number)[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
