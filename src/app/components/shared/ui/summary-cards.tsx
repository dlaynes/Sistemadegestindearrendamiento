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
          className="bg-card rounded-lg border border-border p-4 flex items-center gap-4"
        >
          <div className={cn('p-3 rounded-lg', card.color)}>
            <card.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
