import { createContext, useContext, ReactNode } from 'react';
import type { AuthService } from './auth.service';
import type { PropertyService } from './property.service';
import type { ContractService } from './contract.service';
import type { PaymentService } from './payment.service';
import type { DashboardService } from './dashboard.service';
import type { MessageService } from './message.service';
import type { DocumentService } from './document.service';
import type { ReportService } from './report.service';
import { ApiAuthService } from './auth.service';
import { ApiPropertyService } from './property.service';
import { ApiContractService } from './contract.service';
import { ApiPaymentService } from './payment.service';
import { ApiDashboardService } from './dashboard.service';
import { ApiMessageService } from './message.service';
import { AlertService, ApiAlertService } from './alert.service';
import { ApiDocumentService } from './document.service';
import { ApiReportService } from './report.service';

export interface Services {
  auth: AuthService;
  property: PropertyService;
  contract: ContractService;
  payment: PaymentService;
  dashboard: DashboardService;
  message: MessageService;
  alert: AlertService;
  document: DocumentService;
  report: ReportService;
}

export function createServices(): Services {
  return {
    auth: new ApiAuthService(),
    property: new ApiPropertyService(),
    contract: new ApiContractService(),
    payment: new ApiPaymentService(),
    dashboard: new ApiDashboardService(),
    message: new ApiMessageService(),
    alert: new ApiAlertService(),
    document: new ApiDocumentService(),
    report: new ApiReportService(),
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
