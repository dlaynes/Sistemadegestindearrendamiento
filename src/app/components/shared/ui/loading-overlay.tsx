import { Loader2 } from 'lucide-react';
import { cn } from '../../ui/utils';

export interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ visible, message = 'Procesando...', className }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-lg',
        className
      )}
    >
      <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-3" />
      <p className="text-sm font-medium text-gray-700">{message}</p>
    </div>
  );
}
