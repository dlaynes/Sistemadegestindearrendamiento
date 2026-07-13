import { useState } from 'react';
import { X, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';
import { Spinner } from '../shared/ui/spinner';
import { useAdminAlerts } from '../../hooks/queries/use-admin-alerts-query';
import type { AdminAlert } from '../../types/admin-alert';

const severityConfig = {
  info: { icon: Info, className: 'bg-primary-muted border-primary-muted text-primary-muted-foreground' },
  warning: { icon: AlertTriangle, className: 'bg-warning-muted border-warning text-warning-muted-foreground' },
  critical: { icon: AlertCircle, className: 'bg-destructive-muted border-destructive-muted text-destructive-muted-foreground' },
};

interface AdminAlertBannerProps {
  alert: AdminAlert;
  onClose: () => void;
}

function AdminAlertBanner({ alert, onClose }: AdminAlertBannerProps) {
  const config = severityConfig[alert.severity] ?? severityConfig.info;
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4',
        config.className
      )}
      role="alert"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{alert.title}</p>
        {alert.body && <p className="mt-0.5 text-xs opacity-90">{alert.body}</p>}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={onClose}
        aria-label="Cerrar alerta"
        className="h-7 w-7 shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

export function AdminAlerts() {
  const { data: alerts = [], isLoading } = useAdminAlerts();
  const [closedIds, setClosedIds] = useState<Set<string>>(new Set());

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner size="sm" label="" />
        <span>Cargando alertas...</span>
      </div>
    );
  }

  const visible = alerts.filter((a) => !closedIds.has(a.id));
  if (visible.length === 0) return null;

  return (
    <div className="space-y-3">
      {visible.map((alert) => (
        <AdminAlertBanner
          key={alert.id}
          alert={alert}
          onClose={() => setClosedIds((prev) => new Set([...prev, alert.id]))}
        />
      ))}
    </div>
  );
}

