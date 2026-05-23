import { ArrowLeft } from 'lucide-react';
import { cn } from '../../ui/utils';

export interface BackButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
  iconSize?: number;
}

export function BackButton({
  onClick,
  label = 'Volver',
  className,
  iconSize = 20,
}: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 text-muted-foreground hover:text-foreground',
        'transition-colors duration-200',
        className
      )}
    >
      <ArrowLeft className="w-5 h-5" size={iconSize} />
      <span>{label}</span>
    </button>
  );
}
