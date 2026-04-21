import * as React from 'react';
import { Building2, MapPin, Bed, Bath, Square, Eye } from 'lucide-react';
import { cn } from '../../ui/utils';
import { StatusBadge } from '../ui/status-badge';

export interface PropertyCardData {
  /**
   * Property ID
   */
  id: string | number;
  /**
   * Property name
   */
  name: string;
  /**
   * Property address
   */
  address: string;
  /**
   * Property status
   */
  status: 'ocupado' | 'disponible' | 'mantenimiento';
  /**
   * Monthly rent
   */
  rent: string;
  /**
   * Number of bedrooms
   */
  bedrooms: number;
  /**
   * Number of bathrooms
   */
  bathrooms: number;
  /**
   * Property area in m²
   */
  area: string;
  /**
   * Current tenant name (if occupied)
   */
  tenant?: string;
}

interface PropertyCardProps {
  /**
   * Property data
   */
  property: PropertyCardData;
  /**
   * Click handler for view details
   */
  onView?: (property: PropertyCardData) => void;
  /**
   * Optional additional class names
   */
  className?: string;
}

/**
 * PropertyCard - A reusable property card component for lists
 * 
 * Usage:
 * ```tsx
 * <PropertyCard
 *   property={{
 *     id: 1,
 *     name: 'Apartamento Centro',
 *     address: 'Calle Principal 123',
 *     status: 'ocupado',
 *     rent: '$1,200',
 *     bedrooms: 2,
 *     bathrooms: 1,
 *     area: '75 m²',
 *     tenant: 'Juan Pérez',
 *   }}
 *   onView={handleView}
 * />
 * ```
 */
export function PropertyCard({
  property,
  onView,
  className,
}: PropertyCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden',
        'hover:shadow-md transition-shadow',
        className
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white truncate">{property.name}</h3>
            <p className="text-sm text-white/80 truncate">{property.address}</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={property.status} type="property" />
          <span className="text-lg font-bold text-gray-900">{property.rent}</span>
        </div>
        
        {/* Details */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{property.bedrooms} Habs</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{property.bathrooms} Baños</span>
          </div>
          <div className="flex items-center gap-2">
            <Square className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">{property.area}</span>
          </div>
        </div>
        
        {/* Tenant info */}
        {property.tenant && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <MapPin className="w-4 h-4" />
            <span>Inquilino: {property.tenant}</span>
          </div>
        )}
        
        {/* Actions */}
        {onView && (
          <button
            onClick={() => onView(property)}
            className={cn(
              'w-full flex items-center justify-center gap-2',
              'px-4 py-2 border border-blue-600 text-blue-600 rounded-lg',
              'hover:bg-blue-50 transition-colors font-medium'
            )}
          >
            <Eye className="w-4 h-4" />
            Ver Detalles
          </button>
        )}
      </div>
    </div>
  );
}
