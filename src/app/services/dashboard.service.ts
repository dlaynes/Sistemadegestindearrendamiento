import type { User } from '../types/user';
import type { AdminAlert, DashboardPeriodComparison } from '../types';
import type { Property } from '../types/property';
import type { Contract } from '../types/contract';
import type { Payment } from '../types/payment';
import { apiGet, getStoredRole } from './api-client';

export interface DashboardStats {
  totalProperties: number;
  totalContracts: number;
  totalUsers: number;
  totalIncome: number;
  pendingPayments: number;
  activeContracts: number;
  availableProperties: number;
  overduePayments: number;
  periodComparison?: Record<string, DashboardPeriodComparison>;
  alerts?: AdminAlert[];
}

export interface ActivityItem {
  type: string;
  description: string;
  time: string;
  status: 'success' | 'info' | 'warning' | 'error';
}

export interface UpcomingPayment {
  tenant: string;
  property: string;
  amount: string;
  dueDate: string;
  status: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  upcomingPayments: UpcomingPayment[];
  myProperties: Property[];
  myContracts: Contract[];
  myPayments: Payment[];
}

/**
 * Wire-shape from the BE /api/{role}/dashboard/activity endpoint.
 * The mapper below turns each row into the FE-friendly ActivityItem.
 */
export interface ActivityEventDto {
  id: number;
  type: string;            // e.g. "payment_received", "amendment_proposed"
  description: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  occurredAt: string;      // ISO 8601
  sourceType?: string;
  sourceId?: number;
}

/** Map a BE row into the FE ActivityItem shape (compatible with ActivityItem.tsx). */
export function toActivityItem(dto: ActivityEventDto): ActivityItem {
  const severityMap: Record<string, ActivityItem['status']> = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error',
  };
  const status = severityMap[dto.severity] ?? 'info';
  let time: string = dto.occurredAt;
  try {
    time = new Date(dto.occurredAt).toLocaleString('es');
  } catch {
    /* keep the ISO string if toLocaleString fails */
  }
  return {
    type: dto.type,
    description: dto.description,
    time,
    status,
  };
}

export interface DashboardService {
  getDashboardData(user: User): Promise<DashboardData>;
  getStats(user: User): Promise<DashboardStats>;
  getRecentActivity(user: User): Promise<ActivityItem[]>;
  getUpcomingPayments(user: User): Promise<UpcomingPayment[]>;
  getAdminAlerts(): Promise<AdminAlert[]>;
}

function getPrefix(): string {
  const role = getStoredRole();
  if (role === 'administrador') return '/admin';
  if (role === 'arrendador') return '/landlord';
  if (role === 'inquilino') return '/tenant';
  return '/landlord';
}

function getStatsPath(): string {
  const role = getStoredRole();
  if (role === 'administrador') return '/admin/dashboard/stats';
  if (role === 'arrendador') return '/landlord/dashboard/stats';
  if (role === 'inquilino') return '/tenant/stats';
  return '/landlord/stats';
}

export class ApiDashboardService implements DashboardService {
  async getDashboardData(user: User): Promise<DashboardData> {
    const [stats, myProperties, myContracts, myPayments] = await Promise.all([
      this.getStats(user),
      this.fetchMyProperties(),
      this.fetchMyContracts(),
      this.fetchMyPayments(),
    ]);

    const upcomingPayments: UpcomingPayment[] = myPayments
      .filter((p) => p.status === 'pendiente' || p.status === 'vencido')
      .map((p) => ({
        tenant: p.tenantName || '',
        property: p.property || '',
        amount: p.amount,
        dueDate: p.dueDate,
        status: p.status,
      }));

    return {
      stats,
      recentActivity: [],
      upcomingPayments,
      myProperties,
      myContracts,
      myPayments,
    };
  }

  async getStats(_user: User): Promise<DashboardStats> {
    return apiGet<DashboardStats>(getStatsPath());
  }

  async getRecentActivity(_user: User): Promise<ActivityItem[]> {
    const rows = await apiGet<ActivityEventDto[]>(`${getPrefix()}/dashboard/activity`);
    return rows.map(toActivityItem);
  }

  async getUpcomingPayments(_user: User): Promise<UpcomingPayment[]> {
    const myPayments = await this.fetchMyPayments();
    return myPayments
      .filter((p) => p.status === 'pendiente' || p.status === 'vencido')
      .map((p) => ({
        tenant: p.tenantName || '',
        property: p.property || '',
        amount: p.amount,
        dueDate: p.dueDate,
        status: p.status,
      }));
  }

  async getAdminAlerts(): Promise<AdminAlert[]> {
    return apiGet<AdminAlert[]>('/admin/dashboard/alerts');
  }

  private async fetchMyProperties(): Promise<Property[]> {
    return apiGet<Property[]>(`${getPrefix()}/properties`);
  }

  private async fetchMyContracts(): Promise<Contract[]> {
    return apiGet<Contract[]>(`${getPrefix()}/contracts`);
  }

  private async fetchMyPayments(): Promise<Payment[]> {
    return apiGet<Payment[]>(`${getPrefix()}/payments`);
  }
}
