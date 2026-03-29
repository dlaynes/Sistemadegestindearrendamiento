import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useAuth } from './contexts/auth-context';
import { Login } from './components/login';
import { AdminLayout } from './components/admin/admin-layout';
import { AdminDashboard } from './components/admin/admin-dashboard';
import { ArrendadorLayout } from './components/arrendador/arrendador-layout';
import { ArrendadorDashboard } from './components/arrendador/arrendador-dashboard';
import { InquilinoLayout } from './components/inquilino/inquilino-layout';
import { InquilinoDashboard } from './components/inquilino/inquilino-dashboard';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <>{children}</>;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Rutas de Administrador */}
        <Route
          path="/administrador"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Rutas de Arrendador */}
        <Route
          path="/arrendador"
          element={
            <ProtectedRoute allowedRoles={['arrendador']}>
              <ArrendadorLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ArrendadorDashboard />} />
        </Route>

        {/* Rutas de Inquilino */}
        <Route
          path="/inquilino"
          element={
            <ProtectedRoute allowedRoles={['inquilino']}>
              <InquilinoLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<InquilinoDashboard />} />
        </Route>

        {/* Ruta raíz */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
