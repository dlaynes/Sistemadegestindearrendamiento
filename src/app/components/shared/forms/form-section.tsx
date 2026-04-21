import * as React from 'react';
import { cn } from '../../ui/utils';

interface FormSectionProps {
  /**
   * Section title
   */
  title: string;
  /**
   * Section children (form fields)
   */
  children: React.ReactNode;
  /**
   * Optional description
   */
  description?: string;
  /**
   * Optional additional class names
   */
  className?: string;
  /**
   * Number of columns for the grid layout
   */
  columns?: 1 | 2 | 3;
}

/**
 * FormSection - A reusable form section wrapper with title and grid layout
 * 
 * Usage:
 * ```tsx
 * <FormSection title="Información Básica" columns={2}>
 *   <FormField label="Nombre">...</FormField>
 *   <FormField label="Email">...</FormField>
 * </FormSection>
 * ```
 */
export function FormSection({
  title,
  children,
  description,
  className,
  columns = 2,
}: FormSectionProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className={cn('grid gap-4', gridCols[columns])}>
        {children}
      </div>
    </div>
  );
}
