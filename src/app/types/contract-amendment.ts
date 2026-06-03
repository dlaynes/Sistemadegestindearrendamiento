import type { UserRole } from './user';

export type ContractAmendmentStatus =
  | 'pending_tenant'
  | 'pending_landlord'
  | 'approved'
  | 'rejected'
  | 'withdrawn'
  | 'expired';

export interface ContractAmendment {
  id: number;
  contractId?: number;
  proposedByUserId: number;
  proposedByRole: UserRole;
  status: ContractAmendmentStatus;
  proposedChanges: Record<string, string>;
  reason?: string;
  createdAt: string;
  decidedAt?: string | null;
  decidedByUserId?: number | null;
  deciderRole?: string | null;
  decisionNote?: string | null;
  expiresAt?: string | null;
}

export interface ContractAmendmentPropose {
  proposedChanges: Record<string, string>;
  reason?: string;
}

export type ContractAmendmentDecision = 'APPROVED' | 'REJECTED';

export interface ContractAmendmentDecisionRequest {
  decision: ContractAmendmentDecision;
  decisionNote?: string;
}

export function isClosureAmendment(a: ContractAmendment): boolean {
  const changes = a.proposedChanges ?? {};
  return (
    Object.keys(changes).length === 1 &&
    'status' in changes &&
    String(changes.status).toLowerCase() === 'cancelado'
  );
}
