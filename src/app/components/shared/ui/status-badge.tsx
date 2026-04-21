import * as React from 'react';
import { cn } from '../../ui/utils';
import {
  ContractStatus,
  PaymentStatus,
  PropertyStatus,
  UserStatus,
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

interface StatusBadgeProps {
  /**
   * The status value to display
   */
  status: ContractStatus | PaymentStatus | PropertyStatus | UserStatus | string;
  /**
   * The type of status (determines styling and label mapping)
   */
  type: StatusType;
  /**
   * Optional custom label to override the default
   */
  label?: string;
  /**
   * Optional additional class names
   */
  className?: string;
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-2 text-sm',
};

/**
 * StatusBadge - A reusable badge component for displaying status
 * 
 * Usage:
 * ```tsx
 * <StatusBadge status="activo" type="contract" />
 * <StatusBadge status="pagado" type="payment" size="lg" />
 * <StatusBadge status="ocupado" type="property" />
 * ```
 */
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
        return 'bg-gray-100 text-gray-700';
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
