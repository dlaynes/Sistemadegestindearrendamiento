import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Login } from './components/login';
import { InvitationAccept } from './components/invitation-accept';
import Welcome from './components/welcome';
import { ProtectedLayout } from './components/protected-layout';
import { ProtectedRoute } from './components/protected-route';
import { Spinner } from './components/shared/ui/spinner';

// Admin
import { AdminDashboard } from './components/admin/admin-dashboard';
import { AdminProperties } from './components/admin/admin-properties';
import { AdminPropertyDetail } from './components/admin/admin-property-detail';
import { AdminPropertyForm } from './components/admin/admin-property-form';
import { AdminContracts } from './components/admin/admin-contracts';
import { AdminContractDetail } from './components/admin/admin-contract-detail';
import { AdminPayments } from './components/admin/admin-payments';
import { AdminPaymentDetail } from './components/admin/admin-payment-detail';
import { AdminUsers } from './components/admin/admin-users';
import { AdminUserForm } from './components/admin/admin-user-form';
import { AdminUserDetail } from './components/admin/admin-user-detail';
import { AdminUserProperties } from './components/admin/admin-user-properties';
import { AdminReports } from './components/admin/admin-reports';

// Arrendador
import { ArrendadorDashboard } from './components/arrendador/arrendador-dashboard';
import { ArrendadorProperties } from './components/arrendador/arrendador-properties';
import { ArrendadorPropertyDetail } from './components/arrendador/arrendador-property-detail';
import { ArrendadorPropertyForm } from './components/arrendador/arrendador-property-form';
import { ArrendadorContracts } from './components/arrendador/arrendador-contracts';
import { ArrendadorContractDetail } from './components/arrendador/arrendador-contract-detail';
import { ArrendadorContractWizard } from './components/arrendador/arrendador-contract-wizard';
import { ArrendadorPayments } from './components/arrendador/arrendador-payments';
import { ArrendadorPaymentDetail } from './components/arrendador/arrendador-payment-detail';
import { ArrendadorMessages } from './components/arrendador/arrendador-messages';

// Inquilino
import { InquilinoDashboard } from './components/inquilino/inquilino-dashboard';
import { InquilinoProperties } from './components/inquilino/inquilino-properties';
import { InquilinoPropertyDetail } from './components/inquilino/inquilino-property-detail';
import { InquilinoPropertyForm } from './components/inquilino/inquilino-property-form';
import { InquilinoContracts } from './components/inquilino/inquilino-contracts';
import { InquilinoContractDetail } from './components/inquilino/inquilino-contract-detail';
import { InquilinoPayments } from './components/inquilino/inquilino-payments';
import { InquilinoPaymentDetail } from './components/inquilino/inquilino-payment-detail';
import { InquilinoPaymentForm } from './components/inquilino/inquilino-payment-form';
import { InquilinoMessages } from './components/inquilino/inquilino-messages';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/invitation" element={<InvitationAccept />} />

        {/* Admin */}
        <Route
          path="/administrador"
          element={
            <ProtectedRoute allowedRoles={['administrador']}>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="propiedades" element={<AdminProperties />} />
          <Route path="propiedades/nueva" element={<AdminPropertyForm />} />
          <Route path="propiedades/:id" element={<AdminPropertyDetail />} />
          <Route path="propiedades/:id/editar" element={<AdminPropertyForm />} />
          <Route path="contratos" element={<AdminContracts />} />
          <Route path="contratos/:id" element={<AdminContractDetail />} />
          <Route path="pagos" element={<AdminPayments />} />
          <Route path="pagos/:id" element={<AdminPaymentDetail />} />
          <Route path="usuarios" element={<AdminUsers />} />
          <Route path="usuarios/nuevo" element={<AdminUserForm />} />
          <Route path="usuarios/:id" element={<AdminUserDetail />} />
          <Route path="usuarios/:id/editar" element={<AdminUserForm />} />
          <Route path="usuarios/:id/propiedades" element={<AdminUserProperties />} />
          <Route path="reportes" element={<AdminReports />} />
        </Route>

        {/* Arrendador */}
        <Route
          path="/arrendador"
          element={
            <ProtectedRoute allowedRoles={['arrendador']}>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ArrendadorDashboard />} />
          <Route path="propiedades" element={<ArrendadorProperties />} />
          <Route path="propiedades/nueva" element={<ArrendadorPropertyForm />} />
          <Route path="propiedades/:id" element={<ArrendadorPropertyDetail />} />
          <Route path="propiedades/:id/editar" element={<ArrendadorPropertyForm />} />
          <Route path="contratos" element={<ArrendadorContracts />} />
          <Route path="contratos/nuevo" element={<ArrendadorContractWizard />} />
          <Route path="contratos/:id" element={<ArrendadorContractDetail />} />
          <Route path="pagos" element={<ArrendadorPayments />} />
          <Route path="pagos/:id" element={<ArrendadorPaymentDetail />} />
          <Route path="mensajes" element={<ArrendadorMessages />} />
        </Route>

        {/* Inquilino */}
        <Route
          path="/inquilino"
          element={
            <ProtectedRoute allowedRoles={['inquilino']}>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<InquilinoDashboard />} />
          <Route path="propiedades" element={<InquilinoProperties />} />
          <Route path="propiedades/:id" element={<InquilinoPropertyDetail />} />
          <Route path="propiedades/:id/editar" element={<InquilinoPropertyForm />} />
          <Route path="contratos" element={<InquilinoContracts />} />
          <Route path="contratos/:id" element={<InquilinoContractDetail />} />
          <Route path="contratos/:contractId/pagos/nuevo" element={<InquilinoPaymentForm />} />
          <Route path="pagos" element={<InquilinoPayments />} />
          <Route path="pagos/:id" element={<InquilinoPaymentDetail />} />
          <Route path="mensajes" element={<InquilinoMessages />} />
        </Route>

        <Route path="/" element={<Welcome />} />
      </Routes>
    </BrowserRouter>
  );
}

// Re-export the loading fallback for protected-route.tsx and protected-layout.tsx
export function RouterLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Spinner size="xl" label="Cargando" />
    </div>
  );
}
