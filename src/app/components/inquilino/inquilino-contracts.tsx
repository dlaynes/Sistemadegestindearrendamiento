import { useState } from 'react';
import { FileText, Clock } from 'lucide-react';
import { useContract } from '../../contexts/contract-context';
import {
  PageHeader,
  ContractCard,
  FilterButtons,
  SummaryCards,
  EmptyState,
} from '../shared';
import type { ContractListItem } from '../../types';
import { useRoleNavigation } from '../../hooks/use-role-navigation';

export function InquilinoContracts() {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Contratos"
        subtitle="Contratos de arrendamiento activos"
      />

      <SummaryCards
        cards={[
          { label: 'Activos', value: String(myContracts.filter(c => c.status === 'activo').length), icon: FileText, color: 'bg-info' },
          { label: 'Por vencer', value: String(myContracts.filter(c => c.status === 'proximo_vencer').length), icon: Clock, color: 'bg-warning' },
          { label: 'Total', value: String(myContracts.length), icon: FileText, color: 'bg-info' },
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
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No hay contratos"
          description="No tienes contratos activos"
        />
      )}
    </div>
  );
}
