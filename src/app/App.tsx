import { ContractProvider } from './contexts';
import { AuthProvider } from './contexts/auth-context';
import { PropertyProvider } from './contexts/property-context';
import { AppRouter } from './router';

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <ContractProvider>
          <AppRouter />
        </ContractProvider>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;
