import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type PaymentStatus = 'pendiente' | 'completado' | 'fallido';
type PaymentMethod = 'transferencia' | 'tarjeta' | 'efectivo';

interface Payment {
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

interface PaymentContextType {
  payments: Payment[];
  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, payment: Payment) => void;
  deletePayment: (id: string) => void;
  getPaymentById: (id: string) => Payment | undefined;
  getPaymentsByContract: (contractId: string) => Payment[];
  getPaymentsByStatus: (status: PaymentStatus) => Payment[];
  getPaymentsByMethod: (method: PaymentMethod) => Payment[];
  getPendingPayments: () => Payment[];
  getTotalPendingByContract: (contractId: string) => number;
}

interface PaymentContextProps {
  children: ReactNode;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: PaymentContextProps) {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 'P-001',
      contractId: 'CT-001',
      amount: 850,
      status: 'completado',
      method: 'transferencia',
      dueDate: '2026-04-05',
      paidDate: '2026-04-04',
      transactionId: 'TRX-001',
      notes: 'Pago de abril 2026',
      createdAt: '2026-04-04T10:00:00Z',
      updatedAt: '2026-04-04T10:00:00Z',
    },
    {
      id: 'P-002',
      contractId: 'CT-001',
      amount: 850,
      status: 'pendiente',
      method: 'transferencia',
      dueDate: '2026-05-05',
      notes: 'Pago de mayo 2026',
      createdAt: '2026-05-05T00:00:00Z',
      updatedAt: '2026-05-05T00:00:00Z',
    },
    {
      id: 'P-003',
      contractId: 'CT-002',
      amount: 1200,
      status: 'completado',
      method: 'tarjeta',
      dueDate: '2026-04-05',
      paidDate: '2026-04-03',
      transactionId: 'TRX-002',
      notes: 'Pago de abril 2026',
      createdAt: '2026-04-03T14:30:00Z',
      updatedAt: '2026-04-03T14:30:00Z',
    },
  ]);

  const addPayment = useCallback((payment: Payment) => {
    setPayments((prevPayments) => [...prevPayments, payment]);
  }, []);

  const updatePayment = useCallback((id: string, payment: Payment) => {
    setPayments((prevPayments) =>
      prevPayments.map((p) => (p.id === id ? payment : p))
    );
  }, []);

  const deletePayment = useCallback((id: string) => {
    setPayments((prevPayments) =>
      prevPayments.filter((p) => p.id !== id)
    );
  }, []);

  const getPaymentById = useCallback(
    (id: string) => {
      return payments.find((p) => p.id === id);
    },
    [payments]
  );

  const getPaymentsByContract = useCallback(
    (contractId: string) => {
      return payments.filter((p) => p.contractId === contractId);
    },
    [payments]
  );

  const getPaymentsByStatus = useCallback(
    (status: PaymentStatus) => {
      return payments.filter((p) => p.status === status);
    },
    [payments]
  );

  const getPaymentsByMethod = useCallback(
    (method: PaymentMethod) => {
      return payments.filter((p) => p.method === method);
    },
    [payments]
  );

  const getPendingPayments = useCallback(() => {
    return payments.filter((p) => p.status === 'pendiente');
  }, [payments]);

  const getTotalPendingByContract = useCallback(
    (contractId: string) => {
      return payments
        .filter(
          (p) => p.contractId === contractId && p.status === 'pendiente'
        )
        .reduce((total, p) => total + p.amount, 0);
    },
    [payments]
  );

  return (
    <PaymentContext.Provider
      value={{
        payments,
        addPayment,
        updatePayment,
        deletePayment,
        getPaymentById,
        getPaymentsByContract,
        getPaymentsByStatus,
        getPaymentsByMethod,
        getPendingPayments,
        getTotalPendingByContract,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment debe ser usado dentro de un PaymentProvider');
  }
  return context;
}
