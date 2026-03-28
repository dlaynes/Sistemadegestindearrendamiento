import { Building2, FileText, DollarSign, Users, TrendingUp, AlertCircle } from 'lucide-react';

const stats = [
  { name: 'Propiedades Activas', value: '12', icon: Building2, color: 'bg-blue-500' },
  { name: 'Contratos Vigentes', value: '8', icon: FileText, color: 'bg-green-500' },
  { name: 'Ingresos del Mes', value: '$24,500', icon: DollarSign, color: 'bg-purple-500' },
  { name: 'Inquilinos', value: '15', icon: Users, color: 'bg-orange-500' },
];

const recentActivities = [
  { id: 1, type: 'payment', message: 'Pago recibido de Juan Pérez - Prop. #101', time: 'Hace 2 horas', status: 'success' },
  { id: 2, type: 'contract', message: 'Nuevo contrato firmado - Prop. #205', time: 'Hace 5 horas', status: 'success' },
  { id: 3, type: 'alert', message: 'Pago pendiente de María García - Prop. #103', time: 'Hace 1 día', status: 'warning' },
  { id: 4, type: 'message', message: 'Nuevo mensaje de Carlos López', time: 'Hace 2 días', status: 'info' },
];

const upcomingPayments = [
  { id: 1, tenant: 'Ana Martínez', property: 'Prop. #102', amount: '$3,200', dueDate: '2026-04-05' },
  { id: 2, tenant: 'Roberto Silva', property: 'Prop. #104', amount: '$2,800', dueDate: '2026-04-08' },
  { id: 3, tenant: 'Laura Gómez', property: 'Prop. #201', amount: '$4,100', dueDate: '2026-04-10' },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Resumen general de tu sistema de arrendamiento</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.name}</p>
                  <p className="text-3xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Actividad Reciente</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`mt-1 w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Próximos Pagos</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">{payment.tenant}</p>
                    <p className="text-sm text-gray-500">{payment.property}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{payment.amount}</p>
                    <p className="text-sm text-gray-500">{payment.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-gray-900">Rendimiento del Mes</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-600 text-sm">Tasa de Ocupación</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-semibold text-gray-900">66.7%</p>
              <span className="text-sm text-green-600">+5%</span>
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Pagos a Tiempo</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-semibold text-gray-900">87.5%</p>
              <span className="text-sm text-green-600">+2%</span>
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Contratos por Renovar</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-semibold text-gray-900">3</p>
              <span className="text-sm text-gray-500">próximos 30 días</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
