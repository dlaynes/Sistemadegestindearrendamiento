import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useServices } from '../services';
import type { User, AuthState, UserRole } from '../types/user';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'rentmanager_user';

function normalizeRole(role: string): UserRole {
  return role.toLowerCase() as UserRole;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth: authService } = useServices();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isAuthReady: false,
  });

  useEffect(() => {
    const checkSession = () => {
      try {
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (savedUser) {
          const parsed = JSON.parse(savedUser) as User;
          const user: User = { ...parsed, role: normalizeRole(parsed.role) };
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            isAuthReady: true,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isAuthReady: true,
          });
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isAuthReady: true,
        });
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const user = await authService.login(email, password);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        isAuthReady: true,
      });
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      console.error('Error en login:', error);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = (): void => {
    authService.logout().catch((err) => console.error('Error en logout:', err));
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isAuthReady: true,
    });
    localStorage.removeItem(USER_STORAGE_KEY);
    window.location.href = '/login';
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    return authService.hasRole(authState.user, roles);
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!authState.user) return;
    try {
      const updatedUser = await authService.updateUser(
        String(authState.user.id),
        userData
      );
      const user: User = { ...updatedUser, role: normalizeRole(updatedUser.role) };
      setAuthState((prev) => ({
        ...prev,
        user,
      }));
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        hasRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
