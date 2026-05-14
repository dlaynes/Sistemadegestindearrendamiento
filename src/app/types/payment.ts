// Unified Payment Types

export type PaymentStatus = 'pendiente' | 'procesando' | 'pagado' | 'vencido' | 'rechazado';
export type PaymentMethod = 'transferencia' | 'cheque' | 'tarjeta' | 'efectivo' | 'digital';

export interface PaymentBreakdownItem {
  concept: string;
  amount: number;
}

export interface RelatedPayment {
  month: string;
  status: PaymentStatus;
  date: string;
}

export interface Payment {
  id: string | number;
  contractId: string | number;
  tenantId?: number;
  tenantName?: string;
  tenantEmail?: string;
  property?: string;
  propertyAddress?: string;
  amount: string;
  status: PaymentStatus;
  method: PaymentMethod;
  dueDate: string;
  paidDate?: string;
  referenceNumber?: string;
  transactionId?: string;
  notes?: string;
  breakdown?: PaymentBreakdownItem[];
  relatedPayments?: RelatedPayment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentHistoryItem {
  month: string;
  amount: string;
  status: PaymentStatus;
  date: string;
}
