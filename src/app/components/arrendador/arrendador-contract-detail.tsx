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
  Edit,
  Trash2,
  Download,
  FileDown
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
    id: 1,
    code: 'CT-0001',
    tenant: 'Juan Pérez',
    tenantEmail: 'juan.perez@email.com',
    tenantPhone: '+1 (555) 123-4567',
    property: 'Apartamento Centro #101',
    propertyAddress: 'Calle Principal 123, Centro',
    startDate: '2025-06-01',
    endDate: '2026-06-01',
    monthlyRent: '$3,200',
    deposit: '$6,400',
    status: 'activo' as const,
    paymentDay: 5,
    terms: [
      'El arrendatario se compromete a pagar la renta mensual puntualmente.',
      'No se permiten mascotas sin autorización previa del arrendador.',
    ],
  },
  {
    id: 2,
    code: 'CT-0002',
    tenant: 'Ana Martínez',
    tenantEmail: 'ana.martinez@email.com',
    tenantPhone: '+1 (555) 234-5678',
    property: 'Casa Residencial #102',
    propertyAddress: 'Av. Los Pinos 456, Zona Norte',
    startDate: '2025-08-15',
    endDate: '2027-08-15',
    monthlyRent: '$4,500',
    deposit: '$9,000',
    status: 'activo' as const,
    paymentDay: 15,
    terms: [
      'El arrendatario se compromete a pagar la renta mensual puntualmente.',
      'Se permite máximo 2 mascotas pequeñas.',
    ],
  },
];

const mockPaymentHistory = [
  { month: 'Marzo 2026', amount: '$3,200', status: 'pagado' as const, date: '2026-03-04' },
  { month: 'Febrero 2026', amount: '$3,200', status: 'pagado' as const, date: '2026-02-03' },
  { month: 'Enero 2026', amount: '$3,200', status: 'pagado' as const, date: '2026-01-04' },
];

export function ArrendadorContractDetail() {
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

  const tenantInfoItems = [
    { label: 'Nombre', value: contract.tenant, icon: User },
    { label: 'Email', value: contract.tenantEmail, icon: Mail },
    { label: 'Teléfono', value: contract.tenantPhone, icon: Phone },
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
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">{contract.code}</h1>
            <p className="text-gray-600">{contract.property}</p>
          </div>
          <StatusBadge status={contract.status} type="contract" size="lg" />
        </div>
      </div>

      {isExpiringSoon && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            El contrato vence en {daysLeft} días - Considera renovar o buscar nuevo inquilino
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
            title="Información del Inquilino"
            icon={User}
            items={tenantInfoItems}
          />

          <InfoCard
            title="Propiedad"
            icon={Building2}
            items={propertyInfoItems}
          />

          <InfoCard
            title="Términos y Condiciones"
            icon={FileText}
            columns={1} items={[]}          >
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
            columns={1} items={[]}          >
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
                label: 'Editar Contrato', 
                icon: Edit, 
                onClick: () => navigate(`/contracts/${contract.id}/edit`), 
                variant: 'primary' 
              },
              { 
                label: 'Renovar', 
                icon: Calendar, 
                onClick: () => console.log('Renovar'), 
                variant: 'secondary' 
              },
              { 
                label: 'Descargar PDF', 
                icon: FileDown, 
                onClick: () => console.log('Download'), 
                variant: 'secondary' 
              },
              { 
                label: 'Eliminar', 
                icon: Trash2, 
                onClick: () => console.log('Eliminar'), 
                variant: 'danger' 
              },
            ]}
          />

          <SidebarActions
            title="Documentos"
            actions={[
              { 
                label: 'Descargar Contrato', 
                icon: Download, 
                onClick: () => console.log('Descargar'), 
                variant: 'secondary' 
              },
              { 
                label: 'Ver Facturas', 
                icon: FileText, 
                onClick: () => console.log('Facturas'), 
                variant: 'secondary' 
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
