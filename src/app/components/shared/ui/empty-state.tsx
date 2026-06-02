import type { LucideIcon } from 'lucide-react';
import { cn } from '../../ui/utils';
import { Button } from '../../ui/button';

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

const iconContainerClasses = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
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
        'flex flex-col items-center justify-center rounded-xl border border-border-subtle bg-card px-6 text-center',
        containerPaddingClasses[iconSize],
        className,
      )}
    >
      <div
        className={cn(
          'mb-4 flex items-center justify-center rounded-full bg-surface text-muted-foreground ring-1 ring-inset ring-border-subtle',
          iconContainerClasses[iconSize],
        )}
      >
        <Icon className={cn(iconSizeClasses[iconSize])} aria-hidden="true" />
      </div>
      <h3 className="mb-1 text-h3 font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} variant="default" size="default">
          {action.label}
        </Button>
      )}
    </div>
  );
}
