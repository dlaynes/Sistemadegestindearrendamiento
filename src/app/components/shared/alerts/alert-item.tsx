import { Link } from 'react-router';
import {
  Bell,
  CreditCard,
  FileText,
  MessageSquare,
  GitMerge,
  Info,
  X,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '../../ui/utils';
import { Button } from '../../ui/button';
import type { Alert, AlertCategory, AlertSeverity } from '../../../types/alert';

const ICONS: Record<AlertCategory, typeof Bell> = {
  payment: CreditCard,
  contract: FileText,
  message: MessageSquare,
  amendment: GitMerge,
  system: Bell,
};

const SEVERITY_TONE: Record<AlertSeverity, { dot: string; icon: string }> = {
  info: { dot: 'bg-info', icon: 'text-info' },
  warning: { dot: 'bg-warning', icon: 'text-warning' },
  critical: { dot: 'bg-destructive', icon: 'text-destructive' },
};

const SEVERITY_ICON: Record<AlertSeverity, typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertCircle,
};

function relativeTime(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (Number.isNaN(d.getTime())) return '';
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'hace un momento';
  const min = Math.floor(sec / 60);
  if (min < 60) return `hace ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `hace ${hr} h`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `hace ${day} d`;
  return d.toLocaleDateString();
}

export interface AlertItemProps {
  alert: Alert;
  onDismiss: (id: number) => void;
  onSeen?: (id: number) => void;
  className?: string;
}

export function AlertItem({ alert, onDismiss, onSeen, className }: AlertItemProps) {
  const CatIcon = ICONS[alert.category] ?? Bell;
  const SevIcon = SEVERITY_ICON[alert.severity] ?? Info;
  const tone = SEVERITY_TONE[alert.severity];

  const body = (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border border-border-subtle bg-card p-3 transition-colors',
        alert.unread ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-transparent',
        alert.actionUrl ? 'hover:bg-surface' : '',
        className,
      )}
    >
      <span aria-hidden="true" className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', tone.dot)} />
      <SevIcon className={cn('h-4 w-4 shrink-0', tone.icon)} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-foreground">{alert.title}</p>
          <span className="shrink-0 text-[11px] text-muted-foreground">
            {relativeTime(alert.createdAt)}
          </span>
        </div>
        {alert.body && (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{alert.body}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <CatIcon className="h-3 w-3" aria-hidden="true" />
            {alert.category}
          </span>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onDismiss(alert.id);
        }}
        aria-label={`Descartar alerta: ${alert.title}`}
        className="h-7 w-7 shrink-0"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );

  if (alert.actionUrl) {
    return (
      <Link
        to={alert.actionUrl}
        onClick={() => onSeen?.(alert.id)}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:rounded-lg"
        aria-label={alert.title}
      >
        {body}
      </Link>
    );
  }
  return body;
}
