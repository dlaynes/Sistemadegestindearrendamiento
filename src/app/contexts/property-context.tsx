import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Property, PropertyFormData } from '../types/property';

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

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      name: 'Apartamento Centro',
      address: 'Calle Principal 123, Centro',
      type: 'Apartamento',
      bedrooms: 2,
      bathrooms: 1,
      area: '80 m²',
      price: 85000,
      status: 'disponible',
      description: 'Apartamento moderno en el centro de la ciudad, cerca de todo.',
      yearBuilt: 2018,
      floors: 4,
      furnished: true,
      amenities: ['Aire acondicionado', 'Balcón', 'Cercano al metro'],
      createdAt: '2025-01-15T00:00:00Z',
      updatedAt: '2026-04-12T00:00:00Z',
    },
    {
      id: '2',
      name: 'Casa Residencial',
      address: 'Av. Los Pinos 456, Jardines',
      type: 'Casa',
      bedrooms: 3,
      bathrooms: 2,
      area: '120 m²',
      price: 120000,
      status: 'ocupado',
      description: 'Casa tranquila en zona residencial, jardín amplio.',
      yearBuilt: 2020,
      floors: 1,
      furnished: false,
      amenities: ['Jardín', 'Garaje', 'Terraza'],
      createdAt: '2025-01-16T00:00:00Z',
      updatedAt: '2026-04-12T00:00:00Z',
    },
    {
      id: '3',
      name: 'Loft Industrial',
      address: 'Calle Artesanos 789, Zona Norte',
      type: 'Loft',
      bedrooms: 1,
      bathrooms: 1,
      area: '60 m²',
      price: 65000,
      status: 'mantenimiento',
      description: 'Loft estilo industrial con acabados de alta calidad.',
      yearBuilt: 2022,
      floors: 2,
      furnished: true,
      amenities: ['Wifi incluido', 'Aire acondicionado', 'Cocina equipada'],
      createdAt: '2025-01-17T00:00:00Z',
      updatedAt: '2026-04-12T00:00:00Z',
    },
  ]);

  const addProperty = useCallback((property: Property) => {
    setProperties((prev) => [...prev, property]);
  }, []);

  const updateProperty = useCallback((id: string, property: Property) => {
    setProperties((prev) =>
      prev.map((prop) => (prop.id === id ? property : prop))
    );
  }, []);

  const deleteProperty = useCallback((id: string) => {
    setProperties((prev) => prev.filter((prop) => prop.id !== id));
  }, []);

  const getPropertyById = useCallback((id: string) => {
    return properties.find((prop) => prop.id === id);
  }, [properties]);

  const getPropertiesByStatus = useCallback((status: PropertyStatus) => {
    return properties.filter((prop) => prop.status === status);
  }, [properties]);

  const getAvailableProperties = useCallback(() => {
    return properties.filter((prop) => prop.status === 'disponible');
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
