import { Users, Building2, FileText, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    { label: 'Total Propiedades', value: '24', icon: Building2, color: 'bg-blue-500', change: '+3 este mes' },
    { label: 'Total Contratos', value: '18', icon: FileText, color: 'bg-purple-500', change: '+2 este mes' },
    { label: 'Total Usuarios', value: '42', icon: Users, color: 'bg-green-500', change: '+5 este mes' },
    { label: 'Ingresos Totales', value: '$48,500', icon: DollarSign, color: 'bg-yellow-500', change: '+12% este mes' },
  ];

  const recentActivity = [
    { type: 'Nuevo contrato', description: 'Contrato firmado para Propiedad #5', time: 'Hace 2 horas', status: 'success' },
    { type: 'Pago recibido', description: 'Pago de $1,200 procesado', time: 'Hace 4 horas', status: 'success' },
    { type: 'Nueva propiedad', description: 'Apartamento en Centro agregado', time: 'Hace 1 día', status: 'info' },
    { type: 'Pago pendiente', description: 'Contrato #CT-004 vence mañana', time: 'Hace 1 día', status: 'warning' },
  ];

  const alerts = [
    { message: '3 contratos vencen en los próximos 30 días', type: 'warning' },
    { message: '2 pagos pendientes requieren atención', type: 'error' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard - Administrador</h1>
        <p className="text-gray-600 mt-2">Vista general del sistema de gestión</p>
      </div>

      {/* Alertas */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg ${
                alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                alert.type === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }`} />
              <p className={`text-sm font-medium ${
                alert.type === 'warning' ? 'text-yellow-800' : 'text-red-800'
              }`}>
                {alert.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
            <p className="text-xs text-green-600 font-medium">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Actividad Reciente</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <h3 className="font-semibold text-gray-900">{activity.type}</h3>
                  </div>
                  <p className="text-sm text-gray-600 ml-5">{activity.description}</p>
                </div>
                <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
