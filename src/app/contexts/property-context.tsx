import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { useServices } from '../services';
import type { Property, PropertyStatus } from '../types';

interface PropertyContextType {
  properties: Property[];
  isLoading: boolean;
  error: string | null;
  addProperty: (property: Property) => Promise<void>;
  updateProperty: (id: string, property: Property) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  getPropertyById: (id: string) => Property | undefined;
  getPropertiesByStatus: (status: PropertyStatus) => Property[];
  getAvailableProperties: () => Property[];
  getMyProperties: () => Property[];
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const { property: propertyService } = useServices();
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    propertyService
      .getAll()
      .then((data) => {
        if (!cancelled) {
          setProperties(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [propertyService]);

  const addProperty = useCallback(
    async (property: Property) => {
      const created = await propertyService.create(property);
      setProperties((prev) => [...prev, created]);
    },
    [propertyService]
  );

  const updateProperty = useCallback(
    async (id: string, property: Property) => {
      const updated = await propertyService.update(id, property);
      setProperties((prev) =>
        prev.map((p) => (String(p.id) === id ? updated : p))
      );
    },
    [propertyService]
  );

  const deleteProperty = useCallback(
    async (id: string) => {
      await propertyService.delete(id);
      setProperties((prev) => prev.filter((p) => String(p.id) !== id));
    },
    [propertyService]
  );

  const getPropertyById = useCallback(
    (id: string) => {
      return properties.find((p) => String(p.id) === id);
    },
    [properties]
  );

  const getPropertiesByStatus = useCallback(
    (status: PropertyStatus) => {
      return properties.filter((p) => p.status === status);
    },
    [properties]
  );

  const getAvailableProperties = useCallback(() => {
    return properties.filter((p) => p.status === 'disponible');
  }, [properties]);

  const getMyProperties = useCallback(() => {
    if (!user) return [];
    if (user.role === 'administrador') return properties;
    if (user.role === 'arrendador') {
      return properties.filter((p) =>
        (user.properties || []).includes(String(p.id))
      );
    }
    // inquilino - filter by tenant name
    return properties.filter((p) => p.tenantId === user.id);
  }, [properties, user]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        isLoading,
        error,
        addProperty,
        updateProperty,
        deleteProperty,
        getPropertyById,
        getPropertiesByStatus,
        getAvailableProperties,
        getMyProperties,
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
