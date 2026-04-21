import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../ui/utils';
import type { AlertType } from '../../types';

interface AlertBoxProps {
  message: string;
  type: AlertType;
}

const alertStyles: Record<AlertType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
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
