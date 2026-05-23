import { cn } from '../../ui/utils';
import { ActionButton } from '../ui/action-button';

interface FormActionsProps {
  onCancel: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  isEditing?: boolean;
  isLoading?: boolean;
  className?: string;
  showDelete?: boolean;
  onDelete?: () => void;
  deleteLabel?: string;
}

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
        'flex flex-col sm:flex-row gap-3 pt-6 border-t border-border',
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
