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
        'bg-white rounded-lg shadow-sm p-6 border border-gray-200',
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn('p-3 rounded-lg', color)}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {showTrend && (
          <TrendingUp className="w-5 h-5 text-green-500" />
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-600 mb-2">{label}</p>
      {change && (
        <p className="text-xs text-green-600 font-medium">{change}</p>
      )}
    </div>
  );
}
