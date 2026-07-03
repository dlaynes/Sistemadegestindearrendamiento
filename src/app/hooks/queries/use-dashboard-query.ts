import { useQuery } from '@tanstack/react-query';
import { useServices } from '../../services';
import { useAuth } from '../../contexts/auth-context';

export function useDashboardData() {
  const { dashboard } = useServices();
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard', user?.role, user?.id],
    queryFn: () => dashboard.getDashboardData(user!),
    enabled: !!user,
    staleTime: 60_000,
  });
}

/**
 * Activity feed for the current user. Refreshes independently from the
 * stats/cards so a new amendment or payment shows up without invalidating the
 * heavier dashboard query.
 */
export function useRecentActivity() {
  const { dashboard } = useServices();
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard', 'activity', user?.role, user?.id],
    queryFn: () => dashboard.getRecentActivity(user!),
    enabled: !!user,
    staleTime: 30_000,
  });
}
