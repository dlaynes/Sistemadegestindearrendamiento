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
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-2 text-sm',
};

export function StatusBadge({
  status,
  type,
  label,
  className,
  size = 'md',
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

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        sizeClasses[size],
        getColorClass(),
        className
      )}
    >
      {getLabel()}
    </span>
  );
}
