import { useParams } from 'react-router';
import { 
  FileText, 
  User,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  Download,
  MessageSquare
} from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { 
  BackButton, 
  StatusBadge, 
  InfoCard, 
  SidebarActions, 
  EmptyState,
  getDaysUntilExpiration
} from '../shared';

const mockContracts = [
  {
    id: 3,
    code: 'CT-0003',
    tenant: 'María García',
    tenantEmail: 'maria.garcia@email.com',
    tenantPhone: '+1 (555) 345-6789',
    landlord: 'Carlos Rodríguez',
    landlordEmail: 'carlos.rodriguez@email.com',
    property: 'Apartamento Vista Mar #103',
    propertyAddress: 'Malecón 789, Playa',
    startDate: '2025-09-01',
    endDate: '2026-03-01',
    monthlyRent: '$2,800',
    deposit: '$5,600',
    status: 'activo' as const,
    paymentDay: 1,
    terms: [
      'El arrendatario se compromete a pagar la renta mensual puntualmente.',
      'No se permiten fiestas o reuniones ruidosas.',
      'El uso de amenidades compartidas debe respetar el reglamento.',
      'Prohibido fumar dentro de la propiedad.',
    ],
  },
];

const mockPaymentHistory = [
  { month: 'Marzo 2026', amount: '$2,800', status: 'pagado' as const, date: '2026-03-01' },
  { month: 'Febrero 2026', amount: '$2,800', status: 'pagado' as const, date: '2026-02-01' },
  { month: 'Enero 2026', amount: '$2,800', status: 'pagado' as const, date: '2026-01-01' },
];

export function InquilinoContractDetail() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  
  const contract = mockContracts.find(c => c.id === Number(id));

  if (!contract) {
    return (
      <EmptyState
        icon={FileText}
        title="Contrato no encontrado"
        description="El contrato que buscas no existe"
        action={{
          label: "Volver a Contratos",
          onClick: () => navigate('/contratos')
        }}
      />
    );
  }

  const daysLeft = getDaysUntilExpiration(contract.endDate, new Date('2026-03-27'));
  const isExpiringSoon = daysLeft <= 90;

  const contractInfoItems = [
    { label: 'Código', value: contract.code, icon: FileText },
    { label: 'Inicio', value: contract.startDate, icon: Calendar },
    { label: 'Finalización', value: contract.endDate, icon: Calendar },
    { label: 'Renta Mensual', value: contract.monthlyRent, icon: DollarSign },
    { label: 'Depósito', value: contract.deposit, icon: DollarSign },
    { label: 'Día de Pago', value: `${contract.paymentDay} de cada mes`, icon: Clock },
  ];

  const landlordInfoItems = [
    { label: 'Nombre', value: contract.landlord, icon: User },
    { label: 'Email', value: contract.landlordEmail, icon: Mail },
  ];

  const propertyInfoItems = [
    { label: 'Propiedad', value: contract.property, icon: Building2 },
    { label: 'Dirección', value: contract.propertyAddress, icon: Building2 },
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

      {isExpiringSoon && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            Tu contrato vence en {daysLeft} días - Contacta a tu arrendador para renovación
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard
            title="Información del Contrato"
            icon={FileText}
            items={contractInfoItems}
          />

          <InfoCard
            title="Información del Arrendador"
            icon={User}
            items={landlordInfoItems}
          />

          <InfoCard
            title="Propiedad"
            icon={Building2}
            items={propertyInfoItems}
          />

          <InfoCard
            title="Términos y Condiciones"
            icon={FileText}
            columns={1}
          >
            <ul className="space-y-2">
              {contract.terms.map((term, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-gray-900">• {term}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard
            title="Historial de Pagos"
            icon={DollarSign}
            columns={1}
          >
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
                icon: Download, 
                onClick: () => console.log('Descargar'), 
                variant: 'primary' 
              },
              { 
                label: 'Contactar Arrendador', 
                icon: MessageSquare, 
                onClick: () => navigate('/mensajes'), 
                variant: 'secondary' 
              },
            ]}
          />

          <InfoCard
            title="Información de Contacto"
            icon={Phone}
            items={[
              { label: 'Email', value: contract.landlordEmail },
              { label: 'Teléfono', value: contract.tenantPhone },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
