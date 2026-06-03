import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '../../ui/utils';
import { useAlerts } from '../../../hooks/queries/use-alerts-query';
import type { AlertSeverity } from '../../../types/alert';

const SEVERITY_STYLES: Record<AlertSeverity, string> = {
  info: 'bg-primary-muted border-primary-muted text-primary-muted-foreground',
  warning: 'bg-warning-muted border-warning-muted text-warning-muted-foreground',
  critical: 'bg-destructive-muted border-destructive-muted text-destructive-muted-foreground',
};

const SEVERITY_ICON: Record<AlertSeverity, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertCircle,
};

const SEVERITY_LABEL: Record<AlertSeverity, string> = {
  info: 'Aviso',
  warning: 'Atención',
  critical: 'Crítico',
};

export interface AlertBannerProps {
  severities?: AlertSeverity[];
  className?: string;
  emptyMessage?: string;
}

export function AlertBanner({ severities, className, emptyMessage }: AlertBannerProps) {
  const { data } = useAlerts();
  const items = (data?.items ?? []).filter((a) =>
    severities ? severities.includes(a.severity) : true,
  );
  const latest = items[0];

  if (!latest) {
    if (!emptyMessage) return null;
    return (
      <div
        className={cn(
          'flex items-start gap-3 rounded-lg border border-border-subtle bg-card p-4 text-sm text-muted-foreground',
          className,
        )}
      >
        <CheckCircle className="h-5 w-5 shrink-0 text-success" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const Icon = SEVERITY_ICON[latest.severity];
  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4',
        SEVERITY_STYLES[latest.severity],
        className,
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-semibold">
          {SEVERITY_LABEL[latest.severity]}: {latest.title}
        </p>
        {latest.body && <p className="mt-0.5 text-sm opacity-90">{latest.body}</p>}
      </div>
    </div>
  );
}
