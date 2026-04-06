import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useAuth } from './contexts/auth-context';
import { Login } from './components/login';
import { AdminLayout } from './components/admin/admin-layout';
import { AdminDashboard } from './components/admin/admin-dashboard';
import { AdminProperties } from './components/admin/admin-properties';
import { AdminContracts } from './components/admin/admin-contracts';
import { AdminPayments } from './components/admin/admin-payments';
import { ArrendadorLayout } from './components/arrendador/arrendador-layout';
import { ArrendadorDashboard } from './components/arrendador/arrendador-dashboard';
import { ArrendadorProperties } from './components/arrendador/arrendador-properties';
import { ArrendadorContracts } from './components/arrendador/arrendador-contracts';
import { ArrendadorPayments } from './components/arrendador/arrendador-payments';
import { InquilinoLayout } from './components/inquilino/inquilino-layout';
import { InquilinoDashboard } from './components/inquilino/inquilino-dashboard';
import { InquilinoProperties } from './components/inquilino/inquilino-properties';
import { InquilinoContracts } from './components/inquilino/inquilino-contracts';
import { InquilinoPayments } from './components/inquilino/inquilino-payments';
import { PropertyDetail } from './components/property-detail';
import { PropertyForm } from './components/property-form';
import { ContractDetail } from './components/contract-detail';
import { ContractWizard } from './components/contract-wizard';
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
          <Route path="propiedades" element={<AdminProperties />} />
          <Route path="properties/new" element={<PropertyForm />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="properties/:id/edit" element={<PropertyForm />} />
          <Route path="contratos" element={<AdminContracts />} />
          <Route path="contracts/:id" element={<ContractDetail />} />
          <Route path="contracts/new" element={<ContractWizard />} />
          <Route path="contracts/:id/edit" element={<ContractWizard />} />
          <Route path="contracts/:contractId/payments/new" element={<PaymentForm />} />
          <Route path="pagos" element={<AdminPayments />} />
          <Route path="payments/:id" element={<PaymentDetail />} />
          <Route path="mensajes" element={<Messages />} />
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
          <Route path="propiedades" element={<ArrendadorProperties />} />
          <Route path="properties/new" element={<PropertyForm />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="properties/:id/edit" element={<PropertyForm />} />
          <Route path="contratos" element={<ArrendadorContracts />} />
          <Route path="contracts/:id" element={<ContractDetail />} />
          <Route path="contracts/new" element={<ContractWizard />} />
          <Route path="contracts/:id/edit" element={<ContractWizard />} />
          <Route path="contracts/:contractId/payments/new" element={<PaymentForm />} />
          <Route path="pagos" element={<ArrendadorPayments />} />
          <Route path="payments/:id" element={<PaymentDetail />} />
          <Route path="mensajes" element={<Messages />} />
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
          <Route path="propiedades" element={<InquilinoProperties />} />
          <Route path="properties/new" element={<PropertyForm />} />
          <Route path="properties/:id" element={<PropertyDetail />} />
          <Route path="properties/:id/edit" element={<PropertyForm />} />
          <Route path="contratos" element={<InquilinoContracts />} />
          <Route path="contracts/:id" element={<ContractDetail />} />
          <Route path="contracts/new" element={<ContractWizard />} />
          <Route path="contracts/:id/edit" element={<ContractWizard />} />
          <Route path="contracts/:contractId/payments/new" element={<PaymentForm />} />
          <Route path="pagos" element={<InquilinoPayments />} />
          <Route path="payments/:id" element={<PaymentDetail />} />
          <Route path="mensajes" element={<Messages />} />
        </Route>

        {/* Ruta raíz */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}