import { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { useProperty } from '../../contexts/property-context';
import {
  PageHeader,
  PropertyCard,
  SearchFilter,
  EmptyState,
  ActionButton,
  PropertyListSkeleton,
} from '../shared';

export function ArrendadorProperties() {
  const navigate = useRoleNavigation();
  const { getMyProperties, isLoading } = useProperty();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const myProperties = getMyProperties();

  const filteredProperties = myProperties.filter((property) => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <PropertyListSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Propiedades"
        subtitle="Administra tu portafolio de propiedades"
        action={
          <ActionButton
            variant="primary"
            icon={Plus}
            onClick={() => navigate('/propiedades/nueva')}
          >
            Nueva Propiedad
          </ActionButton>
        }
      />

      <SearchFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        selectValue={statusFilter}
        selectOptions={[
          { label: 'Todos', value: '' },
          { label: 'Disponibles', value: 'disponible' },
          { label: 'Ocupados', value: 'ocupado' },
          { label: 'Mantenimiento', value: 'mantenimiento' },
        ]}
        onSelectChange={setStatusFilter}
      />

      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onView={(p) => navigate(`/propiedades/${p.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No hay propiedades"
          description="No tienes propiedades registradas"
          action={{
            label: 'Agregar propiedad',
            onClick: () => navigate('/propiedades/nueva'),
          }}
        />
      )}
    </div>
  );
}
