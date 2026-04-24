import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Payment, PaymentStatus, PaymentMethod } from '../types';

interface PaymentContextType {
  payments: Payment[];
  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, payment: Payment) => void;
  deletePayment: (id: string) => void;
  getPaymentById: (id: string) => Payment | undefined;
  getPaymentsByContract: (contractId: string | number) => Payment[];
  getPaymentsByStatus: (status: PaymentStatus) => Payment[];
  getPaymentsByMethod: (method: PaymentMethod) => Payment[];
  getPendingPayments: () => Payment[];
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

const initialPayments: Payment[] = [
  {
    id: 1,
    contractId: 1,
    tenant: 'Juan Pérez',
    tenantEmail: 'juan.perez@email.com',
    property: 'Apartamento Centro #101',
    propertyAddress: 'Calle Principal 123, Centro',
    amount: '3200',
    status: 'pagado',
    method: 'transferencia',
    dueDate: '2026-03-05',
    paidDate: '2026-03-04',
    referenceNumber: 'TRF-20260304-001',
    notes: 'Pago realizado un día antes del vencimiento.',
    breakdown: [
      { concept: 'Renta mensual', amount: 3200 },
      { concept: 'Mantenimiento', amount: 0 },
      { concept: 'Servicios', amount: 0 }
    ],
    relatedPayments: [
      { month: 'Febrero 2026', status: 'pagado', date: '2026-02-03' },
      { month: 'Enero 2026', status: 'pagado', date: '2026-01-04' },
      { month: 'Diciembre 2025', status: 'pagado', date: '2025-12-04' }
    ]
  },
  {
    id: 2,
    contractId: 2,
    tenant: 'Ana Martínez',
    tenantEmail: 'ana.martinez@email.com',
    property: 'Casa Residencial #102',
    propertyAddress: 'Av. Los Pinos 456, Zona Norte',
    amount: '4500',
    status: 'pagado',
    method: 'efectivo',
    dueDate: '2026-03-15',
    paidDate: '2026-03-14',
    referenceNumber: 'EFE-20260314-002',
    notes: 'Pago recibido en efectivo en oficina.',
    breakdown: [
      { concept: 'Renta mensual', amount: 4500 },
      { concept: 'Mantenimiento', amount: 0 },
      { concept: 'Servicios', amount: 0 }
    ],
    relatedPayments: [
      { month: 'Febrero 2026', status: 'pagado', date: '2026-02-14' },
      { month: 'Enero 2026', status: 'pagado', date: '2026-01-15' },
      { month: 'Diciembre 2025', status: 'pagado', date: '2025-12-15' }
    ]
  },
  {
    id: 3,
    contractId: 3,
    tenant: 'María García',
    tenantEmail: 'maria.garcia@email.com',
    property: 'Apartamento Vista Mar #103',
    propertyAddress: 'Malecón 789, Playa',
    amount: '2800',
    status: 'vencido',
    method: 'transferencia',
    dueDate: '2026-03-20',
    notes: 'Pago vencido. Se ha enviado recordatorio.',
    breakdown: [
      { concept: 'Renta mensual', amount: 2800 },
      { concept: 'Mantenimiento', amount: 0 },
      { concept: 'Servicios', amount: 0 }
    ],
    relatedPayments: [
      { month: 'Febrero 2026', status: 'pagado', date: '2026-02-01' },
      { month: 'Enero 2026', status: 'pagado', date: '2026-01-01' },
      { month: 'Diciembre 2025', status: 'pagado', date: '2025-12-01' }
    ]
  },
  {
    id: 4,
    contractId: 4,
    tenant: 'Laura Gómez',
    tenantEmail: 'laura.gomez@email.com',
    property: 'Casa Familiar #201',
    propertyAddress: 'Residencial Las Flores 555',
    amount: '5500',
    status: 'pendiente',
    method: 'transferencia',
    dueDate: '2026-04-10',
    notes: 'Pago programado para la primera semana de abril.',
    breakdown: [
      { concept: 'Renta mensual', amount: 5500 },
      { concept: 'Mantenimiento', amount: 0 },
      { concept: 'Servicios', amount: 0 }
    ],
    relatedPayments: [
      { month: 'Marzo 2026', status: 'pagado', date: '2026-03-10' },
      { month: 'Febrero 2026', status: 'pagado', date: '2026-02-10' },
      { month: 'Enero 2026', status: 'pagado', date: '2026-01-10' }
    ]
  },
  {
    id: 5,
    contractId: 5,
    tenant: 'Roberto Silva',
    tenantEmail: 'roberto.silva@email.com',
    property: 'Estudio Moderno #104',
    propertyAddress: 'Calle Comercial 321, Centro',
    amount: '2200',
    status: 'pendiente',
    method: 'transferencia',
    dueDate: '2026-04-08',
    notes: 'Pago pendiente de confirmación.',
    breakdown: [
      { concept: 'Renta mensual', amount: 2200 },
      { concept: 'Mantenimiento', amount: 0 },
      { concept: 'Servicios', amount: 0 }
    ],
    relatedPayments: [
      { month: 'Marzo 2026', status: 'pagado', date: '2026-03-08' },
      { month: 'Febrero 2026', status: 'pagado', date: '2026-02-08' },
      { month: 'Enero 2026', status: 'pagado', date: '2026-01-08' }
    ]
  },
  {
    id: 6,
    contractId: 6,
    tenant: 'Carlos López',
    tenantEmail: 'carlos.lopez@email.com',
    property: 'Loft Industrial #205',
    propertyAddress: 'Zona Industrial 234',
    amount: '3800',
    status: 'pendiente',
    method: 'transferencia',
    dueDate: '2026-04-05',
    notes: 'Pago pendiente de confirmación.',
    breakdown: [
      { concept: 'Renta mensual', amount: 3800 },
      { concept: 'Mantenimiento', amount: 0 },
      { concept: 'Servicios', amount: 0 }
    ],
    relatedPayments: [
      { month: 'Marzo 2026', status: 'pagado', date: '2026-03-05' },
      { month: 'Febrero 2026', status: 'pagado', date: '2026-02-05' },
      { month: 'Enero 2026', status: 'pagado', date: '2026-01-05' }
    ]
  },
  {
    id: 7,
    contractId: 7,
    tenant: 'María García',
    property: 'Apartamento Vista Mar #103',
    amount: '2800',
    status: 'pagado',
    method: 'transferencia',
    dueDate: '2026-02-01',
    paidDate: '2026-02-01',
    referenceNumber: 'TRF-20260201-003',
  },
  {
    id: 8,
    contractId: 8,
    tenant: 'María García',
    property: 'Apartamento Vista Mar #103',
    amount: '2800',
    status: 'pagado',
    method: 'transferencia',
    dueDate: '2026-01-01',
    paidDate: '2025-12-30',
    referenceNumber: 'TRF-20251230-004',
  },
];

export function PaymentProvider({ children }: { children: ReactNode }) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);

  const addPayment = useCallback((payment: Payment) => {
    setPayments((prev) => [...prev, { ...payment, id: payment.id || prev.length + 1 }]);
  }, []);

  const updatePayment = useCallback((id: string, payment: Payment) => {
    setPayments((prev) =>
      prev.map((p) => (String(p.id) === id ? { ...payment, id: p.id } : p))
    );
  }, []);

  const deletePayment = useCallback((id: string) => {
    setPayments((prev) => prev.filter((p) => String(p.id) !== id));
  }, []);

  const getPaymentById = useCallback((id: string) => {
    return payments.find((p) => String(p.id) === id);
  }, [payments]);

  const getPaymentsByContract = useCallback((contractId: string | number) => {
    return payments.filter((p) => String(p.contractId) === String(contractId));
  }, [payments]);

  const getPaymentsByStatus = useCallback((status: PaymentStatus) => {
    return payments.filter((p) => p.status === status);
  }, [payments]);

  const getPaymentsByMethod = useCallback((method: PaymentMethod) => {
    return payments.filter((p) => p.method === method);
  }, [payments]);

  const getPendingPayments = useCallback(() => {
    return payments.filter((p) => p.status === 'pendiente');
  }, [payments]);

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
