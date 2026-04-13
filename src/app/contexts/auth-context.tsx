import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types/user';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios mock para desarrollo
export const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'Admin Principal',
    email: 'admin@rentmanager.com',
    password: 'admin123',
    role: 'administrador',
    avatar: 'AP',
    status: 'activo',
    lastLogin: '2026-04-12 10:30:00',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos@rentmanager.com',
    password: 'arrendador123',
    role: 'arrendador',
    avatar: 'CR',
    properties: ['1', '2', '5'],
    status: 'activo',
    lastLogin: '2026-04-12 10:30:00',
  },
  {
    id: '3',
    name: 'Juan Pérez',
    email: 'juan@email.com',
    password: 'inquilino123',
    role: 'inquilino',
    avatar: 'JP',
    properties: ['1'],
    status: 'activo',
    lastLogin: '2026-04-12 10:30:00',
  },
  {
    id: '4',
    name: 'Carlos Rodríguez',
    email: 'carlos@rentmanager.com',
    password: 'arrendador123',
    role: 'arrendador',
    status: 'activo',
    lastLogin: '2026-04-11 16:45:00',
    avatar: 'CR',
    properties: ['1', '2', '5'],
  },
  {
    id: '5',
    name: 'Juan Pérez',
    email: 'juan@email.com',
    role: 'inquilino',
    status: 'activo',
    lastLogin: '2026-04-10 09:15:00',
    avatar: 'JP',
    properties: ['1'],
    password: 'inquilino123',
  },
  {
    id: '6',
    name: 'María González',
    email: 'maria.g@rentmanager.com',
    role: 'arrendador',
    password: 'arrendador123',
    status: 'activo',
    lastLogin: '2026-04-12 08:20:00',
    avatar: 'MG',
    properties: ['3', '4'],
  },
  {
    id: '7',
    name: 'Roberto Silva',
    email: 'roberto.s@email.com',
    role: 'inquilino',
    status: 'inactivo',
    lastLogin: '2026-03-15 14:30:00',
    avatar: 'RS',
    properties: ['6'],
    password: 'inquilino123',
  },
  {
    id: '8',
    name: 'Laura Gómez',
    email: 'laura.g@email.com',
    role: 'inquilino',
    status: 'activo',
    lastLogin: '2026-04-12 11:00:00',
    avatar: 'LG',
    properties: ['5'],
    password: 'inquilino123',
  },

];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Verificar sesión guardada al cargar
  useEffect(() => {
    const checkSession = () => {
      try {
        const savedUser = localStorage.getItem('rentmanager_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
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
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundUser = mockUsers.find(
        u => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error('Credenciales inválidas');
      }

      const { password: _, ...userWithoutPassword } = foundUser;
      
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false,
      });
      localStorage.setItem('rentmanager_user', JSON.stringify(userWithoutPassword));

      return userWithoutPassword;
    } catch (error) {
      console.error('Error en login:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = (): void => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('rentmanager_user');
    // Redirigir al login
    window.location.href = '/login';
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!authState.user) return false;
    
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(authState.user.role);
  };

  const updateUser = (userData: Partial<User>) => {
    if (!authState.user) return;

    const updatedUser = { ...authState.user, ...userData };
    setAuthState((prev) => ({
      ...prev,
      user: updatedUser,
    }));

    localStorage.setItem('rentmanager_user', JSON.stringify(updatedUser));
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