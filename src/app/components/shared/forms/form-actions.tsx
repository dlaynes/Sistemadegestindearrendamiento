import { cn } from '../../ui/utils';
import { Button } from '../../ui/button';

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
        'flex flex-col gap-3 border-t border-border-subtle pt-6 sm:flex-row',
        showDelete ? 'justify-between' : 'justify-end',
        className,
      )}
    >
      {showDelete && onDelete && (
        <Button type="button" variant="destructive" onClick={onDelete} disabled={isLoading}>
          {deleteLabel}
        </Button>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>

        <Button type="submit" variant="default" onClick={onSubmit} disabled={isLoading}>
          {submitLabel || defaultSubmitLabel}
        </Button>
      </div>
    </div>
  );
}
