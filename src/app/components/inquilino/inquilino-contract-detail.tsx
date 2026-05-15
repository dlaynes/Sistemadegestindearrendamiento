import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { FileText, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { useServices } from '../../services';
import { BackButton, StatusBadge, InfoCard, SidebarActions, EmptyState } from '../shared';
import { useContract } from '../../contexts/contract-context';
import type { Payment } from '../../types';

export function InquilinoContractDetail() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  const { payment: paymentService } = useServices();

  const { getContractById } = useContract();
  const contract = id ? getContractById(id) : undefined;

  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);

  useEffect(() => {
    if (!contract?.id) return;
    let cancelled = false;
    setIsLoadingPayments(true);
    paymentService
      .getByContract(contract.id)
      .then((data) => {
        if (!cancelled) setPayments(data);
      })
      .catch(() => {
        if (!cancelled) setPayments([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingPayments(false);
      });
    return () => { cancelled = true; };
  }, [contract?.id, paymentService]);

  if (!contract) {
    return (
      <EmptyState
        icon={FileText}
        title="Contrato no encontrado"
        description="El contrato que buscas no existe"
        action={{
          label: 'Volver a Contratos',
          onClick: () => navigate('/contratos'),
        }}
      />
    );
  }

  const contractInfoItems = [
    { label: 'Código', value: contract.code },
    { label: 'Inicio', value: contract.startDate },
    { label: 'Finalización', value: contract.endDate },
    { label: 'Renta Mensual', value: contract.monthlyRent },
    { label: 'Depósito', value: contract.deposit },
  ];

  const propertyInfoItems = [
    { label: 'Propiedad', value: contract.property },
  ];

  const toMonthName = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('es', { month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <BackButton onClick={() => navigate('/contratos')} label="Volver a contratos" />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Mi Contrato</h1>
            <p className="text-gray-600">{contract.property}</p>
          </div>
          <StatusBadge status={contract.status} type="contract" size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard
            title="Información del Contrato"
            icon={FileText}
            items={contractInfoItems}
          />

          <InfoCard
            title="Propiedad"
            icon={FileText}
            items={propertyInfoItems}
          />

          <InfoCard title="Términos y Condiciones" icon={FileText} columns={1} items={[]}>
            <div className="whitespace-pre-wrap text-gray-900">{contract.terms}</div>
          </InfoCard>

          <InfoCard title="Historial de Pagos" icon={FileText} columns={1} items={[]}>
            {isLoadingPayments ? (
              <p className="text-sm text-gray-500">Cargando pagos...</p>
            ) : payments.length === 0 ? (
              <p className="text-sm text-gray-500">No hay pagos registrados.</p>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {payment.status === 'pagado' ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{toMonthName(payment.dueDate)}</p>
                        <p className="text-sm text-gray-600">{payment.dueDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{payment.amount}</p>
                      <StatusBadge status={payment.status} type="payment" size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </InfoCard>
        </div>

        <div className="space-y-6">
          <SidebarActions
            title="Acciones"
            actions={[
              {
                label: 'Descargar Contrato',
                icon: FileText,
                onClick: () => console.log('Descargar'),
                variant: 'primary',
              },
              {
                label: 'Contactar Arrendador',
                icon: MessageSquare,
                onClick: () => navigate('/mensajes'),
                variant: 'secondary',
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
