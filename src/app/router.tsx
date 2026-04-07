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

import { AdminContractDetail } from './components/admin/admin-contract-detail';
import { ArrendadorContractDetail } from './components/arrendador/arrendador-contract-detail';
import { InquilinoContractDetail } from './components/inquilino/inquilino-contract-detail';
import { AdminPropertyDetail } from './components/admin/admin-property-detail';
import { ArrendadorPropertyDetail } from './components/arrendador/arrendador-property-detail';
import { InquilinoPropertyDetail } from './components/inquilino/inquilino-property-detail';
import { Welcome } from './components/welcome';
import { AdminPaymentDetail } from './components/admin/admin-payment-detail';
import { ArrendadorPaymentDetail } from './components/arrendador/arrendador-payment-detail';
import { InquilinoPaymentDetail } from './components/inquilino/inquilino-payment-detail';
import { AdminPropertyForm } from './components/admin/admin-property-form';
import { ArrendadorPropertyForm } from './components/arrendador/arrendador-property-form';
import { InquilinoPropertyForm } from './components/inquilino/inquilino-property-form';
import { AdminContractWizard } from './components/admin/admin-contract-wizard';
import { ArrendadorContractWizard } from './components/arrendador/arrendador-contract-wizard'
import { InquilinoPaymentForm } from './components/inquilino/inquilino-payment-form';
import { ArrendadorMessages } from './components/arrendador/arrendador-messages';
import { InquilinoMessages } from './components/inquilino/inquilino-messages';

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
          <Route path="properties/new" element={<AdminPropertyForm />} />
          <Route path="properties/:id" element={<AdminPropertyDetail />} />
          <Route path="properties/:id/edit" element={<AdminPropertyForm />} />
          <Route path="contratos" element={<AdminContracts />} />
          <Route path="contracts/:id" element={<AdminContractDetail />} />
          <Route path="contracts/new" element={<AdminContractWizard />} />
          <Route path="contracts/:id/edit" element={<AdminContractWizard />} />
          <Route path="pagos" element={<AdminPayments />} />
          <Route path="payments/:id" element={<AdminPaymentDetail />} />
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
          <Route path="properties/new" element={<ArrendadorPropertyForm />} />
          <Route path="properties/:id" element={<ArrendadorPropertyDetail />} />
          <Route path="properties/:id/edit" element={<ArrendadorPropertyForm />} />
          <Route path="contratos" element={<ArrendadorContracts />} />
          <Route path="contracts/:id" element={<ArrendadorContractDetail />} />
          <Route path="contracts/new" element={<ArrendadorContractWizard />} />
          <Route path="contracts/:id/edit" element={<ArrendadorContractWizard />} />
          <Route path="pagos" element={<ArrendadorPayments />} />
          <Route path="payments/:id" element={<ArrendadorPaymentDetail />} />
          <Route path="mensajes" element={<ArrendadorMessages />} />
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
          <Route path="properties/new" element={<InquilinoPropertyForm />} />
          <Route path="properties/:id" element={<InquilinoPropertyDetail />} />
          <Route path="properties/:id/edit" element={<InquilinoPropertyForm />} />
          <Route path="contratos" element={<InquilinoContracts />} />
          <Route path="contracts/:id" element={<InquilinoContractDetail />} />
          <Route path="contracts/:contractId/payments/new" element={<InquilinoPaymentForm />} />
          <Route path="pagos" element={<InquilinoPayments />} />
          <Route path="payments/:id" element={<InquilinoPaymentDetail />} />
          <Route path="mensajes" element={<InquilinoMessages />} />
        </Route>

        {/* Ruta raíz - Página de bienvenida */}
        <Route path="/" element={<Welcome />} />
        
        {/* Ruta de login */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}