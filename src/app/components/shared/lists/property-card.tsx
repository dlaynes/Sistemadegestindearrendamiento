import { Building2, MapPin, Bed, Bath, Square, Eye } from 'lucide-react';
import { cn } from '../../ui/utils';
import { StatusBadge } from '../ui/status-badge';
import type { PropertyListItem } from '../../../types';

export type { PropertyListItem };

interface PropertyCardProps {
  property: PropertyListItem;
  onView?: (property: PropertyListItem) => void;
  className?: string;
}

export function PropertyCard({
  property,
  onView,
  className,
}: PropertyCardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-lg shadow-sm border border-border overflow-hidden',
        'hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="bg-gradient-to-r from-primary to-primary-hover p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-card/20 rounded-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white truncate">{property.name}</h3>
            <p className="text-sm text-white/80 truncate">{property.address}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={property.status} type="property" />
          <span className="text-lg font-bold text-foreground">{property.rent}</span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{property.bedrooms} Habs</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Bath className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{property.bathrooms} Baños</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Square className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{property.area}</span>
          </div>
        </div>
        
        {property.tenantName && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <MapPin className="w-4 h-4" />
            <span>Inquilino: {property.tenantName}</span>
          </div>
        )}
        
        {onView && (
          <button
            onClick={() => onView(property)}
            className={cn(
              'w-full flex items-center justify-center gap-2',
              'px-4 py-2 border border-primary text-primary rounded-lg',
              'hover:bg-primary-muted transition-colors font-medium'
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
