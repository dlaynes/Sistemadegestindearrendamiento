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

export function AdminReports() {
  const reports = [
    {
      id: 'properties',
      name: 'Reporte de Propiedades',
      description: 'Información detallada de todas las propiedades del sistema',
      icon: Building2,
      iconColor: 'bg-blue-100 text-blue-700',
      dataColumns: ['ID', 'Nombre', 'Dirección', 'Tipo', 'Estado', 'Precio'],
      dataRows: 24,
    },
    {
      id: 'contracts',
      name: 'Reporte de Contratos',
      description: 'Estado y fechas de todos los contratos activos',
      icon: FileText,
      iconColor: 'bg-purple-100 text-purple-700',
      dataColumns: ['ID', 'Propiedad', 'Inquilino', 'Arrendador', 'Fecha Inicio', 'Fecha Fin'],
      dataRows: 18,
    },
    {
      id: 'payments',
      name: 'Reporte de Pagos',
      description: 'Historial completo de pagos y estados',
      icon: DollarSign,
      iconColor: 'bg-green-100 text-green-700',
      dataColumns: ['ID', 'Contrato', 'Monto', 'Estado', 'Fecha'],
      dataRows: 45,
    },
    {
      id: 'users',
      name: 'Reporte de Usuarios',
      description: 'Lista de todos los usuarios del sistema',
      icon: Users,
      iconColor: 'bg-red-100 text-red-700',
      dataColumns: ['ID', 'Nombre', 'Rol', 'Estado', 'Último Login'],
      dataRows: 42,
    },
    {
      id: 'income',
      name: 'Reporte de Ingresos',
      description: 'Resumen financiero y análisis de ingresos',
      icon: TrendingUp,
      iconColor: 'bg-yellow-100 text-yellow-700',
      dataColumns: ['Mes', 'Ingresos Rentas', 'Pagos Pendientes', 'Total'],
      dataRows: 12,
    },
    {
      id: 'calendar',
      name: 'Reporte Calendario',
      description: 'Visión cronológica de eventos y fechas importantes',
      icon: Calendar,
      iconColor: 'bg-indigo-100 text-indigo-700',
      dataColumns: ['Fecha', 'Evento', 'Tipo', 'Estado'],
      dataRows: 86,
    },
  ];

  const downloadReport = (reportId: string) => {
    console.log(`Descargando reporte: ${reports.find(r => r.id === reportId)?.name}`);
    // Aquí iría la lógica de generación de PDF/Excel
  };

  const regenerateReport = (reportId: string) => {
    console.log(`Regenerando reporte: ${reports.find(r => r.id === reportId)?.name}`);
    // Aquí iría la lógica de regeneración
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader title="Reportes" subtitle="Genera y descarga reportes del sistema" size="md" />

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Report Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`${report.iconColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">{report.name}</h2>
                    <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                  </div>
                </div>

                {/* Report Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>{report.dataRows} registros</span>
                  </div>
                </div>
              </div>

              {/* Report Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-gray-600 truncate max-w-[45%]">
                    Columnas: {report.dataColumns.join(', ')}
                  </p>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => regenerateReport(report.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      Regenerar
                    </button>
                    
                    <button
                      onClick={() => downloadReport(report.id)}
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