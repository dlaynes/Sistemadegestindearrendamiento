import { useState } from 'react';
import { DollarSign, CheckCircle, Clock, AlertCircle, Calendar, TrendingUp } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';

const mockPayments = [
  {
    id: 1,
    contractId: 1,
    tenant: 'Juan Pérez',
    property: 'Apartamento Centro #101',
    amount: '3200',
    dueDate: '2026-03-05',
    paidDate: '2026-03-04',
    status: 'pagado',
    method: 'transferencia',
  },
  {
    id: 2,
    contractId: 2,
    tenant: 'Ana Martínez',
    property: 'Casa Residencial #102',
    amount: '4500',
    dueDate: '2026-03-15',
    paidDate: '2026-03-14',
    status: 'pagado',
    method: 'efectivo',
  },
  {
    id: 3,
    contractId: 3,
    tenant: 'María García',
    property: 'Apartamento Vista Mar #103',
    amount: '2800',
    dueDate: '2026-03-20',
    
    status: 'vencido',
    method: 'transferencia',
  },
  {
    id: 4,
    contractId: 4,
    tenant: 'Laura Gómez',
    property: 'Casa Familiar #201',
    amount: '5500',
    dueDate: '2026-04-10',
    
    status: 'pendiente',
    method: 'transferencia',
  },
  {
    id: 5,
    contractId: 5,
    tenant: 'Roberto Silva',
    property: 'Estudio Moderno #104',
    amount: '2200',
    dueDate: '2026-04-08',
    
    status: 'pendiente',
    method: 'transferencia',
  },
  {
    id: 6,
    contractId: 6,
    tenant: 'Carlos López',
    property: 'Loft Industrial #205',
    amount: '3800',
    dueDate: '2026-04-05',
    
    status: 'pendiente',
    method: 'transferencia',
  },
];

export function ArrendadorPayments() {
  const navigate = useRoleNavigation();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pagado' | 'pendiente' | 'vencido'>('all');

  const filteredPayments = mockPayments.filter((payment) => {
    return statusFilter === 'all' || payment.status === statusFilter;
  });

  const totalPaid = mockPayments.filter(p => p.status === 'pagado').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPending = mockPayments.filter(p => p.status === 'pendiente').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalOverdue = mockPayments.filter(p => p.status === 'vencido').reduce((sum, p) => sum + Number(p.amount), 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pagado':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pendiente':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'vencido':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pagado':
        return 'bg-green-100 text-green-700';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700';
      case 'vencido':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pagado':
        return 'Pagado';
      case 'pendiente':
        return 'Pendiente';
      case 'vencido':
        return 'Vencido';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Pagos</h1>
        <p className="text-gray-600 mt-1">Gestiona y monitorea los pagos de renta</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pagos Recibidos</p>
              <p className="text-2xl font-semibold text-gray-900">${totalPaid.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span>+12% vs mes anterior</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pagos Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">${totalPending.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">3 pagos por vencer</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Pagos Vencidos</p>
              <p className="text-2xl font-semibold text-gray-900">${totalOverdue.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">1 pago requiere atención</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">Filtrar por estado:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('pagado')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'pagado'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pagados
            </button>
            <button
              onClick={() => setStatusFilter('pendiente')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'pendiente'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setStatusFilter('vencido')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'vencido'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vencidos
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Inquilino
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Propiedad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Fecha de Vencimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Fecha de Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{payment.tenant}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600">{payment.property}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">${Number(payment.amount).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{payment.dueDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-600">
                      {payment.paidDate || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm" onClick={() => navigate(`/pagos/${payment.id}`)}>
                      Ver Pago
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPayments.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No se encontraron pagos</h3>
          <p className="text-gray-600">Intenta ajustar los filtros</p>
        </div>
      )}
    </div>
  );
}