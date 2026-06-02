import { Home, FileText, DollarSign, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { StatTile, PageHeader, StatusBadge, DashboardSkeleton } from '../shared';
import { useDashboardData } from '../../hooks/queries';

export function InquilinoDashboard() {
  const { data, isLoading } = useDashboardData();

  const stats = data?.stats;
  const upcomingPayments = data?.upcomingPayments ?? [];
  const myProperties = data?.myProperties ?? [];
  const myPayments = data?.myPayments ?? [];
  const nextPayment = upcomingPayments[0];

  const dashboardStats = [
    { label: 'Mi Propiedad', value: myProperties.length, icon: Home },
    { label: 'Contrato Activo', value: String(stats?.activeContracts ?? 0), icon: FileText },
    {
      label: 'Total Pagado',
      value: `$${(stats?.totalIncome ?? 0).toLocaleString()}`,
      icon: DollarSign,
    },
    { label: 'Pagos Pendientes', value: String(stats?.pendingPayments ?? 0), icon: Calendar },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard - Inquilino"
        subtitle="Información de tu arrendamiento"
      />

      {nextPayment && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-start gap-3 rounded-lg border border-warning-muted bg-warning-muted/60 p-4"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <p className="text-sm font-medium text-warning-muted-foreground">
            Tu próximo pago de {nextPayment.amount} vence el {nextPayment.dueDate}
          </p>
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
        <header className="border-b border-border-subtle px-6 py-4">
          <h2 className="text-h2 font-semibold text-foreground">Historial de Pagos</h2>
        </header>
        <div className="divide-y divide-border-subtle">
          {myPayments.length > 0 ? (
            myPayments.map((payment) => {
              const statusIcon =
                payment.status === 'pagado' ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : payment.status === 'pendiente' ? (
                  <Clock className="h-5 w-5 text-warning" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                );
              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-surface"
                >
                  <div className="flex items-center gap-3">
                    {statusIcon}
                    <div>
                      <p className="font-medium text-foreground">
                        {payment.property || 'Propiedad'}
                      </p>
                      <p className="text-sm text-muted-foreground">{payment.dueDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ${Number(payment.amount).toLocaleString()}
                    </p>
                    <div className="mt-1">
                      <StatusBadge status={payment.status} type="payment" size="sm" />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="p-8 text-center text-sm text-muted-foreground">
              No hay pagos registrados
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
