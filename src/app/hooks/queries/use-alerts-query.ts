import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../../services';
import type { AlertListResponse } from '../../types/alert';

const ALERTS_STALE_MS = 30_000;

export function useAlerts(opts: { includeRead?: boolean; includeDismissed?: boolean } = {}) {
  const { alert } = useServices();
  return useQuery<AlertListResponse>({
    queryKey: ['alerts', opts],
    queryFn: () => alert.listMine(opts),
    staleTime: ALERTS_STALE_MS,
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
  });
}

export function useMarkAlertSeen() {
  const { alert } = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (alertId: number) => alert.markSeen(alertId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }),
  });
}

export function useMarkAllAlertsSeen() {
  const { alert } = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => alert.markAllSeen(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }),
  });
}

export function useDismissAlert() {
  const { alert } = useServices();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (alertId: number) => alert.dismiss(alertId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['alerts'] }),
  });
}
