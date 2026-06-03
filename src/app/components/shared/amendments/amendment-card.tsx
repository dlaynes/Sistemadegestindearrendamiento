import { CheckCircle, XCircle, GitMerge, FileText } from 'lucide-react';
import { cn } from '../../ui/utils';
import { Button } from '../../ui/button';
import { StatusBadge } from '../ui/status-badge';
import type { ContractAmendment } from '../../../types/contract-amendment';
import { isClosureAmendment } from '../../../types/contract-amendment';

const STATUS_LABEL: Record<string, string> = {
  pending_tenant: 'Pendiente: inquilino',
  pending_landlord: 'Pendiente: arrendador',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  withdrawn: 'Retirado',
  expired: 'Expirado',
};

const FIELD_LABEL: Record<string, string> = {
  monthlyRent: 'Renta mensual',
  deposit: 'Depósito',
  endDate: 'Fecha de fin',
  paymentDay: 'Día de pago',
  status: 'Estado',
};

function formatValue(field: string, value: string): string {
  if (field === 'endDate') return value;
  if (field === 'monthlyRent' || field === 'deposit') return `$${value}`;
  if (field === 'paymentDay') return `día ${value}`;
  return value;
}

export interface AmendmentCardProps {
  amendment: ContractAmendment;
  canDecide?: boolean;
  isProposer?: boolean;
  onApprove?: (amendment: ContractAmendment) => void;
  onReject?: (amendment: ContractAmendment) => void;
  onWithdraw?: (amendment: ContractAmendment) => void;
  className?: string;
}

export function AmendmentCard({
  amendment,
  canDecide,
  isProposer,
  onApprove,
  onReject,
  onWithdraw,
  className,
}: AmendmentCardProps) {
  const isClosure = isClosureAmendment(amendment);
  const isPending =
    amendment.status === 'pending_tenant' || amendment.status === 'pending_landlord';

  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-4 shadow-elev-xs',
        isClosure ? 'border-destructive/40' : 'border-border-subtle',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
              isClosure
                ? 'bg-destructive-muted text-destructive'
                : 'bg-primary-muted text-primary',
            )}
            aria-hidden="true"
          >
            {isClosure ? <GitMerge className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {isClosure ? 'Cerrar contrato' : 'Modificar valores'}
            </p>
            <p className="text-xs text-muted-foreground">
              Por: {amendment.proposedByRole} · {new Date(amendment.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <StatusBadge
          status={amendment.status}
          type="contract"
          label={STATUS_LABEL[amendment.status]}
          size="sm"
        />
      </div>

      <ul className="mt-3 space-y-1 rounded-lg bg-surface p-3 text-sm">
        {Object.entries(amendment.proposedChanges ?? {}).map(([field, newVal]) => (
          <li key={field} className="flex items-center justify-between gap-2">
            <span className="text-muted-foreground">{FIELD_LABEL[field] ?? field}</span>
            {isClosure ? (
              <span className="font-medium text-destructive">activo → cancelado</span>
            ) : (
              <span className="font-medium text-foreground">{formatValue(field, newVal)}</span>
            )}
          </li>
        ))}
      </ul>

      {amendment.reason && (
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Motivo: </span>
          {amendment.reason}
        </p>
      )}

      {amendment.decisionNote && (
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Nota: </span>
          {amendment.decisionNote}
        </p>
      )}

      {canDecide && isPending && onApprove && onReject && (
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => onApprove(amendment)}
            className="gap-1.5"
          >
            <CheckCircle className="h-4 w-4" />
            Aprobar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onReject(amendment)}
            className="gap-1.5"
          >
            <XCircle className="h-4 w-4" />
            Rechazar
          </Button>
        </div>
      )}

      {isProposer && isPending && onWithdraw && (
        <div className="mt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onWithdraw(amendment)}
          >
            Retirar propuesta
          </Button>
        </div>
      )}
    </div>
  );
}
