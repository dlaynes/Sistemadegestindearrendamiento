import { Users, Building2, FileText, DollarSign } from 'lucide-react';
import { AlertType } from '../../types/alert-type';
import { AlertBox } from '../shared/alert-box';
import { StatsCard, ActivityItem, PageHeader } from '../shared';
import { useDashboard } from '../../contexts/dashboard-context';

export function AdminDashboard() {
  const { stats, recentActivity, isLoading } = useDashboard();

  const dashboardStats = [
    { label: 'Total Propiedades', value: String(stats.totalProperties), icon: Building2, color: 'bg-blue-500' },
    { label: 'Total Contratos', value: String(stats.totalContracts), icon: FileText, color: 'bg-purple-500' },
    { label: 'Total Usuarios', value: String(stats.totalUsers), icon: Users, color: 'bg-green-500' },
    { label: 'Ingresos Totales', value: `$${stats.totalIncome.toLocaleString()}`, icon: DollarSign, color: 'bg-yellow-500' },
  ];

  const alerts : { message: string; type: AlertType }[] = [
    { message: '4 arrendatarios nuevos agregados al sistema en la última semana', type: 'success' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
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
