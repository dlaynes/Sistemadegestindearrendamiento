import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useAuth } from './contexts/auth-context';
import { Login } from './components/login';
import { AdminLayout } from './components/admin/admin-layout';
import { AdminDashboard } from './components/admin/admin-dashboard';
import { ArrendadorLayout } from './components/arrendador/arrendador-layout';
import { ArrendadorDashboard } from './components/arrendador/arrendador-dashboard';
import { InquilinoLayout } from './components/inquilino/inquilino-layout';
import { InquilinoDashboard } from './components/inquilino/inquilino-dashboard';
import { Properties } from './components/properties';
import { PropertyDetail } from './components/property-detail';
import { PropertyForm } from './components/property-form';
import { Contracts } from './components/contracts';
import { ContractDetail } from './components/contract-detail';
import { ContractWizard } from './components/contract-wizard';
import { Payments } from './components/payments';
import { PaymentDetail } from './components/payment-detail';
import { PaymentForm } from './components/payment-form';
import { Messages } from './components/messages';
import { Layout } from './components/layout';

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

        {/* Rutas compartidas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route 
            path="propiedades" 
            element={
              <ProtectedRoute allowedRoles={['administrador', 'arrendador']}>
                <Properties />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="properties/new" 
            element={
              <ProtectedRoute allowedRoles={['administrador', 'arrendador']}>
                <PropertyForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="properties/:id" 
            element={
              <ProtectedRoute allowedRoles={['administrador', 'arrendador']}>
                <PropertyDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="properties/:id/edit" 
            element={
              <ProtectedRoute allowedRoles={['administrador', 'arrendador']}>
                <PropertyForm />
              </ProtectedRoute>
            } 
          />
          <Route path="contratos" element={<Contracts />} />
          <Route path="contracts/:id" element={<ContractDetail />} />
          <Route path="contracts/new" element={<ContractWizard />} />
          <Route path="contracts/:id/edit" element={<ContractWizard />} />
          <Route path="contracts/:contractId/payments/new" element={<PaymentForm />} />
          <Route path="pagos" element={<Payments />} />
          <Route path="payments/:id" element={<PaymentDetail />} />
          <Route path="mensajes" element={<Messages />} />
        </Route>

        {/* Ruta raíz */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}