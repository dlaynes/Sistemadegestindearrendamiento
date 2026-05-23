import { Building2, FileText, DollarSign, Users, Calendar, MapPin } from 'lucide-react';
import { StatsCard, PageHeader, StatusBadge } from '../shared';
import { useDashboard } from '../../contexts/dashboard-context';

export function ArrendadorDashboard() {
  const { stats, isLoading, upcomingPayments } = useDashboard();

  const dashboardStats = [
    { label: 'Mis Propiedades', value: String(stats.totalProperties), icon: Building2, color: 'bg-info' },
    { label: 'Contratos Activos', value: String(stats.activeContracts), icon: FileText, color: 'bg-info' },
    { label: 'Ingresos del Mes', value: `$${stats.totalIncome.toLocaleString()}`, icon: DollarSign, color: 'bg-success' },
    { label: 'Inquilinos Activos', value: String(stats.activeContracts), icon: Users, color: 'bg-warning' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pagos Pendientes */}
        <div className="bg-card rounded-lg shadow-sm border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Pagos Pendientes</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingPayments.length > 0 ? (
              upcomingPayments.map((payment, index) => (
                <div key={index} className="p-4 flex items-center justify-between hover:bg-muted transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-warning-muted flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{payment.tenant}</p>
                      <p className="text-sm text-muted-foreground">{payment.property}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{payment.amount}</p>
                    <p className="text-sm text-muted-foreground">Vence: {payment.dueDate}</p>
                    <StatusBadge status={payment.status} type="payment" size="sm" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No hay pagos pendientes
              </div>
            )}
          </div>
        </div>

        {/* Resumen Rápido */}
        <div className="bg-card rounded-lg shadow-sm border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Resumen Rápido</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between p-3 bg-primary-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Propiedades disponibles</span>
              </div>
              <span className="font-semibold text-primary-muted-foreground">{stats.availableProperties}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-warning-muted rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium text-foreground">Pagos pendientes</span>
              </div>
              <span className="font-semibold text-warning-muted-foreground">{stats.pendingPayments}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-destructive-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-destructive" />
                <span className="text-sm font-medium text-foreground">Pagos vencidos</span>
              </div>
              <span className="font-semibold text-destructive-muted-foreground">{stats.overduePayments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
