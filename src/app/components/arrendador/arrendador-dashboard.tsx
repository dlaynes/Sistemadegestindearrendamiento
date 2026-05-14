import { Building2, FileText, DollarSign, Users, Calendar, MapPin } from 'lucide-react';
import { StatsCard, PageHeader, StatusBadge } from '../shared';
import { useDashboard } from '../../contexts/dashboard-context';

export function ArrendadorDashboard() {
  const { stats, isLoading, upcomingPayments } = useDashboard();

  const dashboardStats = [
    { label: 'Mis Propiedades', value: String(stats.totalProperties), icon: Building2, color: 'bg-blue-500', change: '+1 este mes' },
    { label: 'Contratos Activos', value: String(stats.activeContracts), icon: FileText, color: 'bg-purple-500', change: '2 por renovar' },
    { label: 'Ingresos del Mes', value: `$${stats.totalIncome.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500', change: '+8% vs mes anterior' },
    { label: 'Inquilinos Activos', value: String(stats.activeContracts), icon: Users, color: 'bg-yellow-500', change: 'Todos al día' },
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
        title="Dashboard - Arrendador"
        subtitle="Gestiona tus propiedades y contratos"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pagos Pendientes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Pagos Pendientes</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingPayments.length > 0 ? (
              upcomingPayments.map((payment, index) => (
                <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payment.tenant}</p>
                      <p className="text-sm text-gray-500">{payment.property}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{payment.amount}</p>
                    <p className="text-sm text-gray-500">Vence: {payment.dueDate}</p>
                    <StatusBadge status={payment.status} type="payment" size="sm" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No hay pagos pendientes
              </div>
            )}
          </div>
        </div>

        {/* Resumen Rápido */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Resumen Rápido</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Propiedades disponibles</span>
              </div>
              <span className="font-semibold text-blue-700">{stats.availableProperties}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Pagos pendientes</span>
              </div>
              <span className="font-semibold text-yellow-700">{stats.pendingPayments}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-gray-700">Pagos vencidos</span>
              </div>
              <span className="font-semibold text-red-700">{stats.overduePayments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
