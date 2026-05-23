import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../../services';
import { getStoredRole, getStoredUserId } from '../../services/api-client';
import type { Property } from '../../types';

export function useProperties() {
  const { property } = useServices();
  const role = getStoredRole();
  const userId = getStoredUserId();

  return useQuery({
    queryKey: ['properties', { role, userId }],
    queryFn: () => property.getAll(),
    enabled: !!role,
  });
}

export function useProperty(id: string | number) {
  const { property } = useServices();

  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => property.getById(String(id)),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const { property } = useServices();
  const queryClient = useQueryClient();
  const role = getStoredRole();
  const userId = getStoredUserId();

  return useMutation({
    mutationFn: (data: Property) => property.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', { role, userId }] });
    },
  });
}

export function useUpdateProperty() {
  const { property } = useServices();
  const queryClient = useQueryClient();
  const role = getStoredRole();
  const userId = getStoredUserId();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Property }) => property.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties', { role, userId }] });
      queryClient.invalidateQueries({ queryKey: ['properties', variables.id] });
    },
  });
}

export function useDeleteProperty() {
  const { property } = useServices();
  const queryClient = useQueryClient();
  const role = getStoredRole();
  const userId = getStoredUserId();

  return useMutation({
    mutationFn: (id: string) => property.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties', { role, userId }] });
    },
  });
}
