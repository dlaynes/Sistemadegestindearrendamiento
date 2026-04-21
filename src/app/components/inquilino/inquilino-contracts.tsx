import { Info } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { PageHeader, ContractCard, InfoCard } from '../shared';
import type { ContractListItem } from '../../types';

// Para inquilinos, solo mostrar su contrato actual
const mockContracts: ContractListItem[] = [
  {
    id: 3,
    code: 'CT-0003',
    tenant: 'Yo (María García)',
    property: 'Apartamento Vista Mar #103',
    startDate: '2025-09-01',
    endDate: '2026-03-01',
    monthlyRent: '$2,800',
    deposit: '$5,600',
    status: 'activo',
  },
];

export function InquilinoContracts() {
  const navigate = useRoleNavigation();

  const handleViewContract = (contract: ContractListItem) => {
    navigate(`/contratos/${contract.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Mi Contrato" 
        subtitle="Información de tu contrato de arrendamiento"
      />

      {/* Contract Card */}
      <div className="space-y-4">
        {mockContracts.map((contract) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onView={handleViewContract}
            showActions
          />
        ))}
      </div>

      {/* Info Card */}
      <InfoCard
        title="Información Importante"
        icon={Info}
        columns={1}
        items={[
          { label: 'Pago', value: 'El pago de la renta debe realizarse dentro de los primeros 5 días del mes' },
          { label: 'Historial', value: 'Puedes ver el historial de pagos en la sección de detalles del contrato' },
          { label: 'Renovación', value: 'Para solicitar renovación, contacta con tu arrendador' },
        ]}
        className="bg-blue-50 border-blue-200"
      />
    </div>
  );
}
