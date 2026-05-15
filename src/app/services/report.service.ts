import { apiGet, apiFetch } from './api-client';

export interface ReportSummary {
  properties: number;
  contracts: number;
  payments: number;
  users: number;
  income: number;
  calendar: number;
}

export interface ReportService {
  getSummary(): Promise<ReportSummary>;
  downloadReport(type: string): Promise<void>;
}

export class ApiReportService implements ReportService {
  async getSummary(): Promise<ReportSummary> {
    return apiGet<ReportSummary>('/admin/reports/summary');
  }

  async downloadReport(type: string): Promise<void> {
    const res = await apiFetch(`/admin/reports/${type}/download`, { method: 'GET' });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-${type}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}
