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
    iconColor: 'bg-blue-100 text-blue-700',
    dataColumns: ['ID', 'Nombre', 'Dirección', 'Tipo', 'Estado', 'Precio'],
  },
  {
    id: 'contracts',
    name: 'Reporte de Contratos',
    description: 'Estado y fechas de todos los contratos activos',
    icon: FileText,
    iconColor: 'bg-purple-100 text-purple-700',
    dataColumns: ['ID', 'Propiedad', 'Inquilino', 'Arrendador', 'Fecha Inicio', 'Fecha Fin'],
  },
  {
    id: 'payments',
    name: 'Reporte de Pagos',
    description: 'Historial completo de pagos y estados',
    icon: DollarSign,
    iconColor: 'bg-green-100 text-green-700',
    dataColumns: ['ID', 'Contrato', 'Monto', 'Estado', 'Fecha'],
  },
  {
    id: 'users',
    name: 'Reporte de Usuarios',
    description: 'Lista de todos los usuarios del sistema',
    icon: Users,
    iconColor: 'bg-red-100 text-red-700',
    dataColumns: ['ID', 'Nombre', 'Rol', 'Estado', 'Último Login'],
  },
  {
    id: 'income',
    name: 'Reporte de Ingresos',
    description: 'Resumen financiero y análisis de ingresos',
    icon: TrendingUp,
    iconColor: 'bg-yellow-100 text-yellow-700',
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`${reportMeta.iconColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{reportMeta.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{reportMeta.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>{getRowCount(reportMeta.id)} registros</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-gray-600 truncate max-w-[45%]">
                    Columnas: {reportMeta.dataColumns.join(', ')}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => regenerateReport(reportMeta.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      Regenerar
                    </button>

                    <button
                      onClick={() => downloadReport(reportMeta.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
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
