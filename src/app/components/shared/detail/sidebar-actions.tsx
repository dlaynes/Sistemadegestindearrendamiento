import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../ui/utils';

interface SidebarAction {
  /**
   * Action label
   */
  label: string;
  /**
   * Action icon
   */
  icon: LucideIcon;
  /**
   * Click handler
   */
  onClick: () => void;
  /**
   * Visual variant
   */
  variant?: 'primary' | 'secondary' | 'danger';
  /**
   * Disabled state
   */
  disabled?: boolean;
}

interface SidebarActionsProps {
  /**
   * Section title
   */
  title: string;
  /**
   * Array of actions
   */
  actions: SidebarAction[];
  /**
   * Optional additional class names
   */
  className?: string;
}

const variantClasses = {
  primary: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
  secondary: 'bg-gray-50 text-gray-700 hover:bg-gray-100',
  danger: 'bg-red-50 text-red-700 hover:bg-red-100',
};

/**
 * SidebarActions - A reusable sidebar actions component for detail views
 * 
 * Usage:
 * ```tsx
 * <SidebarActions
 *   title="Acciones"
 *   actions={[
 *     { label: 'Editar', icon: Edit, onClick: handleEdit, variant: 'primary' },
 *     { label: 'Eliminar', icon: Trash2, onClick: handleDelete, variant: 'danger' },
 *   ]}
 * />
 * ```
 */
export function SidebarActions({
  title,
  actions,
  className,
}: SidebarActionsProps) {
  return (
    <div className={cn('bg-white rounded-lg shadow-sm border border-gray-200', className)}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-4 space-y-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              'w-full flex items-center gap-2 px-4 py-2 rounded-lg font-medium',
              'transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
              variantClasses[action.variant || 'secondary']
            )}
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
