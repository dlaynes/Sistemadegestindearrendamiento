import { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { 
  PageHeader, 
  PropertyCard, 
  SearchFilter, 
  EmptyState, 
  ActionButton 
} from '../shared';

const mockProperties = [
  {
    id: 1,
    name: 'Apartamento Centro #101',
    address: 'Calle Principal 123, Centro',
    status: 'ocupado' as const,
    rent: '$3,200',
    bedrooms: 2,
    bathrooms: 2,
    area: '85 m²',
    tenant: 'Juan Pérez',
  },
  {
    id: 2,
    name: 'Casa Residencial #102',
    address: 'Av. Los Pinos 456, Zona Norte',
    status: 'ocupado' as const,
    rent: '$4,500',
    bedrooms: 3,
    bathrooms: 2,
    area: '120 m²',
    tenant: 'Ana Martínez',
  },
  {
    id: 3,
    name: 'Apartamento Vista Mar #103',
    address: 'Malecón 789, Playa',
    status: 'ocupado' as const,
    rent: '$2,800',
    bedrooms: 1,
    bathrooms: 1,
    area: '55 m²',
    tenant: 'María García',
  },
  {
    id: 4,
    name: 'Estudio Moderno #104',
    address: 'Calle Comercial 321, Centro',
    status: 'disponible' as const,
    rent: '$2,200',
    bedrooms: 1,
    bathrooms: 1,
    area: '45 m²',
  },
  {
    id: 5,
    name: 'Casa Familiar #201',
    address: 'Residencial Las Flores 555',
    status: 'ocupado' as const,
    rent: '$5,500',
    bedrooms: 4,
    bathrooms: 3,
    area: '180 m²',
    tenant: 'Laura Gómez',
  },
  {
    id: 6,
    name: 'Loft Industrial #205',
    address: 'Zona Industrial 234',
    status: 'disponible' as const,
    rent: '$3,800',
    bedrooms: 2,
    bathrooms: 1,
    area: '95 m²',
  },
];

export function AdminProperties() {
  const navigate = useRoleNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewProperty = (property: typeof mockProperties[0]) => {
    navigate(`/properties/${property.id}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Propiedades" 
        subtitle="Administra tu portafolio de propiedades"
        action={
          <ActionButton 
            variant="primary" 
            icon={Plus}
            onClick={() => navigate('/properties/new')}
          >
            Agregar Propiedad
          </ActionButton>
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
