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
  primary: 'bg-primary-muted text-primary-muted-foreground hover:bg-primary-muted',
  secondary: 'bg-muted text-foreground hover:bg-muted',
  danger: 'bg-destructive-muted text-destructive-muted-foreground hover:bg-destructive-muted',
};

export function SidebarActions({
  title,
  actions,
  className,
}: SidebarActionsProps) {
  return (
    <div className={cn('bg-card rounded-lg shadow-sm border border-border', className)}>
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground">{title}</h3>
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
