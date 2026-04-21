import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../ui/utils';

interface InfoItem {
  /**
   * Item label
   */
  label: string;
  /**
   * Item value
   */
  value: React.ReactNode;
  /**
   * Optional icon
   */
  icon?: LucideIcon;
}

interface InfoCardProps {
  /**
   * Card title
   */
  title: string;
  /**
   * Array of info items to display
   */
  items: InfoItem[];
  /**
   * Optional icon for the title
   */
  icon?: LucideIcon;
  /**
   * Optional additional class names
   */
  className?: string;
  /**
   * Number of columns for the grid
   */
  columns?: 1 | 2 | 3;
  /**
   * Optional children for custom content
   */
  children?: React.ReactNode;
}

/**
 * InfoCard - A reusable info card component for detail views
 * 
 * Usage:
 * ```tsx
 * <InfoCard
 *   title="Información del Contrato"
 *   icon={FileText}
 *   columns={2}
 *   items={[
 *     { label: 'Inquilino', value: 'Juan Pérez', icon: User },
 *     { label: 'Propiedad', value: 'Apartamento #101', icon: Building2 },
 *   ]}
 * />
 * ```
 */
export function InfoCard({
  title,
  items,
  icon: CardIcon,
  className,
  columns = 2,
  children,
}: InfoCardProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={cn('bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {CardIcon && (
            <div className="p-2 bg-blue-50 rounded-lg">
              <CardIcon className="w-5 h-5 text-blue-600" />
            </div>
          )}
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
      </div>
      
      <div className={cn('p-6 grid gap-6', gridCols[columns])}>
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            {item.icon && (
              <item.icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-600">{item.label}</p>
              <div className="font-medium text-gray-900">{item.value}</div>
            </div>
          </div>
        ))}
        {children}
      </div>
    </div>
  );
}
