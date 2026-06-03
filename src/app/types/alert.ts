import type { UserRole } from './user';

export type AlertCategory = 'payment' | 'contract' | 'message' | 'amendment' | 'system';
export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface Alert {
  id: number;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  body?: string;
  actionUrl?: string;
  sourceType?: string;
  sourceId?: number;
  createdAt: string;
  seenAt?: string | null;
  dismissedAt?: string | null;
  unread: boolean;
}

export interface AlertListResponse {
  items: Alert[];
  unreadCount: number;
}

export const ALERT_ROLE_PATH: Record<UserRole, string> = {
  administrador: 'administrador',
  arrendador: 'arrendador',
  inquilino: 'inquilino',
};
