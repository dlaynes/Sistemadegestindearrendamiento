import { Home, FileText, DollarSign, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { PageHeader, StatusBadge } from '../shared';
import { useDashboard } from '../../contexts/dashboard-context';

export function InquilinoDashboard() {
  const { stats, isLoading, upcomingPayments, myProperties, myPayments } = useDashboard();

  const nextPayment = upcomingPayments[0];

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
        title="Dashboard - Inquilino"
        subtitle="Información de tu arrendamiento"
      />

      {/* Notificaciones */}
      {nextPayment && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-warning-muted border border-warning">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-warning" />
            <p className="text-sm font-medium text-warning-muted-foreground">
              Tu próximo pago de {nextPayment.amount} vence el {nextPayment.dueDate}
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-info">
              <Home className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{myProperties.length}</h3>
          <p className="text-sm text-muted-foreground mb-2">Mi Propiedad</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-info">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{stats.activeContracts}</h3>
          <p className="text-sm text-muted-foreground mb-2">Contrato Activo</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-success">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">${stats.totalIncome.toLocaleString()}</h3>
          <p className="text-sm text-muted-foreground mb-2">Total Pagado</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-warning">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{stats.pendingPayments}</h3>
          <p className="text-sm text-muted-foreground mb-2">Pagos Pendientes</p>
        </div>
      </div>

      {/* Historial de Pagos */}
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Historial de Pagos</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {myPayments.length > 0 ? (
            myPayments.map((payment) => {
              const statusIcon =
                payment.status === 'pagado' ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : payment.status === 'pendiente' ? (
                  <Clock className="w-5 h-5 text-warning" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-destructive" />
                );
              return (
                <div
                  key={payment.id}
                  className="p-4 flex items-center justify-between hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {statusIcon}
                    <div>
                      <p className="font-medium text-foreground">{payment.property || 'Propiedad'}</p>
                      <p className="text-sm text-muted-foreground">{payment.dueDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${Number(payment.amount).toLocaleString()}</p>
                    <StatusBadge status={payment.status} type="payment" size="sm" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-muted-foreground">No hay pagos registrados</div>
          )}
        </div>
      </div>
    </div>
  );
}
