import { Building2, FileText, DollarSign, Users, Calendar, MapPin } from 'lucide-react';
import { StatsCard, PageHeader, StatusBadge } from '../shared';

export function ArrendadorDashboard() {
  const stats = [
    { label: 'Mis Propiedades', value: '8', icon: Building2, color: 'bg-blue-500', change: '+1 este mes' },
    { label: 'Contratos Activos', value: '6', icon: FileText, color: 'bg-purple-500', change: '2 por renovar' },
    { label: 'Ingresos del Mes', value: '$12,400', icon: DollarSign, color: 'bg-green-500', change: '+8% vs mes anterior' },
    { label: 'Inquilinos Activos', value: '6', icon: Users, color: 'bg-yellow-500', change: 'Todos al día' },
  ];

  const properties = [
    { name: 'Apartamento Centro', address: 'Calle Principal 123', status: 'ocupado' as const, rent: '$1,200', tenant: 'Juan Pérez' },
    { name: 'Casa Residencial', address: 'Av. Los Pinos 456', status: 'ocupado' as const, rent: '$2,500', tenant: 'María García' },
    { name: 'Estudio Norte', address: 'Calle 8 #89', status: 'disponible' as const, rent: '$800', tenant: '-' },
  ];

  const upcomingPayments = [
    { tenant: 'Juan Pérez', property: 'Apartamento Centro', amount: '$1,200', dueDate: '2026-04-05', status: 'pendiente' },
    { tenant: 'María García', property: 'Casa Residencial', amount: '$2,500', dueDate: '2026-04-08', status: 'pendiente' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard - Arrendador" 
        subtitle="Gestiona tus propiedades y contratos" 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            change={stat.change}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mis Propiedades */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Mis Propiedades</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {properties.map((property, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{property.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {property.address}
                    </div>
                  </div>
                  <StatusBadge status={property.status} type="property" />
                </div>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="text-gray-600">
                    Renta: <span className="font-semibold text-gray-900">{property.rent}</span>
                  </span>
                  <span className="text-gray-600">
                    Inquilino: <span className="font-semibold text-gray-900">{property.tenant}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Próximos Pagos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Próximos Pagos Esperados</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingPayments.map((payment, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{payment.tenant}</h3>
                    <p className="text-sm text-gray-600">{payment.property}</p>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{payment.amount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Vence: {payment.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
