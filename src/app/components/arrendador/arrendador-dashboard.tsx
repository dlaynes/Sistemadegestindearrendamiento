import { Building2, FileText, DollarSign, Users, Calendar, MapPin } from 'lucide-react';
import { StatTile, ActivityFeedCard, PageHeader, StatusBadge, DashboardSkeleton } from '../shared';
import { useDashboardData } from '../../hooks/queries';

export function ArrendadorDashboard() {
  const { data, isLoading } = useDashboardData();
  const stats = data?.stats;
  const upcomingPayments = data?.upcomingPayments ?? [];

  const dashboardStats = [
    { label: 'Mis Propiedades', value: String(stats?.totalProperties ?? 0), icon: Building2 },
    { label: 'Contratos Activos', value: String(stats?.activeContracts ?? 0), icon: FileText },
    {
      label: 'Ingresos del Mes',
      value: `$${(stats?.totalIncome ?? 0).toLocaleString()}`,
      icon: DollarSign,
    },
    { label: 'Inquilinos Activos', value: String(stats?.activeContracts ?? 0), icon: Users },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard - Arrendador"
        subtitle="Gestiona tus propiedades y contratos"
      />

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

      <ActivityFeedCard limit={6} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pagos Pendientes */}
        <section className="rounded-xl border border-border-subtle bg-card shadow-elev-xs">
          <header className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
            <h2 className="text-h2 font-semibold text-foreground">Pagos Pendientes</h2>
          </header>
          <div className="divide-y divide-border-subtle">
            {upcomingPayments.length > 0 ? (
              upcomingPayments.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-surface"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-muted">
                      <Calendar className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{payment.tenant}</p>
                      <p className="text-sm text-muted-foreground">{payment.property}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{payment.amount}</p>
                    <p className="text-sm text-muted-foreground">Vence: {payment.dueDate}</p>
                    <div className="mt-1">
                      <StatusBadge status={payment.status} type="payment" size="sm" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-8 text-center text-sm text-muted-foreground">No hay pagos pendientes</p>
            )}
          </div>
        </section>

        {/* Resumen Rápido */}
        <section className="rounded-xl border border-border-subtle bg-card shadow-elev-xs">
          <header className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
            <h2 className="text-h2 font-semibold text-foreground">Resumen Rápido</h2>
          </header>
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between rounded-lg bg-primary-muted p-3">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Propiedades disponibles</span>
              </div>
              <span className="font-semibold text-primary-muted-foreground">
                {stats?.availableProperties ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-warning-muted p-3">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-warning" />
                <span className="text-sm font-medium text-foreground">Pagos pendientes</span>
              </div>
              <span className="font-semibold text-warning-muted-foreground">
                {stats?.pendingPayments ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-destructive-muted p-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-destructive" />
                <span className="text-sm font-medium text-foreground">Pagos vencidos</span>
              </div>
              <span className="font-semibold text-destructive-muted-foreground">
                {stats?.overduePayments ?? 0}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
