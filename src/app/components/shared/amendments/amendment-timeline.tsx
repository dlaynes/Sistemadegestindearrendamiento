import { useAmendments } from '../../../hooks/queries/use-contract-amendments-query';
import { Spinner } from '../ui/spinner';
import { AmendmentCard } from './amendment-card';
import type { ContractAmendment } from '../../../types/contract-amendment';

export interface AmendmentTimelineProps {
  contractId: number | string;
  currentUserId?: number;
  currentUserRole?: string;
  onApprove?: (amendment: ContractAmendment) => void;
  onReject?: (amendment: ContractAmendment) => void;
  onWithdraw?: (amendment: ContractAmendment) => void;
}

export function AmendmentTimeline({
  contractId,
  currentUserId,
  currentUserRole,
  onApprove,
  onReject,
  onWithdraw,
}: AmendmentTimelineProps) {
  const { data, isLoading } = useAmendments(contractId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="md" label="Cargando enmiendas" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="rounded-lg border border-border-subtle bg-surface p-6 text-center text-sm text-muted-foreground">
        Sin enmiendas todavía.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {data.map((a: ContractAmendment) => {
        const canDecide =
          !!currentUserId &&
          !!currentUserRole &&
          currentUserId !== a.proposedByUserId &&
          (a.status === 'pending_tenant' || a.status === 'pending_landlord');
        const isProposer = currentUserId === a.proposedByUserId;
        return (
          <li key={a.id}>
            <AmendmentCard
              amendment={a}
              canDecide={canDecide}
              isProposer={isProposer}
              onApprove={onApprove}
              onReject={onReject}
              onWithdraw={onWithdraw}
            />
          </li>
        );
      })}
    </ol>
  );
}
