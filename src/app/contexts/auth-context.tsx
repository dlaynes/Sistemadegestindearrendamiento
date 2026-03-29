import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types/user';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuarios mock para desarrollo
const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'Admin Principal',
    email: 'admin@rentmanager.com',
    password: 'admin123',
    role: 'administrador',
    avatar: 'AP',
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos@rentmanager.com',
    password: 'arrendador123',
    role: 'arrendador',
    avatar: 'CR',
    properties: ['1', '2', '5'],
  },
  {
    id: '3',
    name: 'Juan Pérez',
    email: 'juan@email.com',
    password: 'inquilino123',
    role: 'inquilino',
    avatar: 'JP',
    properties: ['1'],
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

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
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
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
    localStorage.removeItem('user');
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