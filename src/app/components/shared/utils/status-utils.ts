/**
 * Status utility functions and constants for the rental management system
 */

export type ContractStatus = 'activo' | 'inactivo' | 'proximo_vencer' | 'vencido';
export type PaymentStatus = 'pagado' | 'pendiente' | 'vencido' | 'procesando';
export type PropertyStatus = 'ocupado' | 'disponible' | 'mantenimiento';
export type UserStatus = 'activo' | 'inactivo';

/**
 * Get the CSS color classes for a contract status
 * @param status - Contract status
 * @returns Tailwind CSS classes for the status badge
 */
export const getContractStatusColor = (status: ContractStatus): string => {
  switch (status) {
    case 'activo':
      return 'bg-green-100 text-green-700';
    case 'inactivo':
      return 'bg-gray-100 text-gray-700';
    case 'proximo_vencer':
      return 'bg-yellow-100 text-yellow-700';
    case 'vencido':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

/**
 * Get the display label for a contract status
 * @param status - Contract status
 * @returns Human-readable status label
 */
export const getContractStatusLabel = (status: ContractStatus): string => {
  switch (status) {
    case 'activo':
      return 'Activo';
    case 'inactivo':
      return 'Inactivo';
    case 'proximo_vencer':
      return 'Próximo a Vencer';
    case 'vencido':
      return 'Vencido';
    default:
      return status;
  }
};

/**
 * Get the CSS color classes for a payment status
 * @param status - Payment status
 * @returns Tailwind CSS classes for the status badge
 */
export const getPaymentStatusColor = (status: PaymentStatus): string => {
  switch (status) {
    case 'pagado':
      return 'bg-green-100 text-green-700';
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-700';
    case 'vencido':
      return 'bg-red-100 text-red-700';
    case 'procesando':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

/**
 * Get the display label for a payment status
 * @param status - Payment status
 * @returns Human-readable status label
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
 * @param status - Property status
 * @returns Tailwind CSS classes for the status badge
 */
export const getPropertyStatusColor = (status: PropertyStatus): string => {
  switch (status) {
    case 'ocupado':
      return 'bg-green-100 text-green-700';
    case 'disponible':
      return 'bg-blue-100 text-blue-700';
    case 'mantenimiento':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

/**
 * Get the display label for a property status
 * @param status - Property status
 * @returns Human-readable status label
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
 * @param status - User status
 * @returns Tailwind CSS classes for the status badge
 */
export const getUserStatusColor = (status: UserStatus): string => {
  switch (status) {
    case 'activo':
      return 'bg-green-100 text-green-700';
    case 'inactivo':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

/**
 * Get the display label for a user status
 * @param status - User status
 * @returns Human-readable status label
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
 * @param status - Any status type
 * @returns Boolean indicating if the status is active/paid
 */
export const isActiveStatus = (status: string): boolean => {
  return ['activo', 'pagado', 'ocupado'].includes(status.toLowerCase());
};

/**
 * Check if a status indicates a warning state
 * @param status - Any status type
 * @returns Boolean indicating if the status requires attention
 */
export const isWarningStatus = (status: string): boolean => {
  return ['pendiente', 'proximo_vencer', 'vencido'].includes(status.toLowerCase());
};
