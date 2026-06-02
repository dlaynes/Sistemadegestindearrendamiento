import type { LucideIcon } from 'lucide-react';
import { cn } from '../../ui/utils';

export interface InfoItem {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
}

interface InfoCardProps {
  title: string;
  items?: InfoItem[];
  icon?: LucideIcon;
  className?: string;
  columns?: 1 | 2 | 3;
  children?: React.ReactNode;
}

export function InfoCard({
  title,
  items,
  icon: CardIcon,
  className,
  columns = 2,
  children,
}: InfoCardProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-border-subtle bg-card shadow-elev-xs',
        className,
      )}
    >
      <div className="border-b border-border-subtle px-6 py-4">
        <div className="flex items-center gap-3">
          {CardIcon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-muted text-primary">
              <CardIcon className="h-5 w-5" />
            </div>
          )}
          <h2 className="text-h2 font-semibold text-foreground">{title}</h2>
        </div>
      </div>

      <div className={cn('grid gap-6 p-6', gridCols[columns])}>
        {items?.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            {item.icon && (
              <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            )}
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <div className="font-medium text-foreground">{item.value}</div>
            </div>
          </div>
        ))}
        {children}
      </div>
    </div>
  );
}
