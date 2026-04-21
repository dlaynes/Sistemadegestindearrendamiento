import type { LucideIcon } from 'lucide-react';
import { cn } from '../../ui/utils';

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
}

const iconSizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

const containerPaddingClasses = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  iconSize = 'md',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        containerPaddingClasses[iconSize],
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center rounded-full bg-gray-100 mb-4',
          iconSize === 'sm' ? 'p-3' : iconSize === 'md' ? 'p-4' : 'p-6'
        )}
      >
        <Icon className={cn('text-gray-400', iconSizeClasses[iconSize])} />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
