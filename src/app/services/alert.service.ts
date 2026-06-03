import { apiGet, apiPost } from './api-client';
import type { AlertListResponse } from '../types/alert';

export interface AlertService {
  listMine(opts?: { includeRead?: boolean; includeDismissed?: boolean }): Promise<AlertListResponse>;
  markSeen(alertId: number): Promise<{ id: number; seen: true }>;
  markAllSeen(): Promise<{ updated: number }>;
  dismiss(alertId: number): Promise<{ id: number; dismissed: true }>;
}

export class ApiAlertService implements AlertService {
  async listMine(opts: { includeRead?: boolean; includeDismissed?: boolean } = {}): Promise<AlertListResponse> {
    const params = new URLSearchParams();
    if (opts.includeRead !== undefined) params.set('includeRead', String(opts.includeRead));
    if (opts.includeDismissed !== undefined) params.set('includeDismissed', String(opts.includeDismissed));
    const qs = params.toString();
    return apiGet<AlertListResponse>(`/alerts/mine${qs ? `?${qs}` : ''}`);
  }

  async markSeen(alertId: number): Promise<{ id: number; seen: true }> {
    return apiPost<{ id: number; seen: true }>(`/alerts/${alertId}/seen`, {});
  }

  async markAllSeen(): Promise<{ updated: number }> {
    return apiPost<{ updated: number }>(`/alerts/seen-all`, {});
  }

  async dismiss(alertId: number): Promise<{ id: number; dismissed: true }> {
    return apiPost<{ id: number; dismissed: true }>(`/alerts/${alertId}/dismiss`, {});
  }
}
