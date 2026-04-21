import * as React from 'react';
import { LucideIcon, TrendingUp } from 'lucide-react';
import { cn } from '../../ui/utils';

interface StatsCardProps {
  /**
   * Card label
   */
  label: string;
  /**
   * Card value
   */
  value: string | number;
  /**
   * Icon component
   */
  icon: LucideIcon;
  /**
   * Icon background color class (e.g., 'bg-blue-500', 'bg-green-500')
   */
  color: string;
  /**
   * Optional change indicator text (e.g., "+12% este mes", "+3 este mes")
   */
  change?: string;
  /**
   * Optional additional class names
   */
  className?: string;
  /**
   * Show trending up icon
   */
  showTrend?: boolean;
}

/**
 * StatsCard - A dashboard statistic card with icon and change indicator
 * 
 * Usage:
 * ```tsx
 * <StatsCard
 *   label="Total Propiedades"
 *   value="24"
 *   icon={Building2}
 *   color="bg-blue-500"
 *   change="+3 este mes"
 * />
 * ```
 */
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
