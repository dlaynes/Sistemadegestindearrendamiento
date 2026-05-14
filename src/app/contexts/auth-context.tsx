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

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth: authService } = useServices();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const checkSession = () => {
      try {
        const savedUser = localStorage.getItem('rentmanager_user');
        if (savedUser) {
          const user = JSON.parse(savedUser) as User;
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error al verificar sesión:', error);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
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
      });
      localStorage.setItem('rentmanager_user', JSON.stringify(user));
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
    });
    localStorage.removeItem('rentmanager_user');
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
      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
      }));
      localStorage.setItem('rentmanager_user', JSON.stringify(updatedUser));
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
