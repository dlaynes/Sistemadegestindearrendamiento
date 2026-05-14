import { createContext, useContext, ReactNode } from 'react';
import type { AuthService } from './auth.service';
import type { PropertyService } from './property.service';
import type { ContractService } from './contract.service';
import type { PaymentService } from './payment.service';
import type { DashboardService } from './dashboard.service';
import { ApiAuthService } from './auth.service';
import { ApiPropertyService } from './property.service';
import { ApiContractService } from './contract.service';
import { ApiPaymentService } from './payment.service';
import { ApiDashboardService } from './dashboard.service';

export interface Services {
  auth: AuthService;
  property: PropertyService;
  contract: ContractService;
  payment: PaymentService;
  dashboard: DashboardService;
}

export function createServices(): Services {
  return {
    auth: new ApiAuthService(),
    property: new ApiPropertyService(),
    contract: new ApiContractService(),
    payment: new ApiPaymentService(),
    dashboard: new ApiDashboardService(),
  };
}

const ServicesContext = createContext<Services | undefined>(undefined);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const services = createServices();
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices(): Services {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices debe ser usado dentro de un ServicesProvider');
  }
  return context;
}
