import { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { useProperty } from '../../contexts/property-context';
import {
  PageHeader,
  PropertyCard,
  SearchFilter,
  EmptyState,
} from '../shared';
import { Button } from '../ui/button';

export function AdminProperties() {
  const navigate = useRoleNavigation();
  const { properties } = useProperty();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewProperty = (property: { id: string | number }) => {
    navigate(`/propiedades/${property.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Propiedades"
        subtitle="Administra tu portafolio de propiedades"
        action={
          <Button onClick={() => navigate('/propiedades/nueva')}>
            <Plus className="h-4 w-4" />
            Agregar Propiedad
          </Button>
        }
      />

      <SearchFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar propiedades..."
        selectValue={statusFilter}
        onSelectChange={setStatusFilter}
        selectOptions={[
          { value: 'ocupado', label: 'Ocupadas' },
          { value: 'disponible', label: 'Disponibles' },
        ]}
        selectPlaceholder="Todas"
      />

      {filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onView={handleViewProperty}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No se encontraron propiedades"
          description="Intenta ajustar los filtros de búsqueda"
        />
      )}
    </div>
  );
}
