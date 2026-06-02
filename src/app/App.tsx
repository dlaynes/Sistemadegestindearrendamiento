import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { ServicesProvider } from './services';
import { AuthProvider, useAuth } from './contexts/auth-context';
import { PropertyProvider } from './contexts/property-context';
import { ContractProvider } from './contexts/contract-context';
import { PaymentProvider } from './contexts/payment-context';
import { DashboardProvider } from './contexts/dashboard-context';
import { ThemeProvider } from './contexts/theme-context';
import { ErrorBoundary } from './components/error-boundary';
import { AppRouter } from './router';
import { Spinner } from './components/shared/ui/spinner';

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthReady } = useAuth();

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="xl" label="Iniciando sesión" />
          <p className="text-sm text-muted-foreground">Iniciando sesión…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
