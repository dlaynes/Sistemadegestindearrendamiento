import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../ui/utils';
import type { AlertType } from '../../types';

interface AlertBoxProps {
  message: string;
  type: AlertType;
}

const alertStyles: Record<AlertType, string> = {
  success: 'bg-success-muted border-success text-success-muted-foreground',
  error: 'bg-destructive-muted border-destructive-muted text-destructive-muted-foreground',
  warning: 'bg-warning-muted border-warning text-warning-muted-foreground',
  info: 'bg-primary-muted border-primary-muted text-primary-muted-foreground',
};

const alertIcons: Record<AlertType, typeof AlertCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export function AlertBox({ message, type }: AlertBoxProps) {
  const Icon = alertIcons[type];
  
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        alertStyles[type]
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
