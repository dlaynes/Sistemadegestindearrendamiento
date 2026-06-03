import { useMemo } from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../../ui/utils';
import { Spinner } from '../ui/spinner';
import { EmptyState } from '../ui/empty-state';
import { AlertItem } from './alert-item';
import { useDismissAlert, useMarkAlertSeen } from '../../../hooks/queries/use-alerts-query';
import type { Alert, AlertCategory } from '../../../types/alert';

const CATEGORY_ORDER: AlertCategory[] = [
  'payment',
  'contract',
  'amendment',
  'message',
  'system',
];

const CATEGORY_LABEL: Record<AlertCategory, string> = {
  payment: 'Pagos',
  contract: 'Contratos',
  amendment: 'Enmiendas',
  message: 'Mensajes',
  system: 'Sistema',
};

export interface AlertListProps {
  alerts: Alert[];
  isLoading?: boolean;
  filter?: AlertCategory[];
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function AlertList({
  alerts,
  isLoading,
  filter,
  className,
  emptyTitle = 'Sin alertas',
  emptyDescription = 'No tienes alertas por ahora.',
}: AlertListProps) {
  const dismiss = useDismissAlert();
  const markSeen = useMarkAlertSeen();

  const grouped = useMemo(() => {
    const filtered = filter ? alerts.filter((a) => filter.includes(a.category)) : alerts;
    const byCat = new Map<AlertCategory, Alert[]>();
    for (const a of filtered) {
      if (!byCat.has(a.category)) byCat.set(a.category, []);
      byCat.get(a.category)!.push(a);
    }
    return CATEGORY_ORDER.filter((c) => byCat.has(c)).map((c) => ({
      category: c,
      items: byCat.get(c)!,
    }));
  }, [alerts, filter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="md" label="Cargando alertas" />
      </div>
    );
  }

  if (grouped.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title={emptyTitle}
        description={emptyDescription}
        className={cn('border-0 shadow-none', className)}
        iconSize="md"
      />
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {grouped.map(({ category, items }) => (
        <section key={category}>
          <header className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {CATEGORY_LABEL[category]}
            <span className="ml-1 text-muted-foreground">({items.length})</span>
          </header>
          <ul className="space-y-2">
            {items.map((a) => (
              <li key={a.id}>
                <AlertItem
                  alert={a}
                  onDismiss={(id) => dismiss.mutate(id)}
                  onSeen={(id) => {
                    if (a.unread) markSeen.mutate(id);
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
