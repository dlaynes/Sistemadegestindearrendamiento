import * as React from 'react';
import { cn } from '../../ui/utils';

interface FormFieldProps {
  /**
   * Field label
   */
  label: string;
  /**
   * Field children (input, select, textarea)
   */
  children: React.ReactNode;
  /**
   * Whether the field is required
   */
  required?: boolean;
  /**
   * Error message
   */
  error?: string;
  /**
   * Help text/description
   */
  helpText?: string;
  /**
   * Optional additional class names for the container
   */
  className?: string;
  /**
   * Label class names
   */
  labelClassName?: string;
}

/**
 * FormField - A reusable form field wrapper with label and error handling
 * 
 * Usage:
 * ```tsx
 * <FormField label="Nombre" required error={errors.name?.message}>
 *   <input {...register('name')} />
 * </FormField>
 * ```
 */
export function FormField({
  label,
  children,
  required = false,
  error,
  helpText,
  className,
  labelClassName,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <label
        className={cn(
          'block text-sm font-medium text-foreground',
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <div>{children}</div>
      {helpText && !error && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
