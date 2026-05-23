import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../../services';
import { getStoredRole, getStoredUserId } from '../../services/api-client';
import type { Contract } from '../../types';

export function useContracts() {
  const { contract } = useServices();
  const role = getStoredRole();
  const userId = getStoredUserId();

  return useQuery({
    queryKey: ['contracts', { role, userId }],
    queryFn: () => contract.getAll(),
    enabled: !!role,
  });
}

export function useContract(id: string | number) {
  const { contract } = useServices();

  return useQuery({
    queryKey: ['contracts', id],
    queryFn: () => contract.getById(String(id)),
    enabled: !!id,
  });
}

export function useCreateContract() {
  const { contract } = useServices();
  const queryClient = useQueryClient();
  const role = getStoredRole();
  const userId = getStoredUserId();

  return useMutation({
    mutationFn: (data: Contract) => contract.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts', { role, userId }] });
    },
  });
}

export function useUpdateContract() {
  const { contract } = useServices();
  const queryClient = useQueryClient();
  const role = getStoredRole();
  const userId = getStoredUserId();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Contract }) => contract.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contracts', { role, userId }] });
      queryClient.invalidateQueries({ queryKey: ['contracts', variables.id] });
    },
  });
}

export function useDeleteContract() {
  const { contract } = useServices();
  const queryClient = useQueryClient();
  const role = getStoredRole();
  const userId = getStoredUserId();

  return useMutation({
    mutationFn: (id: string) => contract.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts', { role, userId }] });
    },
  });
}
