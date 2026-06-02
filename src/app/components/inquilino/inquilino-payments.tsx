import { useState } from 'react';
import { CheckCircle, Clock, Calendar } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { PageHeader } from '../shared/dashboard/page-header';
import { DataTable } from '../shared/ui/data-table';
import { StatusBadge } from '../shared/ui/status-badge';
import { TableListSkeleton } from '../shared';
import { usePayment } from '../../contexts/payment-context';

type StatusFilter = 'all' | 'pagado' | 'pendiente' | 'vencido';

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pagado', label: 'Pagado' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'vencido', label: 'Vencido' },
];

export function InquilinoPayments() {
  const { getMyPayments, isLoading } = usePayment();
  const navigate = useRoleNavigation();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const myPayments = getMyPayments();

  const filteredPayments = myPayments.filter((payment) => {
    return statusFilter === 'all' || payment.status === statusFilter;
  });

  const totalPaid = myPayments
    .filter((p) => p.status === 'pagado')
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPending = myPayments
    .filter((p) => p.status === 'pendiente')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  if (isLoading) {
    return <TableListSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Mis Pagos" subtitle="Historial de pagos de renta" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border-subtle bg-card p-6 shadow-elev-xs">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success-muted">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Total Pagado</span>
          </div>
          <p className="text-h2 font-semibold text-foreground">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-border-subtle bg-card p-6 shadow-elev-xs">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning-muted">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Pendiente</span>
          </div>
          <p className="text-h2 font-semibold text-foreground">${totalPending.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((opt) => {
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

      <DataTable
        columns={[
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
            key: 'status',
            header: 'Estado',
            render: (payment) => <StatusBadge status={payment.status} type="payment" />,
          },
          {
            key: 'dueDate',
            header: 'Fecha',
            cellClassName: 'text-muted-foreground',
            render: (payment) => (
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {payment.dueDate}
              </span>
            ),
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
                Ver
              </button>
            ),
          },
        ]}
        rows={filteredPayments}
        rowKey={(payment) => payment.id}
        emptyMessage="No hay pagos con el filtro actual."
      />
    </div>
  );
}
