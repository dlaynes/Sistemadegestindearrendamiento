import { useState } from 'react';
import { Building2, MapPin, DollarSign, Plus, Search, Filter } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';

const mockProperties = [
  {
    id: 1,
    name: 'Apartamento Centro #101',
    address: 'Calle Principal 123, Centro',
    type: 'Apartamento',
    bedrooms: 2,
    bathrooms: 2,
    area: '85 m²',
    price: 3200,
    status: 'ocupado',
    tenant: 'Juan Pérez',
  },
  {
    id: 2,
    name: 'Casa Residencial #102',
    address: 'Av. Los Pinos 456, Zona Norte',
    type: 'Casa',
    bedrooms: 3,
    bathrooms: 2,
    area: '120 m²',
    price: 4500,
    status: 'ocupado',
    tenant: 'Ana Martínez',
  },
  {
    id: 3,
    name: 'Apartamento Vista Mar #103',
    address: 'Malecón 789, Playa',
    type: 'Apartamento',
    bedrooms: 1,
    bathrooms: 1,
    area: '55 m²',
    price: 2800,
    status: 'ocupado',
    tenant: 'María García',
  },
  {
    id: 4,
    name: 'Estudio Moderno #104',
    address: 'Calle Comercial 321, Centro',
    type: 'Estudio',
    bedrooms: 1,
    bathrooms: 1,
    area: '45 m²',
    price: 2200,
    status: 'disponible',
    tenant: null,
  },
  {
    id: 5,
    name: 'Casa Familiar #201',
    address: 'Residencial Las Flores 555',
    type: 'Casa',
    bedrooms: 4,
    bathrooms: 3,
    area: '180 m²',
    price: 5500,
    status: 'ocupado',
    tenant: 'Laura Gómez',
  },
  {
    id: 6,
    name: 'Loft Industrial #205',
    address: 'Zona Industrial 234',
    type: 'Loft',
    bedrooms: 2,
    bathrooms: 1,
    area: '95 m²',
    price: 3800,
    status: 'disponible',
    tenant: null,
  },
];

export function ArrendadorProperties() {
  const navigate = useRoleNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ocupado' | 'disponible'>('all');

  const filteredProperties = mockProperties.filter((property) => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Propiedades</h1>
          <p className="text-gray-600 mt-1">Administra tu portafolio de propiedades</p>
        </div>
        <button 
          onClick={() => navigate('/properties/new')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Propiedad
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar propiedades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'ocupado' | 'disponible')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas</option>
              <option value="ocupado">Ocupadas</option>
              <option value="disponible">Disponibles</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Building2 className="w-16 h-16 text-white opacity-50" />
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{property.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  property.status === 'ocupado'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {property.status === 'ocupado' ? 'Ocupado' : 'Disponible'}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{property.address}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold text-gray-900">${property.price.toLocaleString()}/mes</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>{property.bedrooms} hab.</span>
                <span>{property.bathrooms} baños</span>
                <span>{property.area}</span>
              </div>

              {property.tenant && (
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">Inquilino:</p>
                  <p className="font-medium text-gray-900">{property.tenant}</p>
                </div>
              )}

              <button className="w-full mt-4 bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium" onClick={() => navigate(`/properties/${property.id}`)}>
                Ver Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No se encontraron propiedades</h3>
          <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
}