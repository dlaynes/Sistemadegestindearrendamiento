import { Users, Building2, FileText, DollarSign } from 'lucide-react';
import { AlertType } from '../../types/alert-type';
import { AlertBox } from '../shared/alert-box';
import { StatTile, ActivityItem, PageHeader, DashboardSkeleton } from '../shared';
import { useDashboardData } from '../../hooks/queries';

export function AdminDashboard() {
  const { data, isLoading } = useDashboardData();
  const stats = data?.stats;
  const recentActivity = data?.recentActivity ?? [];

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

  const alerts: { message: string; type: AlertType }[] = [
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

      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <AlertBox key={index} {...alert} />
          ))}
        </div>
      )}

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

      <section className="rounded-xl border border-border-subtle bg-card shadow-elev-xs">
        <header className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <h2 className="text-h2 font-semibold text-foreground">Actividad Reciente</h2>
        </header>
        <div className="divide-y divide-border-subtle">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <ActivityItem
                key={index}
                type={activity.type}
                description={activity.description}
                time={activity.time}
                status={activity.status}
              />
            ))
          ) : (
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">
              Sin actividad reciente.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
