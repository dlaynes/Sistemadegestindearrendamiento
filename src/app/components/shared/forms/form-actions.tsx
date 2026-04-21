import * as React from 'react';
import { cn } from '../../ui/utils';
import { ActionButton } from '../ui/action-button';

interface FormActionsProps {
  /**
   * Cancel button handler
   */
  onCancel: () => void;
  /**
   * Submit button handler
   */
  onSubmit?: () => void;
  /**
   * Submit button label
   */
  submitLabel?: string;
  /**
   * Cancel button label
   */
  cancelLabel?: string;
  /**
   * Whether the form is being edited (shows "Guardar Cambios" vs "Crear")
   */
  isEditing?: boolean;
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * Optional additional class names
   */
  className?: string;
  /**
   * Show delete button
   */
  showDelete?: boolean;
  /**
   * Delete button handler
   */
  onDelete?: () => void;
  /**
   * Delete button label
   */
  deleteLabel?: string;
}

/**
 * FormActions - A reusable form action buttons component
 * 
 * Usage:
 * ```tsx
 * <FormActions
 *   onCancel={() => navigate(-1)}
 *   submitLabel={isEditing ? "Guardar Cambios" : "Crear Propiedad"}
 *   isEditing={isEditing}
 *   isLoading={isSubmitting}
 *   showDelete={isEditing}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export function FormActions({
  onCancel,
  onSubmit,
  submitLabel = 'Guardar',
  cancelLabel = 'Cancelar',
  isEditing = false,
  isLoading = false,
  className,
  showDelete = false,
  onDelete,
  deleteLabel = 'Eliminar',
}: FormActionsProps) {
  const defaultSubmitLabel = isEditing ? 'Guardar Cambios' : 'Crear';

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200',
        showDelete ? 'justify-between' : 'justify-end',
        className
      )}
    >
      {showDelete && onDelete && (
        <ActionButton
          variant="danger"
          onClick={onDelete}
          disabled={isLoading}
        >
          {deleteLabel}
        </ActionButton>
      )}
      
      <div className="flex gap-3">
        <ActionButton
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelLabel}
        </ActionButton>
        
        <ActionButton
          variant="primary"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {submitLabel || defaultSubmitLabel}
        </ActionButton>
      </div>
    </div>
  );
}
