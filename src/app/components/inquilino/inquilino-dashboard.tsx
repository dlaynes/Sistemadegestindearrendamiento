import { Home, FileText, DollarSign, Calendar, MessageSquare, AlertCircle } from 'lucide-react';

export function InquilinoDashboard() {
  const myProperty = {
    name: 'Apartamento Centro',
    address: 'Calle Principal 123, Piso 4, Apt 401',
    landlord: 'Carlos Rodríguez',
    rent: '$1,200',
    nextPayment: '2026-04-05',
    contractEnd: '2027-03-15',
  };

  const paymentHistory = [
    { month: 'Marzo 2026', amount: '$1,200', date: '2026-03-05', status: 'paid' },
    { month: 'Febrero 2026', amount: '$1,200', date: '2026-02-05', status: 'paid' },
    { month: 'Enero 2026', amount: '$1,200', date: '2026-01-05', status: 'paid' },
  ];

  const notifications = [
    { message: 'Tu próximo pago vence el 5 de Abril', type: 'warning', icon: AlertCircle },
    { message: 'Nuevo mensaje del arrendador', type: 'info', icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard - Inquilino</h1>
        <p className="text-gray-600 mt-2">Información de tu arrendamiento</p>
      </div>

      {/* Notificaciones */}
      {notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 p-4 rounded-lg ${
                notification.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : 'bg-blue-50 border border-blue-200'
              }`}
            >
              <notification.icon className={`w-5 h-5 flex-shrink-0 ${
                notification.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
              }`} />
              <p className={`text-sm font-medium ${
                notification.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
              }`}>
                {notification.message}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Mi Propiedad Actual */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Home className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Mi Propiedad</h2>
            </div>
            <h3 className="text-3xl font-bold mb-2">{myProperty.name}</h3>
            <p className="text-blue-100">{myProperty.address}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm mb-1">Renta Mensual</p>
            <p className="text-4xl font-bold">{myProperty.rent}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-blue-400">
          <div>
            <p className="text-blue-100 text-sm mb-1">Arrendador</p>
            <p className="font-semibold">{myProperty.landlord}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Próximo Pago</p>
            <p className="font-semibold">{myProperty.nextPayment}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Fin de Contrato</p>
            <p className="font-semibold">{myProperty.contractEnd}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximo Pago */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Próximo Pago</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">{myProperty.rent}</p>
          <p className="text-sm text-gray-600">Vence: {myProperty.nextPayment}</p>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Pagar Ahora
          </button>
        </div>

        {/* Mi Contrato */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Mi Contrato</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">Fecha de inicio: 15 de Marzo, 2025</p>
          <p className="text-sm text-gray-600 mb-3">Fecha de fin: {myProperty.contractEnd}</p>
          <button className="mt-4 w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Ver Detalles
          </button>
        </div>

        {/* Estado de Cuenta */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Estado de Cuenta</h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">Pagos realizados: 3</p>
          <p className="text-sm text-gray-600 mb-2">Total pagado: $3,600</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-green-700">Al día con los pagos</span>
          </div>
        </div>
      </div>

      {/* Historial de Pagos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Historial de Pagos</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {paymentHistory.map((payment, index) => (
            <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{payment.month}</h3>
                    <p className="text-sm text-gray-600">Pagado el {payment.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{payment.amount}</p>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    Pagado
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
