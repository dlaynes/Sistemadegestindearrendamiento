import { cn } from '../../ui/utils';

export interface FilterOption {
  value: string;
  label: string;
}

interface FilterButtonsProps {
  options: FilterOption[];
  activeValue: string;
  onChange: (value: string) => void;
  className?: string;
}

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
              ? 'bg-primary text-white'
              : 'bg-muted text-foreground hover:bg-muted'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
