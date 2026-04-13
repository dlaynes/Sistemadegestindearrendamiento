// Contexto de Propiedades (nivel base)
export { PropertyProvider, useProperty } from './property-context';
export type { Property, PropertyStatus, PropertyFormData } from '../types/property';

// Contexto de Contratos (depende de PropertyContext)
export { ContractProvider, useContract } from './contract-context';
export type { Contract, ContractStatus, ContractFormData } from '../types/contract';

// Contexto de Pagos (depende de ContractContext)
export { PaymentProvider, usePayment } from './payment-context';
export type { Payment, PaymentStatus, PaymentMethod, PaymentFormData } from '../types/payment';
