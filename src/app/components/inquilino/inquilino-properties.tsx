import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { 
  PageHeader, 
  PropertyCard, 
  SearchFilter, 
  EmptyState 
} from '../shared';
import type { PropertyListItem } from '../../types';

// Para inquilinos, solo mostrarían propiedades disponibles o su propiedad actual
const mockProperties: PropertyListItem[] = [
  {
    id: 3,
    name: 'Apartamento Vista Mar #103',
    address: 'Malecón 789, Playa',
    status: 'ocupado',
    rent: '$2,800',
    bedrooms: 1,
    bathrooms: 1,
    area: '55 m²',
    tenant: 'Mi Propiedad',
  },
  {
    id: 4,
    name: 'Estudio Moderno #104',
    address: 'Calle Comercial 321, Centro',
    status: 'disponible',
    rent: '$2,200',
    bedrooms: 1,
    bathrooms: 1,
    area: '45 m²',
  },
  {
    id: 6,
    name: 'Loft Industrial #205',
    address: 'Zona Industrial 234',
    status: 'disponible',
    rent: '$3,800',
    bedrooms: 2,
    bathrooms: 1,
    area: '95 m²',
  },
];

export function InquilinoProperties() {
  const navigate = useRoleNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewProperty = (property: PropertyListItem) => {
    navigate(`/properties/${property.id}`);
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
          { value: 'ocupado', label: 'Mi Propiedad' },
          { value: 'disponible', label: 'Disponibles' },
        ]}
        selectPlaceholder="Todas"
      />

      {/* Properties Grid */}
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
