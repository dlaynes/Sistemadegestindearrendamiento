import { cn } from '../../ui/utils';

export type Role = 'administrador' | 'arrendador' | 'inquilino';

export interface RoleBadgeProps {
  role: Role | string;
  label?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[11px]',
  md: 'px-2.5 py-1 text-xs',
};

const colorByRole: Record<string, string> = {
  administrador: 'bg-info-muted text-info-muted-foreground',
  arrendador: 'bg-primary-muted text-primary-muted-foreground',
  inquilino: 'bg-success-muted text-success-muted-foreground',
};

const defaultLabel: Record<string, string> = {
  administrador: 'Administrador',
  arrendador: 'Arrendador',
  inquilino: 'Inquilino',
};

export function RoleBadge({ role, label, size = 'sm', className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        sizeClasses[size],
        colorByRole[role] ?? 'bg-muted text-muted-foreground',
        className,
      )}
    >
      {label ?? defaultLabel[role] ?? role}
    </span>
  );
}
