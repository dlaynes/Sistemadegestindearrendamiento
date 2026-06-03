import { useState } from 'react';
import { AlertTriangle, FileText, GitMerge } from 'lucide-react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { cn } from '../../ui/utils';
import { useAmendments, useProposeAmendment } from '../../../hooks/queries/use-contract-amendments-query';

type Mode = 'values' | 'closure';

export interface ProposeAmendmentDialogProps {
  contractId: number | string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ProposeAmendmentDialog({
  contractId,
  open,
  onOpenChange,
  onSuccess,
}: ProposeAmendmentDialogProps) {
  const { data: existing } = useAmendments(contractId);
  const propose = useProposeAmendment(contractId);
  const [mode, setMode] = useState<Mode>('values');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [deposit, setDeposit] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentDay, setPaymentDay] = useState('');
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const hasPending = (existing ?? []).some(
    (a) => a.status === 'pending_tenant' || a.status === 'pending_landlord',
  );
  const reasonTooShort = reason.trim().length < 5;

  const reset = () => {
    setMode('values');
    setMonthlyRent('');
    setDeposit('');
    setEndDate('');
    setPaymentDay('');
    setReason('');
    setConfirmed(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasPending) return;
    if (mode === 'closure' && (reasonTooShort || !confirmed)) return;

    const changes: Record<string, string> =
      mode === 'closure'
        ? { status: 'cancelado' }
        : {
            ...(monthlyRent ? { monthlyRent } : {}),
            ...(deposit ? { deposit } : {}),
            ...(endDate ? { endDate } : {}),
            ...(paymentDay ? { paymentDay } : {}),
          };
    if (Object.keys(changes).length === 0) return;

    try {
      await propose.mutateAsync({ proposedChanges: changes, reason: reason.trim() || undefined });
      onSuccess?.();
      handleOpenChange(false);
    } catch {
      // mutation error surfaces via react-query; we keep the dialog open
    }
  };

  const valueFieldsFilled =
    !!monthlyRent || !!deposit || !!endDate || !!paymentDay;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Proponer cambio</DialogTitle>
          <DialogDescription>
            El cambio requiere la aprobación de la otra parte para aplicarse.
          </DialogDescription>
        </DialogHeader>

        {hasPending && (
          <div
            role="alert"
            aria-live="polite"
            className="mt-4 flex items-start gap-2 rounded-lg border border-warning-muted bg-warning-muted/60 p-3 text-sm text-warning-muted-foreground"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Ya existe una enmienda pendiente. Decídela antes de proponer otra.</p>
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode('values')}
            aria-pressed={mode === 'values'}
            className={cn(
              'flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors',
              mode === 'values'
                ? 'border-primary bg-primary-muted text-foreground'
                : 'border-border-subtle bg-card text-muted-foreground hover:bg-surface',
            )}
          >
            <FileText className="h-4 w-4" />
            <div>
              <p className="font-medium">Modificar valores</p>
              <p className="text-xs">Renta, depósito, fin, día de pago.</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMode('closure')}
            aria-pressed={mode === 'closure'}
            className={cn(
              'flex items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors',
              mode === 'closure'
                ? 'border-destructive bg-destructive-muted text-foreground'
                : 'border-border-subtle bg-card text-muted-foreground hover:bg-surface',
            )}
          >
            <GitMerge className="h-4 w-4" />
            <div>
              <p className="font-medium">Cerrar contrato</p>
              <p className="text-xs">Cancelar por mutuo acuerdo.</p>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {mode === 'values' ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="monthlyRent" className="mb-1 block text-xs font-medium text-foreground">
                  Renta mensual
                </label>
                <Input
                  id="monthlyRent"
                  type="number"
                  inputMode="decimal"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  placeholder="1500"
                />
              </div>
              <div>
                <label htmlFor="deposit" className="mb-1 block text-xs font-medium text-foreground">
                  Depósito
                </label>
                <Input
                  id="deposit"
                  type="number"
                  inputMode="decimal"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder="3000"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="mb-1 block text-xs font-medium text-foreground">
                  Fecha de fin
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="paymentDay" className="mb-1 block text-xs font-medium text-foreground">
                  Día de pago (1-28)
                </label>
                <Input
                  id="paymentDay"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={28}
                  value={paymentDay}
                  onChange={(e) => setPaymentDay(e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>
          ) : (
            <div
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive-muted/40 p-3 text-sm"
            >
              <p className="font-medium text-destructive">Cerrar el contrato implica:</p>
              <ul className="mt-1 list-disc pl-5 text-destructive-muted-foreground">
                <li>El estado del contrato pasa a <strong>cancelado</strong>.</li>
                <li>Todos los pagos pendientes se cancelan.</li>
                <li>La acción queda registrada en el historial visible para ambos.</li>
              </ul>
            </div>
          )}

          <div>
            <label htmlFor="reason" className="mb-1 block text-sm font-medium text-foreground">
              Motivo {mode === 'closure' ? <span className="text-destructive">*</span> : <span className="text-muted-foreground">(opcional)</span>}
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder={mode === 'closure' ? 'Ej. Inquilino se muda a Lima' : 'Ej. Ajuste anual'}
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            {mode === 'closure' && reasonTooShort && (
              <p className="mt-1 text-xs text-muted-foreground">Mínimo 5 caracteres.</p>
            )}
          </div>

          {mode === 'closure' && (
            <label className="flex items-start gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-input"
              />
              <span>Entiendo que los pagos pendientes se cancelarán al aprobarse.</span>
            </label>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant={mode === 'closure' ? 'destructive' : 'default'}
              disabled={
                hasPending ||
                propose.isPending ||
                (mode === 'values' && !valueFieldsFilled) ||
                (mode === 'closure' && (reasonTooShort || !confirmed))
              }
            >
              {propose.isPending ? 'Enviando…' : 'Proponer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
