import React, { useId } from 'react';
import { cn } from '../../ui/utils';

interface FormFieldProps {
  label: string;
  children: React.ReactElement;
  required?: boolean;
  error?: string;
  helpText?: string;
  className?: string;
  labelClassName?: string;
}

export function FormField({
  label,
  children,
  required = false,
  error,
  helpText,
  className,
  labelClassName,
}: FormFieldProps) {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;

  const describedBy = [
    error ? errorId : undefined,
    helpText && !error ? helpId : undefined,
  ].filter(Boolean).join(' ') || undefined;

  const childWithAria = React.cloneElement(children, {
    id: fieldId,
    'aria-invalid': !!error || undefined,
    'aria-required': required || undefined,
    'aria-describedby': describedBy,
    'aria-errormessage': error ? errorId : undefined,
  });

  return (
    <div className={cn('space-y-1', className)}>
      <label
        htmlFor={fieldId}
        className={cn(
          'block text-sm font-medium text-foreground',
          labelClassName
        )}
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <div>{childWithAria}</div>
      {helpText && !error && (
        <p id={helpId} className="text-sm text-muted-foreground">{helpText}</p>
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          aria-live="polite"
          className="text-sm text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
