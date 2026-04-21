import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../ui/utils';

interface SummaryCard {
  /**
   * Card label
   */
  label: string;
  /**
   * Card value
   */
  value: string | number;
  /**
   * Icon component
   */
  icon: LucideIcon;
  /**
   * Icon background color class
   */
  color: string;
}

interface SummaryCardsProps {
  /**
   * Array of summary cards to display
   */
  cards: SummaryCard[];
  /**
   * Optional additional class names for the grid
   */
  className?: string;
  /**
   * Number of columns on large screens
   */
  columns?: 2 | 3 | 4;
}

/**
 * SummaryCards - A grid of summary statistic cards
 * 
 * Usage:
 * ```tsx
 * <SummaryCards
 *   cards={[
 *     { label: 'Total Contratos', value: '24', icon: FileText, color: 'bg-blue-500' },
 *     { label: 'Activos', value: '18', icon: CheckCircle, color: 'bg-green-500' },
 *   ]}
 *   columns={4}
 * />
 * ```
 */
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
          className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4"
        >
          <div className={cn('p-3 rounded-lg', card.color)}>
            <card.icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-600">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
