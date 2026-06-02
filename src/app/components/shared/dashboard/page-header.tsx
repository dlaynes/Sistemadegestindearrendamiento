import * as React from 'react';
import { cn } from '../../ui/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const titleSizeClasses = {
  sm: 'text-h2',
  md: 'text-h1',
  lg: 'text-display',
};

const subtitleSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function PageHeader({
  title,
  subtitle,
  action,
  className,
  size = 'md',
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        <h1
          className={cn(
            'font-semibold tracking-tight text-foreground',
            titleSizeClasses[size],
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              'mt-1 text-muted-foreground',
              subtitleSizeClasses[size],
            )}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
