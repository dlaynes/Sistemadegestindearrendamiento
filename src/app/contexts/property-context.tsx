import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Property, PropertyStatus } from '../types';

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Property) => void;
  updateProperty: (id: string, property: Property) => void;
  deleteProperty: (id: string) => void;
  getPropertyById: (id: string) => Property | undefined;
  getPropertiesByStatus: (status: PropertyStatus) => Property[];
  getAvailableProperties: () => Property[];
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const initialProperties: Property[] = [
  {
    id: '1',
    name: 'Apartamento Centro #101',
    address: 'Calle Principal 123, Centro',
    type: 'apartamento',
    bedrooms: 2,
    bathrooms: 2,
    area: '85 m²',
    rent: '$3,200',
    status: 'ocupado',
    tenant: 'Juan Pérez',
    description: 'Moderno apartamento en el corazón del centro, con excelente iluminación natural y vistas panorámicas.',
    amenities: ['Estacionamiento', 'Balcón', 'Cocina equipada', 'Aire acondicionado', 'Internet incluido'],
    yearBuilt: 2018,
    floors: 1,
    furnished: true,
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2026-04-12T00:00:00Z',
  },
  {
    id: '2',
    name: 'Casa Residencial #102',
    address: 'Av. Los Pinos 456, Zona Norte',
    type: 'casa',
    bedrooms: 3,
    bathrooms: 2,
    area: '120 m²',
    rent: '$4,500',
    status: 'ocupado',
    tenant: 'Ana Martínez',
    description: 'Amplia casa en zona residencial tranquila y segura. Ideal para familias.',
    amenities: ['Jardín', 'Garaje 2 autos', 'Cuarto de lavado', 'Terraza', 'Sistema de seguridad'],
    yearBuilt: 2015,
    floors: 2,
    furnished: false,
    createdAt: '2025-01-16T00:00:00Z',
    updatedAt: '2026-04-12T00:00:00Z',
  },
  {
    id: '3',
    name: 'Apartamento Vista Mar #103',
    address: 'Malecón 789, Playa',
    type: 'apartamento',
    bedrooms: 1,
    bathrooms: 1,
    area: '55 m²',
    rent: '$2,800',
    status: 'ocupado',
    tenant: 'María García',
    description: 'Acogedor apartamento con vista directa al mar.',
    amenities: ['Vista al mar', 'Piscina compartida', 'Gimnasio', 'Seguridad 24/7', 'Estacionamiento'],
    yearBuilt: 2020,
    floors: 1,
    furnished: true,
    createdAt: '2025-01-17T00:00:00Z',
    updatedAt: '2026-04-12T00:00:00Z',
  },
  {
    id: '4',
    name: 'Estudio Moderno #104',
    address: 'Calle Comercial 321, Centro',
    type: 'estudio',
    bedrooms: 1,
    bathrooms: 1,
    area: '45 m²',
    rent: '$2,200',
    status: 'disponible',
    description: 'Estudio completamente renovado.',
    amenities: ['Cocina americana', 'Internet fibra óptica', 'Lavandería compartida'],
    yearBuilt: 2022,
    floors: 1,
    furnished: true,
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2026-04-12T00:00:00Z',
  },
  {
    id: '5',
    name: 'Casa Familiar #201',
    address: 'Residencial Las Flores 555',
    type: 'casa',
    bedrooms: 4,
    bathrooms: 3,
    area: '180 m²',
    rent: '$5,500',
    status: 'ocupado',
    tenant: 'Laura Gómez',
    description: 'Casa familiar espaciosa con jardín y cochera.',
    amenities: ['Jardín amplio', 'Cochera triple', 'Cuarto de servicio', 'Terraza', 'Cerco eléctrico'],
    yearBuilt: 2019,
    floors: 2,
    furnished: true,
    createdAt: '2025-02-10T00:00:00Z',
    updatedAt: '2026-04-12T00:00:00Z',
  },
  {
    id: '6',
    name: 'Loft Industrial #205',
    address: 'Zona Industrial 234',
    type: 'loft',
    bedrooms: 2,
    bathrooms: 1,
    area: '95 m²',
    rent: '$3,800',
    status: 'disponible',
    description: 'Loft industrial con acabados modernos y espacios abiertos.',
    amenities: ['Espacios abiertos', 'Ventanales', 'Altos techos', 'Estacionamiento', 'Seguridad'],
    yearBuilt: 2021,
    floors: 1,
    furnished: false,
    createdAt: '2025-03-05T00:00:00Z',
    updatedAt: '2026-04-12T00:00:00Z',
  },
];

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);

  const addProperty = useCallback((property: Property) => {
    setProperties((prev) => [...prev, { ...property, id: property.id || String(prev.length + 1) }]);
  }, []);

  const updateProperty = useCallback((id: string, property: Property) => {
    setProperties((prev) =>
      prev.map((p) => (String(p.id) === id ? { ...property, id: p.id } : p))
    );
  }, []);

  const deleteProperty = useCallback((id: string) => {
    setProperties((prev) => prev.filter((p) => String(p.id) !== id));
  }, []);

  const getPropertyById = useCallback((id: string) => {
    return properties.find((p) => String(p.id) === id);
  }, [properties]);

  const getPropertiesByStatus = useCallback((status: PropertyStatus) => {
    return properties.filter((p) => p.status === status);
  }, [properties]);

  const getAvailableProperties = useCallback(() => {
    return properties.filter((p) => p.status === 'disponible');
  }, [properties]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        addProperty,
        updateProperty,
        deleteProperty,
        getPropertyById,
        getPropertiesByStatus,
        getAvailableProperties,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty debe ser usado dentro de un PropertyProvider');
  }
  return context;
}
