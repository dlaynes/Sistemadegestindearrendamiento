import { FileText, User, Building2, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { cn } from '../../ui/utils';
import { StatusBadge } from '../ui/status-badge';
import { getDaysUntilExpiration } from '../utils/date-utils';
import type { ContractListItem } from '../../../types';

export type { ContractListItem };

interface ContractCardProps {
  contract: ContractListItem;
  onView?: (contract: ContractListItem) => void;
  onEdit?: (contract: ContractListItem) => void;
  onDelete?: (contract: ContractListItem) => void;
  showActions?: boolean;
  className?: string;
}

export function ContractCard({
  contract,
  onView,
  onEdit,
  onDelete,
  showActions = false,
  className,
}: ContractCardProps) {
  const daysLeft = getDaysUntilExpiration(contract.endDate);
  const isExpiringSoon = daysLeft <= 90 && daysLeft > 0;

  return (
    <div
      className={cn(
        'rounded-xl border border-border-subtle bg-card p-5 shadow-elev-xs transition-all',
        'hover:-translate-y-0.5 hover:shadow-elev-md',
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-muted text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{contract.code}</h3>
            <p className="text-sm text-muted-foreground">{contract.property}</p>
          </div>
        </div>
        <StatusBadge status={contract.status} type="contract" />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Inquilino</p>
            <p className="text-sm font-medium text-foreground">{contract.tenantName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Propiedad</p>
            <p className="text-sm font-medium text-foreground">{contract.property}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Inicio</p>
            <p className="text-sm font-medium text-foreground">{contract.startDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Renta</p>
            <p className="text-sm font-medium text-foreground">{contract.monthlyRent}</p>
          </div>
        </div>
      </div>

      {isExpiringSoon && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-warning-muted bg-warning-muted/60 p-3">
          <AlertCircle className="h-5 w-5 text-warning" />
          <p className="text-sm text-warning-muted-foreground">
            <strong>Próximo a vencer:</strong> El contrato vence en {daysLeft} días
          </p>
        </div>
      )}

      {showActions && (onView || onEdit || onDelete) && (
        <div className="flex gap-2 border-t border-border-subtle pt-4">
          {onView && (
            <button
              type="button"
              onClick={() => onView(contract)}
              className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-muted"
            >
              Ver Detalles
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(contract)}
              className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(contract)}
              className="flex-1 rounded-md px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive-muted"
            >
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
