export type { AuthService } from './auth.service';
export type { PropertyService } from './property.service';
export type { ContractService } from './contract.service';
export type { PaymentService } from './payment.service';
export type { DashboardService, DashboardStats, DashboardData, ActivityItem, UpcomingPayment } from './dashboard.service';
export type { MessageService, Conversation, Message } from './message.service';
export type { DocumentService, DocumentItem } from './document.service';

export { ApiAuthService } from './auth.service';
export { ApiPropertyService } from './property.service';
export { ApiContractService } from './contract.service';
export { ApiPaymentService } from './payment.service';
export { ApiDashboardService } from './dashboard.service';
export { ApiMessageService } from './message.service';
export { ApiDocumentService } from './document.service';

export { ServicesProvider, useServices, createServices } from './service-context';
export type { Services } from './service-context';
