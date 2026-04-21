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

const mockContracts = [
  {
    id: 1,
    code: 'CT-0001',
    tenant: 'Juan Pérez',
    property: 'Apartamento Centro #101',
    startDate: '2025-06-01',
    endDate: '2026-06-01',
    monthlyRent: '$3,200',
    deposit: '$6,400',
    status: 'activo' as const,
  },
  {
    id: 2,
    code: 'CT-0002',
    tenant: 'Ana Martínez',
    property: 'Casa Residencial #102',
    startDate: '2025-08-15',
    endDate: '2027-08-15',
    monthlyRent: '$4,500',
    deposit: '$9,000',
    status: 'activo' as const,
  },
  {
    id: 3,
    code: 'CT-0003',
    tenant: 'María García',
    property: 'Apartamento Vista Mar #103',
    startDate: '2025-09-01',
    endDate: '2026-03-01',
    monthlyRent: '$2,800',
    deposit: '$5,600',
    status: 'activo' as const,
  },
  {
    id: 4,
    code: 'CT-0004',
    tenant: 'Laura Gómez',
    property: 'Casa Familiar #201',
    startDate: '2024-12-01',
    endDate: '2026-12-01',
    monthlyRent: '$5,500',
    deposit: '$11,000',
    status: 'activo' as const,
  },
  {
    id: 5,
    code: 'CT-0005',
    tenant: 'Roberto Silva',
    property: 'Estudio Moderno #104',
    startDate: '2025-01-15',
    endDate: '2025-12-15',
    monthlyRent: '$2,200',
    deposit: '$4,400',
    status: 'proximo_vencer' as const,
  },
];

export function AdminContracts() {
  const navigate = useRoleNavigation();
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredContracts = mockContracts.filter((contract) => {
    return statusFilter === 'all' || contract.status === statusFilter;
  });

  const handleViewContract = (contract: typeof mockContracts[0]) => {
    navigate(`/contracts/${contract.id}`);
  };

  const handleEditContract = (contract: typeof mockContracts[0]) => {
    navigate(`/contracts/${contract.id}/edit`);
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
            onClick={() => navigate('/contracts/new')}
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

      {/* Contracts List */}
      {filteredContracts.length > 0 ? (
        <div className="space-y-4">
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
