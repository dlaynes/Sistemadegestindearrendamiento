import { Users, Building2, FileText, DollarSign } from 'lucide-react';
import { AlertType } from '../../types/alert-type';
import { AlertBox } from '../shared/alert-box';
import { StatsCard, ActivityItem, PageHeader, DashboardSkeleton } from '../shared';
import { useDashboardData } from '../../hooks/queries';

export function AdminDashboard() {
  const { data, isLoading } = useDashboardData();
  const stats = data?.stats;
  const recentActivity = data?.recentActivity ?? [];

  const dashboardStats = [
    { label: 'Total Propiedades', value: String(stats?.totalProperties ?? 0), icon: Building2, color: 'bg-info' },
    { label: 'Total Contratos', value: String(stats?.totalContracts ?? 0), icon: FileText, color: 'bg-info' },
    { label: 'Total Usuarios', value: String(stats?.totalUsers ?? 0), icon: Users, color: 'bg-success' },
    { label: 'Ingresos Totales', value: `$${(stats?.totalIncome ?? 0).toLocaleString()}`, icon: DollarSign, color: 'bg-warning' },
  ];

  const alerts : { message: string; type: AlertType }[] = [
    { message: '4 arrendatarios nuevos agregados al sistema en la última semana', type: 'success' },
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

      {/* Alertas */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <AlertBox key={index} {...alert} />
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <StatsCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Actividad Reciente</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity, index) => (
            <ActivityItem
              key={index}
              type={activity.type}
              description={activity.description}
              time={activity.time}
              status={activity.status}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
