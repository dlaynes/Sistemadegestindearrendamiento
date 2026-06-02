import type { LucideIcon } from 'lucide-react';
import { cn } from '../../ui/utils';

interface SummaryCard {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export interface SummaryCardsProps {
  cards: SummaryCard[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export function SummaryCards({
  cards,
  className,
  columns = 4,
}: SummaryCardsProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', gridCols[columns], className)}>
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-xl border border-border-subtle bg-card p-4 shadow-elev-xs"
        >
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg ring-1 ring-inset ring-border-subtle',
              card.color,
            )}
          >
            <card.icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-h3 font-semibold text-foreground">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
