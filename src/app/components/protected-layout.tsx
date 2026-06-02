import { Navigate } from 'react-router';
import { useAuth } from '../contexts/auth-context';
import { Layout } from './layout';
import { Spinner } from './shared/ui/spinner';

export function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

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

  return <Layout />;
}
