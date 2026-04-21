import * as React from 'react';
import { cn } from '../../ui/utils';

export type ActivityStatus = 'success' | 'warning' | 'info' | 'error';

interface ActivityItemProps {
  /**
   * Activity type/title
   */
  type: string;
  /**
   * Activity description
   */
  description: string;
  /**
   * Time indicator (e.g., "Hace 2 horas", "Hace 1 día")
   */
  time: string;
  /**
   * Status indicator color
   */
  status?: ActivityStatus;
  /**
   * Optional additional class names
   */
  className?: string;
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

const statusColors: Record<ActivityStatus, string> = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
  error: 'bg-red-500',
};

/**
 * ActivityItem - A single activity item for activity lists
 * 
 * Usage:
 * ```tsx
 * <ActivityItem
 *   type="Nuevo contrato"
 *   description="Contrato firmado para Propiedad #5"
 *   time="Hace 2 horas"
 *   status="success"
 * />
 * ```
 */
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
        'p-6 hover:bg-gray-50 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className={cn('inline-block w-2 h-2 rounded-full', statusColors[status])} />
            <h3 className="font-semibold text-gray-900">{type}</h3>
          </div>
          <p className="text-sm text-gray-600 ml-5">{description}</p>
        </div>
        <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{time}</span>
      </div>
    </div>
  );
}
