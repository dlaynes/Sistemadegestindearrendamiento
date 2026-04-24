import { useState } from 'react';
import { FileText, Calendar, Clock, Plus } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { 
  PageHeader, 
  ContractCard, 
  FilterButtons, 
  SummaryCards, 
  EmptyState, 
  ActionButton 
} from '../shared';
import type { ContractListItem } from '../../types';
import { useContract } from '../../contexts/contract-context';


export function AdminContracts() {
  const navigate = useRoleNavigation();
  const { contracts } = useContract();
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredContracts = contracts.filter((contract) => {
    return statusFilter === 'all' || contract.status === statusFilter;
  });

  const handleViewContract = (contract: ContractListItem) => {
    navigate(`/contratos/${contract.id}`);
  };

  const handleEditContract = (contract: ContractListItem) => {
    navigate(`/contratos/${contract.id}/editar`);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Contratos" 
        subtitle="Administra los contratos de arrendamiento"
        action={
          <ActionButton 
            variant="primary" 
            icon={Plus}
            onClick={() => navigate('/contratos/nuevo')}
          >
            Agregar Contrato
          </ActionButton>
        }
      />

      <SummaryCards
        cards={[
          { label: 'Contratos Activos', value: '8', icon: FileText, color: 'bg-green-500' },
          { label: 'Próximos a Vencer', value: '3', icon: Clock, color: 'bg-yellow-500' },
          { label: 'Duración Promedio', value: '15.6 m', icon: Calendar, color: 'bg-blue-500' },
        ]}
        columns={3}
      />

      <FilterButtons
        options={[
          { value: 'all', label: 'Todos' },
          { value: 'activo', label: 'Activos' },
          { value: 'proximo_vencer', label: 'Próximos a Vencer' },
        ]}
        activeValue={statusFilter}
        onChange={setStatusFilter}
      />

      {filteredContracts.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredContracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onView={handleViewContract}
              onEdit={handleEditContract}
              showActions
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No se encontraron contratos"
          description="Intenta ajustar los filtros de búsqueda"
        />
      )}
    </div>
  );
}
