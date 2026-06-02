import type { LucideIcon } from 'lucide-react';
import { cn } from '../../ui/utils';
import { StatTile } from '../ui/stat-tile';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  change?: string;
  className?: string;
  showTrend?: boolean;
}

/**
 * StatsCard — kept as a thin alias to the modern StatTile primitive.
 * The previous `color` prop (e.g. "bg-info") is ignored; StatusIcon styling
 * is owned by StatTile. Existing callers continue to work unchanged.
 */
export function StatsCard({
  label,
  value,
  icon,
  change,
  className,
  showTrend: _showTrend = true,
}: StatsCardProps) {
  return (
    <StatTile
      label={label}
      value={value}
      icon={icon}
      trend={change ? { value: change, direction: 'up' } : undefined}
      className={cn(className)}
    />
  );
}
