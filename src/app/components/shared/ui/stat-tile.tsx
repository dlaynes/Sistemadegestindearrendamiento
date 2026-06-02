import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '../../ui/utils';

export interface StatTileProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction?: 'up' | 'down' | 'flat';
  };
  className?: string;
}

/**
 * StatTile — modern replacement for the old "icon-tile" pattern.
 * No solid context-colored squares; the icon sits in a subtle
 * surface-2 square and the value is the visual anchor.
 */
export function StatTile({ label, value, icon: Icon, trend, className }: StatTileProps) {
  const trendColor =
    trend?.direction === 'down'
      ? 'text-destructive'
      : trend?.direction === 'flat'
        ? 'text-muted-foreground'
        : 'text-success';

  const TrendIcon = trend?.direction === 'down' ? ArrowDownRight : ArrowUpRight;

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border-subtle bg-card p-5 shadow-elev-xs transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-elev-md',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-display font-semibold text-foreground tabular-nums">
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                'mt-1 inline-flex items-center gap-1 text-xs font-medium',
                trendColor,
              )}
            >
              <TrendIcon className="h-3.5 w-3.5" />
              <span>{trend.value}</span>
            </p>
          )}
        </div>
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface text-muted-foreground ring-1 ring-inset ring-border-subtle"
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
