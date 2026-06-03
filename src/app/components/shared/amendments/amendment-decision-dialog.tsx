import { useState } from 'react';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';
import { useDecideAmendment } from '../../../hooks/queries/use-contract-amendments-query';
import type { ContractAmendment } from '../../../types/contract-amendment';
import { isClosureAmendment } from '../../../types/contract-amendment';

export interface AmendmentDecisionDialogProps {
  contractId: number | string;
  amendment: ContractAmendment | null;
  decision: 'APPROVED' | 'REJECTED';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AmendmentDecisionDialog({
  contractId,
  amendment,
  decision,
  open,
  onOpenChange,
  onSuccess,
}: AmendmentDecisionDialogProps) {
  const [note, setNote] = useState('');
  const decide = useDecideAmendment(contractId);
  const isClosure = amendment ? isClosureAmendment(amendment) : false;
  const noteTooShort = decision === 'REJECTED' && note.trim().length < 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amendment) return;
    if (noteTooShort) return;
    try {
      await decide.mutateAsync({
        amendmentId: amendment.id,
        body: { decision, decisionNote: note.trim() || undefined },
      });
      setNote('');
      onSuccess?.();
      onOpenChange(false);
    } catch {
      // error surfaces via react-query
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {decision === 'APPROVED'
              ? isClosure
                ? 'Aprobar cierre del contrato'
                : 'Aprobar cambio'
              : 'Rechazar cambio'}
          </DialogTitle>
          <DialogDescription>
            {decision === 'APPROVED'
              ? isClosure
                ? 'El contrato pasará a cancelado y los pagos pendientes serán cancelados.'
                : 'Los nuevos valores se aplicarán al contrato inmediatamente.'
              : 'La otra parte será notificada con tu motivo.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label htmlFor="decisionNote" className="mb-1 block text-sm font-medium text-foreground">
              Nota {decision === 'REJECTED' && <span className="text-destructive">*</span>}
            </label>
            <textarea
              id="decisionNote"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder={decision === 'REJECTED' ? 'Motivo del rechazo (mín. 3 caracteres)' : 'Opcional'}
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            {noteTooShort && (
              <p className="mt-1 text-xs text-muted-foreground">Mínimo 3 caracteres.</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant={decision === 'REJECTED' ? 'outline' : isClosure ? 'destructive' : 'default'}
              disabled={decide.isPending || noteTooShort}
            >
              {decide.isPending ? 'Enviando…' : decision === 'APPROVED' ? 'Aprobar' : 'Rechazar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
