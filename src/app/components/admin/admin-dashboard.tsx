import { Users, Building2, FileText, DollarSign } from 'lucide-react';
import { AlertType } from '../../types/alert-type';
import { AlertBox } from '../shared/alert-box';
import { StatsCard, ActivityItem, PageHeader } from '../shared';

export function AdminDashboard() {
  const stats = [
    { label: 'Total Propiedades', value: '24', icon: Building2, color: 'bg-blue-500', change: '+3 este mes' },
    { label: 'Total Contratos', value: '18', icon: FileText, color: 'bg-purple-500', change: '+2 este mes' },
    { label: 'Total Usuarios', value: '42', icon: Users, color: 'bg-green-500', change: '+5 este mes' },
    { label: 'Ingresos Totales', value: '$48,500', icon: DollarSign, color: 'bg-yellow-500', change: '+12% este mes' },
  ];

  const recentActivity = [
    { type: 'Nuevo contrato', description: 'Contrato firmado para Propiedad #5', time: 'Hace 2 horas', status: 'success' as const },
    { type: 'Pago recibido', description: 'Pago de $1,200 procesado', time: 'Hace 4 horas', status: 'success' as const },
    { type: 'Nueva propiedad', description: 'Apartamento en Centro agregado', time: 'Hace 1 día', status: 'info' as const },
    { type: 'Pago pendiente', description: 'Contrato #CT-004 vence mañana', time: 'Hace 1 día', status: 'warning' as const },
  ];

  const alerts : { message: string; type: AlertType }[] = [
    { message: '4 arrendatarios nuevos agregados al sistema en la última semana', type: 'success' },
  ];

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
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            change={stat.change}
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
