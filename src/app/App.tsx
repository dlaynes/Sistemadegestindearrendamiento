import { ServicesProvider } from './services';
import { AuthProvider, useAuth } from './contexts/auth-context';
import { PropertyProvider } from './contexts/property-context';
import { ContractProvider } from './contexts/contract-context';
import { PaymentProvider } from './contexts/payment-context';
import { DashboardProvider } from './contexts/dashboard-context';
import { ThemeProvider } from './contexts/theme-context';
import { ErrorBoundary } from './components/error-boundary';
import { AppRouter } from './router';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Iniciando sesión…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <ServicesProvider>
        <AuthProvider>
          <AuthGate>
            <PropertyProvider>
              <ContractProvider>
                <PaymentProvider>
                  <DashboardProvider>
                    <ErrorBoundary>
                      <AppRouter />
                    </ErrorBoundary>
                  </DashboardProvider>
                </PaymentProvider>
              </ContractProvider>
            </PropertyProvider>
          </AuthGate>
        </AuthProvider>
      </ServicesProvider>
    </ThemeProvider>
  );
}

export default App;
