import * as React from 'react';
import { cn } from '../../ui/utils';

export interface FilterOption {
  /**
   * Option value
   */
  value: string;
  /**
   * Option label
   */
  label: string;
}

interface FilterButtonsProps {
  /**
   * Array of filter options
   */
  options: FilterOption[];
  /**
   * Currently selected value
   */
  activeValue: string;
  /**
   * Callback when selection changes
   */
  onChange: (value: string) => void;
  /**
   * Optional additional class names
   */
  className?: string;
}

/**
 * FilterButtons - A reusable filter buttons component for lists
 * 
 * Usage:
 * ```tsx
 * const [filter, setFilter] = useState('all');
 * 
 * <FilterButtons
 *   options={[
 *     { value: 'all', label: 'Todos' },
 *     { value: 'activo', label: 'Activos' },
 *     { value: 'proximo_vencer', label: 'Próximos' },
 *   ]}
 *   activeValue={filter}
 *   onChange={setFilter}
 * />
 * ```
 */
export function FilterButtons({
  options,
  activeValue,
  onChange,
  className,
}: FilterButtonsProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-colors',
            activeValue === option.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
