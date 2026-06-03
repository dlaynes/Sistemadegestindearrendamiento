import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../ui/utils';
import { AlertPanel } from './alert-panel';
import { useAlerts } from '../../../hooks/queries/use-alerts-query';

export interface AlertBellProps {
  className?: string;
}

export function AlertBell({ className }: AlertBellProps) {
  const [open, setOpen] = useState(false);
  const { data } = useAlerts();
  const unread = data?.unreadCount ?? 0;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label={unread > 0 ? `Notificaciones, ${unread} sin leer` : 'Notificaciones'}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn('relative', className)}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card"
          />
        )}
      </Button>
      <AlertPanel open={open} onOpenChange={setOpen} />
    </>
  );
}
