import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { useServices } from '../services';
import type { Payment, PaymentStatus, PaymentMethod } from '../types';

interface PaymentContextType {
  payments: Payment[];
  isLoading: boolean;
  error: string | null;
  addPayment: (payment: Payment) => Promise<void>;
  updatePayment: (id: string, payment: Payment) => Promise<void>;
  deletePayment: (id: string) => Promise<void>;
  getPaymentById: (id: string) => Payment | undefined;
  getPaymentsByContract: (contractId: string | number) => Payment[];
  getPaymentsByStatus: (status: PaymentStatus) => Payment[];
  getPaymentsByMethod: (method: PaymentMethod) => Payment[];
  getPendingPayments: () => Payment[];
  getMyPayments: () => Payment[];
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const { payment: paymentService } = useServices();
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    paymentService
      .getAll()
      .then((data) => {
        if (!cancelled) {
          setPayments(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [paymentService, user]);

  const addPayment = useCallback(
    async (payment: Payment) => {
      const created = await paymentService.create(payment);
      setPayments((prev) => [...prev, created]);
    },
    [paymentService]
  );

  const updatePayment = useCallback(
    async (id: string, payment: Payment) => {
      const updated = await paymentService.update(id, payment);
      setPayments((prev) =>
        prev.map((p) => (String(p.id) === id ? updated : p))
      );
    },
    [paymentService]
  );

  const deletePayment = useCallback(
    async (id: string) => {
      await paymentService.delete(id);
      setPayments((prev) => prev.filter((p) => String(p.id) !== id));
    },
    [paymentService]
  );

  const getPaymentById = useCallback(
    (id: string) => {
      return payments.find((p) => String(p.id) === id);
    },
    [payments]
  );

  const getPaymentsByContract = useCallback(
    (contractId: string | number) => {
      return payments.filter((p) => String(p.contractId) === String(contractId));
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

  const getMyPayments = useCallback(() => {
    if (!user) return [];
    if (user.role === 'administrador') return payments;
    if (user.role === 'arrendador') {
      // For mock: payments for properties owned by user
      // Simplified: return all for now
      return payments;
    }
    // inquilino - filter by tenant name
    return payments.filter((p) => p.tenantName === user.name);
  }, [payments, user]);

  return (
    <PaymentContext.Provider
      value={{
        payments,
        isLoading,
        error,
        addPayment,
        updatePayment,
        deletePayment,
        getPaymentById,
        getPaymentsByContract,
        getPaymentsByStatus,
        getPaymentsByMethod,
        getPendingPayments,
        getMyPayments,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment debe ser usado dentro de un PaymentProvider');
  }
  return context;
}
