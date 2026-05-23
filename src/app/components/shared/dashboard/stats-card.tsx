import type { LucideIcon } from 'lucide-react';
import { TrendingUp } from 'lucide-react';
import { cn } from '../../ui/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  change?: string;
  className?: string;
  showTrend?: boolean;
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  color,
  change,
  className,
  showTrend = true,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-lg shadow-sm p-6 border border-border',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn('p-3 rounded-lg', color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {showTrend && (
          <TrendingUp className="w-5 h-5 text-success" />
        )}
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      {change && (
        <p className="text-xs text-success font-medium">{change}</p>
      )}
    </div>
  );
}
