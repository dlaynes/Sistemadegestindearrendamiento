/**
 * Status utility functions and constants for the rental management system
 */

import type {
  ContractStatus,
  PaymentStatus,
  PropertyStatus,
  UserStatus
} from '../../../types';

// Re-export types for convenience
export type { ContractStatus, PaymentStatus, PropertyStatus, UserStatus };

/**
 * Get the CSS color classes for a contract status
 */
export const getContractStatusColor = (status: ContractStatus): string => {
  switch (status) {
    case 'activo':
      return 'bg-success-muted text-success-muted-foreground';
    case 'proximo_vencer':
      return 'bg-warning-muted text-warning-muted-foreground';
    case 'vencido':
      return 'bg-destructive-muted text-destructive-muted-foreground';
    case 'cancelado':
      return 'bg-muted text-muted-foreground';
    case 'terminado':
      return 'bg-primary-muted text-primary-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

/**
 * Get the display label for a contract status
 */
export const getContractStatusLabel = (status: ContractStatus): string => {
  switch (status) {
    case 'activo':
      return 'Activo';
    case 'proximo_vencer':
      return 'Próximo a Vencer';
    case 'vencido':
      return 'Vencido';
    case 'cancelado':
      return 'Cancelado';
    case 'terminado':
      return 'Terminado';
    default:
      return status;
  }
};

/**
 * Get the CSS color classes for a payment status
 */
export const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case 'pagado':
      return 'bg-success-muted text-success-muted-foreground';
    case 'pendiente':
      return 'bg-warning-muted text-warning-muted-foreground';
    case 'vencido':
      return 'bg-destructive-muted text-destructive-muted-foreground';
    case 'procesando':
      return 'bg-primary-muted text-primary-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

/**
 * Get the display label for a payment status
 */
export const getPaymentStatusLabel = (status: PaymentStatus): string => {
  switch (status) {
    case 'pagado':
      return 'Pagado';
    case 'pendiente':
      return 'Pendiente';
    case 'vencido':
      return 'Vencido';
    case 'procesando':
      return 'Procesando';
    default:
      return status;
  }
};

/**
 * Get the CSS color classes for a property status
 */
export const getPropertyStatusColor = (status: PropertyStatus): string => {
  switch (status) {
    case 'ocupado':
      return 'bg-success-muted text-success-muted-foreground';
    case 'disponible':
      return 'bg-primary-muted text-primary-muted-foreground';
    case 'mantenimiento':
      return 'bg-warning-muted text-warning-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

/**
 * Get the display label for a property status
 */
export const getPropertyStatusLabel = (status: PropertyStatus): string => {
  switch (status) {
    case 'ocupado':
      return 'Ocupado';
    case 'disponible':
      return 'Disponible';
    case 'mantenimiento':
      return 'En Mantenimiento';
    default:
      return status;
  }
};

/**
 * Get the CSS color classes for a user status
 */
export const getUserStatusColor = (status: UserStatus): string => {
  switch (status) {
    case 'activo':
      return 'bg-success-muted text-success-muted-foreground';
    case 'inactivo':
      return 'bg-muted text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

/**
 * Get the display label for a user status
 */
export const getUserStatusLabel = (status: UserStatus): string => {
  switch (status) {
    case 'activo':
      return 'Activo';
    case 'inactivo':
      return 'Inactivo';
    default:
      return status;
  }
};

/**
 * Check if a status indicates an active/paid state
 */
export const isActiveStatus = (status: string): boolean => {
  return ['activo', 'pagado', 'ocupado'].includes(status.toLowerCase());
};

/**
 * Check if a status indicates a warning state
 */
export const isWarningStatus = (status: string): boolean => {
  return ['pendiente', 'proximo_vencer', 'vencido'].includes(status.toLowerCase());
};
