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
          'block text-sm font-medium text-gray-700',
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div>{children}</div>
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
