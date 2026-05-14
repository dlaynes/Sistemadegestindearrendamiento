import { useState } from 'react';
import { FileText, Calendar, Clock, Plus } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { useContract } from '../../contexts/contract-context';
import {
  PageHeader,
  ContractCard,
  FilterButtons,
  SummaryCards,
  EmptyState,
  ActionButton,
} from '../shared';
import type { ContractListItem } from '../../types';

export function ArrendadorContracts() {
  const navigate = useRoleNavigation();
  const { getMyContracts, isLoading } = useContract();
  const [statusFilter, setStatusFilter] = useState('all');

  const myContracts = getMyContracts();

  const filteredContracts = myContracts.filter((contract) => {
    return statusFilter === 'all' || contract.status === statusFilter;
  });

  const handleViewContract = (contract: ContractListItem) => {
    navigate(`/contratos/${contract.id}`);
  };

  const handleEditContract = (contract: ContractListItem) => {
    navigate(`/contratos/${contract.id}/editar`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Contratos"
        subtitle="Administra tus contratos de arrendamiento"
        action={
          <ActionButton
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/contratos/nuevo')}
          >
            Nuevo Contrato
          </ActionButton>
        }
      />

      <SummaryCards
        cards={[
          { label: 'Activos', value: String(myContracts.filter(c => c.status === 'activo').length), icon: FileText, color: 'bg-blue-500' },
          { label: 'Por vencer', value: String(myContracts.filter(c => c.status === 'proximo_vencer').length), icon: Clock, color: 'bg-yellow-500' },
          { label: 'Total', value: String(myContracts.length), icon: Calendar, color: 'bg-purple-500' },
        ]}
        columns={3}
      />

      <FilterButtons
        options={[
          { label: 'Todos', value: 'all' },
          { label: 'Activos', value: 'activo' },
          { label: 'Por vencer', value: 'proximo_vencer' },
          { label: 'Vencidos', value: 'vencido' },
        ]}
        activeValue={statusFilter}
        onChange={setStatusFilter}
      />

      {filteredContracts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onView={handleViewContract}
              onEdit={handleEditContract}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No hay contratos"
          description="No tienes contratos que coincidan con los filtros"
        />
      )}
    </div>
  );
}
