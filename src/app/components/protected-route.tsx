import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../contexts/auth-context';
import { UserRole } from '../types/user';
import { ShieldAlert } from 'lucide-react';
import { Spinner } from './shared/ui/spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="xl" label="Verificando sesión" />
          <p className="text-sm text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-card p-8 text-center shadow-elev-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive-muted">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="mb-2 text-h2 font-semibold text-foreground">Acceso Denegado</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            No tienes permisos para acceder a esta sección.
          </p>
          <p className="text-sm text-muted-foreground">
            Tu rol: <span className="font-semibold text-foreground">{user.role}</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
