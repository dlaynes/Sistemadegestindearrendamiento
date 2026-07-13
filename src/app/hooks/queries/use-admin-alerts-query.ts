import { useQuery } from '@tanstack/react-query';
import { useServices } from '../../services';
import { useAuth } from '../../contexts/auth-context';

export function useAdminAlerts() {
  const { dashboard } = useServices();
  const { user } = useAuth();

  return useQuery({
    queryKey: ['admin', 'dashboard', 'alerts'],
    queryFn: () => dashboard.getAdminAlerts(),
    enabled: user?.role === 'administrador',
    staleTime: 60_000,
  });
}
