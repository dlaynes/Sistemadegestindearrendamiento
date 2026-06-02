import { useState } from 'react';
import { DollarSign, CheckCircle, Clock, AlertCircle, Calendar, TrendingUp } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { PageHeader } from "../shared/dashboard/page-header";
import { StatusBadge } from "../shared/ui/status-badge";
import { DataTable } from '../shared/ui/data-table';
import { usePayment } from '../../contexts/payment-context';

type StatusFilter = 'all' | 'pagado' | 'pendiente' | 'vencido';

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pagado', label: 'Pagado' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'vencido', label: 'Vencido' },
];

export function AdminPayments() {
  const { payments } = usePayment();
  const navigate = useRoleNavigation();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredPayments = payments.filter((payment) => {
    return statusFilter === 'all' || payment.status === statusFilter;
  });

  const totalPaid = payments
    .filter((p) => p.status === 'pagado')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPending = payments
    .filter((p) => p.status === 'pendiente')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const totalOverdue = payments
    .filter((p) => p.status === 'vencido')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Pagos" subtitle="Gestiona y monitorea los pagos de renta" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            label: 'Pagos Recibidos',
            value: `$${totalPaid.toLocaleString()}`,
            icon: CheckCircle,
            tone: 'text-success',
            bg: 'bg-success-muted',
            sub: '+12% vs mes anterior',
            subIcon: TrendingUp,
          },
          {
            label: 'Pagos Pendientes',
            value: `$${totalPending.toLocaleString()}`,
            icon: Clock,
            tone: 'text-warning',
            bg: 'bg-warning-muted',
            sub: '3 pagos por vencer',
          },
          {
            label: 'Pagos Vencidos',
            value: `$${totalOverdue.toLocaleString()}`,
            icon: AlertCircle,
            tone: 'text-destructive',
            bg: 'bg-destructive-muted',
            sub: '1 pago requiere atención',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border-subtle bg-card p-6 shadow-elev-xs"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.tone}`} />
              </div>
              <p className="text-sm text-muted-foreground">{card.label}</p>
            </div>
            <p className="text-h2 font-semibold text-foreground">{card.value}</p>
            {card.sub && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                {card.subIcon ? <card.subIcon className="h-3.5 w-3.5 text-success" /> : null}
                <span>{card.sub}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border-subtle bg-card p-4 shadow-elev-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-sm font-medium text-foreground">Filtrar:</span>
          {STATUS_FILTERS.map((opt) => {
            const active = statusFilter === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={
                  active
                    ? 'rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground'
                    : 'rounded-md border border-border-subtle bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface'
                }
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <DataTable
        columns={[
          {
            key: 'tenant',
            header: 'Inquilino',
            render: (payment) => <span className="font-medium">{payment.tenantName}</span>,
          },
          {
            key: 'property',
            header: 'Propiedad',
            cellClassName: 'text-muted-foreground',
            render: (payment) => payment.property,
          },
          {
            key: 'amount',
            header: 'Monto',
            render: (payment) => (
              <span className="font-semibold text-foreground">
                ${Number(payment.amount).toLocaleString()}
              </span>
            ),
          },
          {
            key: 'dueDate',
            header: 'Vencimiento',
            cellClassName: 'text-muted-foreground',
            render: (payment) => (
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {payment.dueDate}
              </span>
            ),
          },
          {
            key: 'paidDate',
            header: 'Fecha de Pago',
            cellClassName: 'text-muted-foreground',
            render: (payment) => payment.paidDate || '—',
          },
          {
            key: 'status',
            header: 'Estado',
            render: (payment) => <StatusBadge status={payment.status} type="payment" />,
          },
          {
            key: 'actions',
            header: 'Acciones',
            headerClassName: 'text-right',
            cellClassName: 'text-right',
            render: (payment) => (
              <button
                type="button"
                onClick={() => navigate(`/pagos/${payment.id}`)}
                className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
              >
                Ver Pago
              </button>
            ),
          },
        ]}
        rows={filteredPayments}
        rowKey={(payment) => payment.id}
        emptyMessage="No se encontraron pagos con el filtro actual."
      />

      {filteredPayments.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border-subtle bg-card p-12 text-center">
          <DollarSign className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-base font-semibold text-foreground">No se encontraron pagos</h3>
          <p className="text-sm text-muted-foreground">Intenta ajustar los filtros</p>
        </div>
      )}
    </div>
  );
}
