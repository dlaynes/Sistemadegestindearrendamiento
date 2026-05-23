import type { LucideIcon } from 'lucide-react';
import { cn } from '../../ui/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconAfter?: LucideIcon;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover focus:ring-primary',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-muted focus:ring-muted-foreground',
  outline:
    'bg-background text-foreground border border-border hover:bg-muted focus:ring-muted-foreground',
  danger:
    'bg-destructive text-destructive-foreground hover:bg-destructive-muted focus:ring-destructive',
  ghost:
    'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

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
