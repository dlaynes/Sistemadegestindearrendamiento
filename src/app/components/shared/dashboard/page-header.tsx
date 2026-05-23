import * as React from 'react';
import { cn } from '../../ui/utils';

interface PageHeaderProps {
  /**
   * Page title
   */
  title: string;
  /**
   * Optional subtitle/description
   */
  subtitle?: string;
  /**
   * Optional action element (button, link, etc.)
   */
  action?: React.ReactNode;
  /**
   * Optional additional class names
   */
  className?: string;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
}

const titleSizeClasses = {
  sm: 'text-2xl',
  md: 'text-3xl',
  lg: 'text-4xl',
};

const subtitleSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

/**
 * PageHeader - A consistent page header component
 * 
 * Usage:
 * ```tsx
 * <PageHeader
 *   title="Dashboard - Administrador"
 *   subtitle="Vista general del sistema de gestión"
 * />
 * 
 * <PageHeader
 *   title="Propiedades"
 *   subtitle="Gestiona tus propiedades"
 *   action={<Button>Agregar</Button>}
 * />
 * ```
 */
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
        'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
        className
      )}
    >
      <div>
        <h1 className={cn('font-bold text-foreground', titleSizeClasses[size])}>
          {title}
        </h1>
        {subtitle && (
          <p className={cn('text-muted-foreground mt-1', subtitleSizeClasses[size])}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
