import type { LucideIcon } from 'lucide-react';
import { cn } from '../../ui/utils';

interface SidebarAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

interface SidebarActionsProps {
  title: string;
  actions: SidebarAction[];
  className?: string;
}

const variantClasses = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover focus-visible:ring-ring/40',
  secondary:
    'border border-border-subtle bg-card text-foreground hover:bg-surface',
  danger:
    'border border-destructive-muted bg-destructive-muted/40 text-destructive hover:bg-destructive-muted',
};

export function SidebarActions({
  title,
  actions,
  className,
}: SidebarActionsProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border-subtle bg-card shadow-elev-xs',
        className,
      )}
    >
      <div className="border-b border-border-subtle px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>

      <div className="space-y-2 p-4">
        {actions.map((action, index) => (
          <button
            key={index}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              'inline-flex w-full items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              variantClasses[action.variant || 'secondary'],
            )}
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
