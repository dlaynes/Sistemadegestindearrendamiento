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
    <div className={cn('bg-card rounded-lg shadow-sm border border-border', className)}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          {CardIcon && (
            <div className="p-2 bg-primary-muted rounded-lg">
              <CardIcon className="w-5 h-5 text-primary" />
            </div>
          )}
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        </div>
      </div>
      
      <div className={cn('p-6 grid gap-6', gridCols[columns])}>
        {items?.map((item, index) => (
          <div key={index} className="flex items-start gap-3">
            {item.icon && (
              <item.icon className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
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
