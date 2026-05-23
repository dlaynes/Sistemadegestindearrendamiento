import { useState } from 'react';
import { DollarSign, CheckCircle, Clock, AlertCircle, Calendar, TrendingUp } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { PageHeader } from '../shared/dashboard/page-header';
import { usePayment } from "../../contexts/payment-context";


export function AdminPayments() {
  const { payments } = usePayment();
  const navigate = useRoleNavigation();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pagado' | 'pendiente' | 'vencido'>('all');

  const filteredPayments = payments.filter((payment) => {
    return statusFilter === 'all' || payment.status === statusFilter;
  });

  const totalPaid = payments.filter(p => p.status === 'pagado').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPending = payments.filter(p => p.status === 'pendiente').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalOverdue = payments.filter(p => p.status === 'vencido').reduce((sum, p) => sum + Number(p.amount), 0);

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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pagado':
        return 'Pagado';
      case 'pendiente':
        return 'Pendiente';
      case 'vencido':
        return 'Vencido';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title='Pagos' subtitle='Gestiona y monitorea los pagos de renta' />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-success-muted p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Pagos Recibidos</p>
              <p className="text-2xl font-semibold text-foreground">${totalPaid.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-success">
            <TrendingUp className="w-4 h-4" />
            <span>+12% vs mes anterior</span>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-warning-muted p-3 rounded-lg">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Pagos Pendientes</p>
              <p className="text-2xl font-semibold text-foreground">${totalPending.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">3 pagos por vencer</p>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-destructive-muted p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Pagos Vencidos</p>
              <p className="text-2xl font-semibold text-foreground">${totalOverdue.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">1 pago requiere atención</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-4">
        <div className="flex items-center gap-4">
          <span className="text-foreground font-medium">Filtrar por estado:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-foreground hover:bg-muted'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('pagado')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'pagado'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-foreground hover:bg-muted'
              }`}
            >
              Pagados
            </button>
            <button
              onClick={() => setStatusFilter('pendiente')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'pendiente'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-foreground hover:bg-muted'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setStatusFilter('vencido')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'vencido'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-foreground hover:bg-muted'
              }`}
            >
              Vencidos
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Inquilino
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Propiedad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Fecha de Vencimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Fecha de Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-muted">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-foreground">{payment.tenantName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-muted-foreground">{payment.property}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-foreground">${Number(payment.amount).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{payment.dueDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-muted-foreground">
                      {payment.paidDate || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-primary hover:text-primary-muted-foreground font-medium text-sm" onClick={() => navigate(`/pagos/${payment.id}`)}>
                      Ver Pago
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPayments.length === 0 && (
        <div className="bg-card rounded-lg shadow-sm border border-border p-12 text-center">
          <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">No se encontraron pagos</h3>
          <p className="text-muted-foreground">Intenta ajustar los filtros</p>
        </div>
      )}
    </div>
  );
}