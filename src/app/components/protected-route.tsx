import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/auth-context';
import { UserRole } from '../types/user';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="bg-card rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="bg-destructive-muted p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-6">
            No tienes permisos para acceder a esta sección.
          </p>
          <p className="text-sm text-muted-foreground">
            Tu rol: <span className="font-semibold">{user.role}</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
