import { Info } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { PageHeader, ContractCard, InfoCard } from '../shared';
import type { ContractListItem } from '../../types';
import { useContract } from '../../contexts/contract-context';

// Para inquilinos, solo mostrar su contrato actual

export function InquilinoContracts() {
  const navigate = useRoleNavigation();
  const { contracts } = useContract();

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
        {contracts.map((contract) => (
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
