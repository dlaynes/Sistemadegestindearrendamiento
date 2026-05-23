import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  FileText,
  Download,
  Calendar,
  Users,
  Building2,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '../shared/dashboard/page-header';
import { useServices } from '../../services';
import type { ReportSummary } from '../../services/report.service';

const REPORT_META = [
  {
    id: 'properties',
    name: 'Reporte de Propiedades',
    description: 'Información detallada de todas las propiedades del sistema',
    icon: Building2,
    iconColor: 'bg-primary-muted text-primary-muted-foreground',
    dataColumns: ['ID', 'Nombre', 'Dirección', 'Tipo', 'Estado', 'Precio'],
  },
  {
    id: 'contracts',
    name: 'Reporte de Contratos',
    description: 'Estado y fechas de todos los contratos activos',
    icon: FileText,
    iconColor: 'bg-info-muted text-info-muted-foreground',
    dataColumns: ['ID', 'Propiedad', 'Inquilino', 'Arrendador', 'Fecha Inicio', 'Fecha Fin'],
  },
  {
    id: 'payments',
    name: 'Reporte de Pagos',
    description: 'Historial completo de pagos y estados',
    icon: DollarSign,
    iconColor: 'bg-success-muted text-success-muted-foreground',
    dataColumns: ['ID', 'Contrato', 'Monto', 'Estado', 'Fecha'],
  },
  {
    id: 'users',
    name: 'Reporte de Usuarios',
    description: 'Lista de todos los usuarios del sistema',
    icon: Users,
    iconColor: 'bg-destructive-muted text-destructive-muted-foreground',
    dataColumns: ['ID', 'Nombre', 'Rol', 'Estado', 'Último Login'],
  },
  {
    id: 'income',
    name: 'Reporte de Ingresos',
    description: 'Resumen financiero y análisis de ingresos',
    icon: TrendingUp,
    iconColor: 'bg-warning-muted text-warning-muted-foreground',
    dataColumns: ['Mes', 'Ingresos Rentas', 'Pagos Pendientes', 'Total'],
  },
  {
    id: 'calendar',
    name: 'Reporte Calendario',
    description: 'Visión cronológica de eventos y fechas importantes',
    icon: Calendar,
    iconColor: 'bg-indigo-100 text-indigo-700',
    dataColumns: ['Fecha', 'Evento', 'Tipo', 'Estado'],
  },
];

export function AdminReports() {
  const { report } = useServices();
  const [counts, setCounts] = useState<ReportSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const summary = await report.getSummary();
      setCounts(summary);
    } catch {
      toast.error('Error al cargar resumen de reportes');
      setCounts(null);
    } finally {
      setIsLoading(false);
    }
  }, [report]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const getRowCount = (id: string): number => {
    if (!counts) return 0;
    switch (id) {
      case 'properties':
        return counts.properties;
      case 'contracts':
        return counts.contracts;
      case 'payments':
        return counts.payments;
      case 'users':
        return counts.users;
      case 'income':
        return counts.income;
      case 'calendar':
        return counts.calendar;
      default:
        return 0;
    }
  };

  const downloadReport = async (reportId: string) => {
    toast.info('Generando reporte…');
    try {
      await report.downloadReport(reportId);
      toast.success('Reporte descargado');
    } catch {
      toast.error('Error al descargar el reporte');
    }
  };

  const regenerateReport = async (_reportId: string) => {
    toast.info('Actualizando resumen…');
    try {
      await fetchSummary();
      toast.success('Resumen actualizado');
    } catch {
      toast.error('Error al actualizar resumen');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Reportes" subtitle="Genera y descarga reportes del sistema" size="md" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {REPORT_META.map((reportMeta) => {
          const Icon = reportMeta.icon;
          return (
            <div
              key={reportMeta.id}
              className="bg-card rounded-lg shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`${reportMeta.iconColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground">{reportMeta.name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{reportMeta.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span>{getRowCount(reportMeta.id)} registros</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted border-t border-border">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground truncate max-w-[45%]">
                    Columnas: {reportMeta.dataColumns.join(', ')}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => regenerateReport(reportMeta.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      Regenerar
                    </button>

                    <button
                      onClick={() => downloadReport(reportMeta.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary-muted text-primary-muted-foreground rounded-lg hover:bg-primary-muted transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Descargar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
