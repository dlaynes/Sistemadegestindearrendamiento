import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../ui/alert-dialog';
import { useWithdrawAmendment } from '../../../hooks/queries/use-contract-amendments-query';
import type { ContractAmendment } from '../../../types/contract-amendment';

export interface WithdrawAmendmentDialogProps {
  contractId: number | string;
  amendment: ContractAmendment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

/**
 * Confirmation dialog used when the proposer (landlord or tenant) wants to
 * withdraw their own pending amendment. Calls the POST .../withdraw endpoint
 * via useWithdrawAmendment.
 */
export function WithdrawAmendmentDialog({
  contractId,
  amendment,
  open,
  onOpenChange,
  onSuccess,
}: WithdrawAmendmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const withdraw = useWithdrawAmendment(contractId);

  const handleConfirm = async () => {
    if (!amendment) return;
    setIsSubmitting(true);
    try {
      await withdraw.mutateAsync(amendment.id);
      onSuccess?.();
      onOpenChange(false);
    } catch {
      // react-query surfaces the error via the mutation state. Always close
      // the dialog so the user is never stuck on it; the parent can toast.
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Retirar la propuesta?</AlertDialogTitle>
          <AlertDialogDescription>
            La enmienda quedará marcada como retirada y la otra parte ya no podrá aprobarla ni rechazarla.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            {isSubmitting ? 'Retirando…' : 'Retirar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
