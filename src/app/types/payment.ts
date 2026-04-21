// Unified Payment Types

export type PaymentStatus = 'pendiente' | 'pagado' | 'vencido' | 'procesando';

export type PaymentMethod = 'transferencia' | 'cheque' | 'tarjeta' | 'efectivo' | 'digital';

export interface Payment {
  id: string | number;
  contractId: string | number;
  amount: string;
  status: PaymentStatus;
  method: PaymentMethod;
  dueDate: string;
  paidDate?: string;
  transactionId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// For list/history views
export interface PaymentHistoryItem {
  month: string;
  amount: string;
  status: PaymentStatus;
  date: string;
}
