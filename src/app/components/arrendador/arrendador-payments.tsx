import { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { PageHeader } from '../shared/dashboard/page-header';
import { TableListSkeleton } from '../shared';
import { usePayment } from "../../contexts/payment-context";

export function ArrendadorPayments() {
  const { getMyPayments, isLoading } = usePayment();
  const navigate = useRoleNavigation();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pagado' | 'pendiente' | 'vencido'>('all');

  const myPayments = getMyPayments();

  const filteredPayments = myPayments.filter((payment) => {
    return statusFilter === 'all' || payment.status === statusFilter;
  });

  const totalPaid = myPayments.filter(p => p.status === 'pagado').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPending = myPayments.filter(p => p.status === 'pendiente').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalOverdue = myPayments.filter(p => p.status === 'vencido').reduce((sum, p) => sum + Number(p.amount), 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pagado':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'pendiente':
        return <Clock className="w-5 h-5 text-warning" />;
      case 'vencido':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pagado':
        return 'bg-success-muted text-success-muted-foreground';
      case 'pendiente':
        return 'bg-warning-muted text-warning-muted-foreground';
      case 'vencido':
        return 'bg-destructive-muted text-destructive-muted-foreground';
      default:
        return 'bg-muted text-foreground';
    }
  };

  if (isLoading) {
    return <TableListSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Mis Pagos" subtitle="Historial de pagos de tus propiedades" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-success-muted">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Total Pagado</span>
          </div>
          <p className="text-2xl font-bold text-foreground">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-warning-muted">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Pendiente</span>
          </div>
          <p className="text-2xl font-bold text-foreground">${totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-destructive-muted">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Vencido</span>
          </div>
          <p className="text-2xl font-bold text-foreground">${totalOverdue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pagado', 'pendiente', 'vencido'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-foreground border border-border hover:bg-muted'
            }`}
          >
            {status === 'all' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Inquilino</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Propiedad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-muted transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{payment.tenantName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-muted-foreground">{payment.property}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">${Number(payment.amount).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      <span className="mr-1">{getStatusIcon(payment.status)}</span>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-muted-foreground">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      {payment.dueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/pagos/${payment.id}`)}
                      className="text-primary hover:text-primary-hover"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
