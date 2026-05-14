import { ServicesProvider } from './services';
import { AuthProvider } from './contexts/auth-context';
import { PropertyProvider } from './contexts/property-context';
import { ContractProvider } from './contexts/contract-context';
import { PaymentProvider } from './contexts/payment-context';
import { DashboardProvider } from './contexts/dashboard-context';
import { AppRouter } from './router';

function App() {
  return (
    <ServicesProvider>
      <AuthProvider>
        <PropertyProvider>
          <ContractProvider>
            <PaymentProvider>
              <DashboardProvider>
                <AppRouter />
              </DashboardProvider>
            </PaymentProvider>
          </ContractProvider>
        </PropertyProvider>
      </AuthProvider>
    </ServicesProvider>
  );
}

export default App;
