import { Building2, Bed, Bath, Square, Eye, MapPin } from 'lucide-react';
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
        'group overflow-hidden rounded-xl border border-border-subtle bg-card shadow-elev-xs transition-all',
        'hover:-translate-y-0.5 hover:shadow-elev-md',
        className,
      )}
    >
      <div className="bg-primary-muted/70 p-4 ring-1 ring-inset ring-border-subtle">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card text-primary shadow-elev-xs">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">{property.name}</h3>
            <p className="truncate text-sm text-muted-foreground">{property.address}</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <StatusBadge status={property.status} type="property" />
          <span className="text-lg font-bold text-foreground">{property.rent}</span>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Bed className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{property.bedrooms} Habs</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{property.bathrooms} Baños</span>
          </div>
          <div className="flex items-center gap-2">
            <Square className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{property.area}</span>
          </div>
        </div>

        {property.tenantName && (
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>Inquilino: {property.tenantName}</span>
          </div>
        )}

        {onView && (
          <button
            type="button"
            onClick={() => onView(property)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border-subtle bg-card px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-muted"
          >
            <Eye className="h-4 w-4" />
            Ver Detalles
          </button>
        )}
      </div>
    </div>
  );
}
