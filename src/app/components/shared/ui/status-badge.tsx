import { cn } from '../../ui/utils';
import {
  type ContractStatus,
  type PaymentStatus,
  type PropertyStatus,
  type UserStatus,
  getContractStatusColor,
  getContractStatusLabel,
  getPaymentStatusColor,
  getPaymentStatusLabel,
  getPropertyStatusColor,
  getPropertyStatusLabel,
  getUserStatusColor,
  getUserStatusLabel,
} from '../utils/status-utils';

type StatusType = 'contract' | 'payment' | 'property' | 'user';

export interface StatusBadgeProps {
  status: ContractStatus | PaymentStatus | PropertyStatus | UserStatus | string;
  type: StatusType;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'pill' | 'dot';
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
};

/** Map a status type + status string to a 6px-tall CSS variable to color a status dot. */
const dotColor: Record<string, string> = {
  'bg-success-muted': 'bg-success',
  'bg-warning-muted': 'bg-warning',
  'bg-destructive-muted': 'bg-destructive',
  'bg-info-muted': 'bg-info',
  'bg-primary-muted': 'bg-primary',
  'bg-muted': 'bg-muted-foreground',
};

function colorClassToDot(color: string): string {
  // status-utils returns pairs like "bg-success-muted text-success-muted-foreground"
  const token = color.split(' ').find((c) => c.startsWith('bg-') && c.endsWith('-muted'));
  if (!token) return 'bg-muted-foreground';
  return dotColor[token] ?? 'bg-muted-foreground';
}

export function StatusBadge({
  status,
  type,
  label,
  className,
  size = 'md',
  variant = 'pill',
}: StatusBadgeProps) {
  const getColorClass = (): string => {
    switch (type) {
      case 'contract':
        return getContractStatusColor(status as ContractStatus);
      case 'payment':
        return getPaymentStatusColor(status as PaymentStatus);
      case 'property':
        return getPropertyStatusColor(status as PropertyStatus);
      case 'user':
        return getUserStatusColor(status as UserStatus);
      default:
        return 'bg-muted text-foreground';
    }
  };

  const getLabel = (): string => {
    if (label) return label;
    switch (type) {
      case 'contract':
        return getContractStatusLabel(status as ContractStatus);
      case 'payment':
        return getPaymentStatusLabel(status as PaymentStatus);
      case 'property':
        return getPropertyStatusLabel(status as PropertyStatus);
      case 'user':
        return getUserStatusLabel(status as UserStatus);
      default:
        return status;
    }
  };

  const colorClass = getColorClass();
  const text = getLabel();

  if (variant === 'dot') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-2 text-sm text-foreground',
          className,
        )}
      >
        <span
          aria-hidden="true"
          className={cn('h-2 w-2 shrink-0 rounded-full', colorClassToDot(colorClass))}
        />
        <span>{text}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        sizeClasses[size],
        colorClass,
        className,
      )}
    >
      {text}
    </span>
  );
}
