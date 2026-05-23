import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../../services';
import { getStoredRole, getStoredUserId } from '../../services/api-client';
import type { Payment } from '../../types';

export function usePayments() {
  const { payment } = useServices();
  const role = getStoredRole();
  const userId = getStoredUserId();

  return useQuery({
    queryKey: ['payments', { role, userId }],
    queryFn: () => payment.getAll(),
    enabled: !!role,
  });
}

export function usePayment(id: string | number) {
  const { payment } = useServices();

  return useQuery({
    queryKey: ['payments', id],
    queryFn: () => payment.getById(String(id)),
    enabled: !!id,
  });
}

export function useCreatePayment() {
  const { payment } = useServices();
  const queryClient = useQueryClient();
  const role = getStoredRole();
  const userId = getStoredUserId();

  return useMutation({
    mutationFn: (data: Payment) => payment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', { role, userId }] });
    },
  });
}

export function useUpdatePayment() {
  const { payment } = useServices();
  const queryClient = useQueryClient();
  const role = getStoredRole();
  const userId = getStoredUserId();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Payment }) => payment.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments', { role, userId }] });
      queryClient.invalidateQueries({ queryKey: ['payments', variables.id] });
    },
  });
}

export function useDeletePayment() {
  const { payment } = useServices();
  const queryClient = useQueryClient();
  const role = getStoredRole();
  const userId = getStoredUserId();

  return useMutation({
    mutationFn: (id: string) => payment.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', { role, userId }] });
    },
  });
}
