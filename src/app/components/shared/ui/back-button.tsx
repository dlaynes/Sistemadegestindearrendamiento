import * as React from 'react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '../../ui/utils';

interface BackButtonProps {
  /**
   * Click handler for the button
   */
  onClick?: () => void;
  /**
   * Optional label text (defaults to "Volver")
   */
  label?: string;
  /**
   * Optional additional class names
   */
  className?: string;
  /**
   * Optional icon size
   */
  iconSize?: number;
}

/**
 * BackButton - A reusable back navigation button
 * 
 * Usage:
 * ```tsx
 * <BackButton onClick={() => navigate(-1)} />
 * <BackButton onClick={handleBack} label="Regresar" />
 * ```
 */
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
        'inline-flex items-center gap-2 text-gray-600 hover:text-gray-900',
        'transition-colors duration-200',
        className
      )}
    >
      <ArrowLeft className="w-5 h-5" size={iconSize} />
      <span>{label}</span>
    </button>
  );
}
