import { Search } from 'lucide-react';
import { cn } from '../../ui/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SearchFilterProps {
  searchValue: string;
  searchPlaceholder?: string;
  onSearchChange: (value: string) => void;
  selectValue?: string;
  selectOptions?: SelectOption[];
  selectPlaceholder?: string;
  onSelectChange?: (value: string) => void;
  className?: string;
}

export function SearchFilter({
  searchValue,
  searchPlaceholder = 'Buscar...',
  onSearchChange,
  selectValue,
  selectOptions,
  selectPlaceholder = 'Filtrar',
  onSelectChange,
  className,
}: SearchFilterProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row gap-4', className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className={cn(
            'w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          )}
        />
      </div>
      
      {selectOptions && onSelectChange && (
        <select
          value={selectValue}
          onChange={(e) => onSelectChange(e.target.value)}
          className={cn(
            'px-4 py-2 border border-gray-300 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'bg-white text-gray-700'
          )}
        >
          <option value="">{selectPlaceholder}</option>
          {selectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
