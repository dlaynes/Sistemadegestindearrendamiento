export interface AdminAlert {
  id: string;
  title: string;
  body?: string;
  category: 'system';
  severity: 'info' | 'warning' | 'critical';
  metric: string;
  change: number;
  changePercent: number;
}

export interface DashboardPeriodComparison {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
}
