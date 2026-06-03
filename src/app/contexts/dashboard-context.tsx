import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { useServices } from '../services';
import type { DashboardData, DashboardStats, ActivityItem, UpcomingPayment } from '../services/dashboard.service';
import type { Property } from '../types/property';
import type { Contract } from '../types/contract';
import type { Payment } from '../types/payment';

interface DashboardContextType {
  data: DashboardData | null;
  stats: DashboardStats;
  recentActivity: ActivityItem[];
  upcomingPayments: UpcomingPayment[];
  myProperties: Property[];
  myContracts: Contract[];
  myPayments: Payment[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const defaultStats: DashboardStats = {
  totalProperties: 0,
  totalContracts: 0,
  totalUsers: 0,
  totalIncome: 0,
  pendingPayments: 0,
  activeContracts: 0,
  availableProperties: 0,
  overduePayments: 0,
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { dashboard: dashboardService } = useServices();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const dashboardData = await dashboardService.getDashboardData(user);
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [dashboardService, user]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const refresh = useCallback(async () => {
    await fetchDashboard();
  }, [fetchDashboard]);

  const stats = data?.stats || defaultStats;
  const recentActivity = data?.recentActivity || [];
  const upcomingPayments = data?.upcomingPayments || [];
  const myProperties = data?.myProperties || [];
  const myContracts = data?.myContracts || [];
  const myPayments = data?.myPayments || [];

  return (
    <DashboardContext.Provider
      value={{
        data,
        stats,
        recentActivity,
        upcomingPayments,
        myProperties,
        myContracts,
        myPayments,
        isLoading,
        error,
        refresh,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard debe ser usado dentro de un DashboardProvider');
  }
  return context;
}
