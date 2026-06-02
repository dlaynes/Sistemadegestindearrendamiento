import { cn } from '../../ui/utils';

export type ActivityStatus = 'success' | 'warning' | 'info' | 'error';

interface ActivityItemProps {
  type: string;
  description: string;
  time: string;
  status?: ActivityStatus;
  className?: string;
  onClick?: () => void;
}

const dotColor: Record<ActivityStatus, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  info: 'bg-info',
  error: 'bg-destructive',
};

export function ActivityItem({
  type,
  description,
  time,
  status = 'info',
  className,
  onClick,
}: ActivityItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-start justify-between gap-3 p-4 transition-colors hover:bg-surface',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      <div className="flex flex-1 items-start gap-3">
        <span
          aria-hidden="true"
          className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', dotColor[status])}
        />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{type}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <span className="shrink-0 whitespace-nowrap text-sm text-muted-foreground">
        {time}
      </span>
    </div>
  );
}
