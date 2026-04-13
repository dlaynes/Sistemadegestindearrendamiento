export type PaymentStatus = 'pendiente' | 'procesado' | 'completado' | 'cancelado' | 'fallido';
export type PaymentMethod = 'transferencia' | 'cheque' | 'tarjeta' | 'efectivo' | 'digital';

export interface Payment {
  id: string;
  contractId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  dueDate: string;
  paidDate?: string;
  transactionId?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentFormData {
  contractId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  dueDate: string;
  notes?: string;
}
