import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../../services';
import type {
  ContractAmendment,
  ContractAmendmentDecisionRequest,
  ContractAmendmentPropose,
} from '../../types/contract-amendment';

export function useAmendments(contractId: number | string | undefined) {
  const { contractAmendment } = useServices();
  return useQuery<ContractAmendment[]>({
    queryKey: ['contract-amendments', contractId],
    queryFn: () => contractAmendment.listByContract(contractId!),
    enabled: !!contractId,
  });
}

export function useProposeAmendment(contractId: number | string) {
  const { contractAmendment } = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: ContractAmendmentPropose) => contractAmendment.propose(contractId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contract-amendments', contractId] });
      qc.invalidateQueries({ queryKey: ['contracts', contractId] });
    },
  });
}

export function useDecideAmendment(contractId: number | string) {
  const { contractAmendment } = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ amendmentId, body }: { amendmentId: number | string; body: ContractAmendmentDecisionRequest }) =>
      contractAmendment.decide(contractId, amendmentId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contract-amendments', contractId] });
      qc.invalidateQueries({ queryKey: ['contracts', contractId] });
    },
  });
}

export function useWithdrawAmendment(contractId: number | string) {
  const { contractAmendment } = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (amendmentId: number | string) => contractAmendment.withdraw(contractId, amendmentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contract-amendments', contractId] });
    },
  });
}
