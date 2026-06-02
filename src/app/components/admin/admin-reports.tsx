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
import { Spinner } from '../shared/ui/spinner';

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
    iconColor: 'bg-primary-muted text-primary-muted-foreground',
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
      const data = await report.getSummary();
      setCounts(data);
    } catch {
      toast.error('Error al cargar el resumen de reportes');
    } finally {
      setIsLoading(false);
    }
  }, [report]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleDownload = useCallback(
    async (reportId: string) => {
      try {
        await report.downloadReport(reportId);
        toast.success('Reporte descargado');
      } catch {
        toast.error('Error al descargar el reporte');
      }
    },
    [report],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reportes"
        subtitle="Genera y descarga reportes del sistema"
      />

      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" label="Cargando reportes" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {REPORT_META.map((meta) => (
            <div
              key={meta.id}
              className="group rounded-xl border border-border-subtle bg-card p-5 shadow-elev-xs transition-all hover:-translate-y-0.5 hover:shadow-elev-md"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ring-1 ring-inset ring-border-subtle ${meta.iconColor}`}
                >
                  <meta.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-foreground">{meta.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1 text-xs text-muted-foreground">
                {meta.dataColumns.slice(0, 4).map((col) => (
                  <span
                    key={col}
                    className="rounded-full border border-border-subtle bg-surface px-2 py-0.5"
                  >
                    {col}
                  </span>
                ))}
                {meta.dataColumns.length > 4 && (
                  <span className="rounded-full border border-border-subtle bg-surface px-2 py-0.5">
                    +{meta.dataColumns.length - 4}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDownload(meta.id)}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <Download className="h-4 w-4" />
                Descargar
              </button>
            </div>
          ))}
        </div>
      )}

      {counts && (
        <div className="rounded-xl border border-border-subtle bg-card p-6 shadow-elev-xs">
          <h2 className="mb-4 text-h2 font-semibold text-foreground">Resumen</h2>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Object.entries(counts).map(([key, value]) => (
              <div key={key} className="rounded-lg bg-surface p-3">
                <dt className="text-xs text-muted-foreground">{key}</dt>
                <dd className="mt-1 text-h3 font-semibold text-foreground">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
