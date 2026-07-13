import { Users, Building2, FileText, DollarSign } from 'lucide-react';
import { AdminAlerts } from './admin-alerts';
import { StatTile, ActivityFeedCard, PageHeader, DashboardSkeleton } from '../shared';
import { useDashboardData } from '../../hooks/queries';

export function AdminDashboard() {
  const { data, isLoading } = useDashboardData();
  const stats = data?.stats;

  const dashboardStats = [
    {
      label: 'Total Propiedades',
      value: String(stats?.totalProperties ?? 0),
      icon: Building2,
    },
    {
      label: 'Total Contratos',
      value: String(stats?.totalContracts ?? 0),
      icon: FileText,
    },
    {
      label: 'Total Usuarios',
      value: String(stats?.totalUsers ?? 0),
      icon: Users,
    },
    {
      label: 'Ingresos Totales',
      value: `$${(stats?.totalIncome ?? 0).toLocaleString()}`,
      icon: DollarSign,
    },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard - Administrador"
        subtitle="Vista general del sistema de gestión"
      />

      <AdminAlerts />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatTile
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      <ActivityFeedCard />
    </div>
  );
}
