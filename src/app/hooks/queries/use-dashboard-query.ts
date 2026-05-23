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
