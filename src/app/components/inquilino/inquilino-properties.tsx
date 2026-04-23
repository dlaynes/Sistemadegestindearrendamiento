import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { useProperty } from '../../contexts/property-context';
import { 
  PageHeader, 
  PropertyCard, 
  SearchFilter, 
  EmptyState 
} from '../shared';

export function InquilinoProperties() {
  const navigate = useRoleNavigation();
  const { properties } = useProperty();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
        subtitle="Explora propiedades disponibles"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
