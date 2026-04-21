import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../ui/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';

type ButtonSize = 'sm' | 'md' | 'lg';

interface ActionButtonProps {
  /**
   * Button content
   */
  children: React.ReactNode;
  /**
   * Click handler
   */
  onClick?: () => void;
  /**
   * Visual variant
   */
  variant?: ButtonVariant;
  /**
   * Button size
   */
  size?: ButtonSize;
  /**
   * Optional icon to display before text
   */
  icon?: LucideIcon;
  /**
   * Optional icon to display after text
   */
  iconAfter?: LucideIcon;
  /**
   * Full width button
   */
  fullWidth?: boolean;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Additional class names
   */
  className?: string;
  /**
   * Button type attribute
   */
  type?: 'button' | 'submit' | 'reset';
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
  outline:
    'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  ghost:
    'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

/**
 * ActionButton - A reusable action button with consistent styling
 * 
 * Usage:
 * ```tsx
 * <ActionButton variant="primary" icon={Plus} onClick={handleAdd}>
 *   Agregar
 * </ActionButton>
 * 
 * <ActionButton variant="danger" icon={Trash2} size="sm">
 *   Eliminar
 * </ActionButton>
 * ```
 */
export function ActionButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconAfter: IconAfter,
  fullWidth = false,
  disabled = false,
  className,
  type = 'button',
}: ActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg',
        'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
      {IconAfter && <IconAfter className="w-4 h-4" />}
    </button>
  );
}
