/**
 * Date utility functions for the rental management system
 */

/**
 * Get the number of days until a contract expires
 * @param endDate - The contract end date in YYYY-MM-DD format
 * @param fromDate - Optional date to calculate from (defaults to current date)
 * @returns Number of days until expiration
 */
export const getDaysUntilExpiration = (endDate: string, fromDate: Date = new Date()): number => {
  const end = new Date(endDate);
  const diffTime = end.getTime() - fromDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Get the number of days a payment is overdue
 * @param dueDate - The payment due date in YYYY-MM-DD format
 * @param fromDate - Optional date to calculate from (defaults to current date)
 * @returns Number of days overdue (negative if not yet due)
 */
export const getDaysOverdue = (dueDate: string, fromDate: Date = new Date()): number => {
  const due = new Date(dueDate);
  const diffTime = fromDate.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Format a date to a localized string
 * @param date - Date string or Date object
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-ES', options);
};

/**
 * Format a date to a short format (e.g., "Mar 27, 2026")
 * @param date - Date string or Date object
 * @returns Formatted short date string
 */
export const formatShortDate = (date: string | Date): string => {
  return formatDate(date, { year: 'numeric', month: 'short', day: 'numeric' });
};

/**
 * Format a date to time ago format (e.g., "Hace 2 horas")
 * @param date - Date string or Date object
 * @returns Time ago string
 */
export const formatTimeAgo = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffDays > 0) {
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  }
  if (diffHours > 0) {
    return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  }
  if (diffMinutes > 0) {
    return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
  }
  return 'Hace un momento';
};
