import { ServicesProvider } from './services';
import { AuthProvider, useAuth } from './contexts/auth-context';
import { PropertyProvider } from './contexts/property-context';
import { ContractProvider } from './contexts/contract-context';
import { PaymentProvider } from './contexts/payment-context';
import { DashboardProvider } from './contexts/dashboard-context';
import { AppRouter } from './router';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Iniciando sesión…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <ServicesProvider>
      <AuthProvider>
        <AuthGate>
          <PropertyProvider>
            <ContractProvider>
              <PaymentProvider>
                <DashboardProvider>
                  <AppRouter />
                </DashboardProvider>
              </PaymentProvider>
            </ContractProvider>
          </PropertyProvider>
        </AuthGate>
      </AuthProvider>
    </ServicesProvider>
  );
}

export default App;
