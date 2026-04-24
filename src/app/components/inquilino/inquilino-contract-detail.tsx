import { useParams } from 'react-router';
import { FileText, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { BackButton, StatusBadge, InfoCard, SidebarActions, EmptyState } from '../shared';
import type { PaymentHistoryItem } from '../../types';
import { useContract } from '../../contexts/contract-context';


const mockPaymentHistory: PaymentHistoryItem[] = [
  { month: 'Marzo 2026', amount: '$2,800', status: 'pagado', date: '2026-03-01' },
  { month: 'Febrero 2026', amount: '$2,800', status: 'pagado', date: '2026-02-01' },
  { month: 'Enero 2026', amount: '$2,800', status: 'pagado', date: '2026-01-01' },
];

export function InquilinoContractDetail() {
  const { id } = useParams();
  const navigate = useRoleNavigation();

  const { getContractById } = useContract();
  const contract = id ? getContractById(id) : undefined;

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

          <InfoCard title="Términos y Condiciones" icon={FileText} columns={1}>
            <ul className="space-y-2">
              {contract.terms?.map((term, index) => (
                <li key={index} className="text-gray-900">
                  • {term}
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="Historial de Pagos" icon={FileText} columns={1}>
            <div className="space-y-3">
              {mockPaymentHistory.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {payment.status === 'pagado' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{payment.month}</p>
                      <p className="text-sm text-gray-600">{payment.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{payment.amount}</p>
                    <StatusBadge status={payment.status} type="payment" size="sm" />
                  </div>
                </div>
              ))}
            </div>
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
