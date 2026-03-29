export type UserRole = 'administrador' | 'arrendador' | 'inquilino';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  properties?: string[]; // IDs de propiedades asociadas
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}