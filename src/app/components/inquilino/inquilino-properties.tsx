import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useProperty } from '../../contexts/property-context';
import {
  PageHeader,
  PropertyCard,
  SearchFilter,
  EmptyState,
} from '../shared';
import { useRoleNavigation } from '@/app/hooks/use-role-navigation';

export function InquilinoProperties() {
  const { getMyProperties, isLoading } = useProperty();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const myProperties = getMyProperties();
  const navigate = useRoleNavigation();

  const filteredProperties = myProperties.filter((property) => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        title="Mis Propiedades"
        subtitle="Propiedades donde resides"
      />

      <SearchFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        selectValue={statusFilter}
        selectOptions={[
          { label: 'Todos', value: '' },
          { label: 'Ocupado', value: 'ocupado' },
        ]}
        onSelectChange={setStatusFilter}
      />

      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onView={(p) => {
                navigate(`/propiedades/${p.id}`);
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No hay propiedades"
          description="No tienes propiedades asignadas"
        />
      )}
    </div>
  );
}
