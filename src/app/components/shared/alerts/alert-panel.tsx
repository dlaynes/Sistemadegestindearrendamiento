import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../../ui/sheet';
import { Button } from '../../ui/button';
import { Spinner } from '../ui/spinner';
import { AlertList } from './alert-list';
import { useAlerts, useMarkAllAlertsSeen } from '../../../hooks/queries/use-alerts-query';

export interface AlertPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AlertPanel({ open, onOpenChange }: AlertPanelProps) {
  const { data, isLoading } = useAlerts({ includeRead: true, includeDismissed: false });
  const markAll = useMarkAllAlertsSeen();
  const items = data?.items ?? [];
  const unread = data?.unreadCount ?? 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border-subtle px-5 py-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <SheetTitle>Notificaciones</SheetTitle>
              <SheetDescription>
                {unread > 0
                  ? `Tienes ${unread} alerta${unread === 1 ? '' : 's'} sin leer.`
                  : 'No tienes alertas sin leer.'}
              </SheetDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => markAll.mutate()}
              disabled={unread === 0 || markAll.isPending}
            >
              Marcar todo como leído
            </Button>
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Spinner size="md" label="Cargando alertas" />
            </div>
          ) : (
            <AlertList
              alerts={items}
              emptyTitle="Sin alertas"
              emptyDescription="No tienes alertas por ahora."
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
