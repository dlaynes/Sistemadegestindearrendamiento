import { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { PageHeader } from '../shared/dashboard/page-header';
import { usePayment } from "../../contexts/payment-context";

export function InquilinoPayments() {
  const { getMyPayments, isLoading } = usePayment();
  const navigate = useRoleNavigation();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pagado' | 'pendiente' | 'vencido'>('all');

  const myPayments = getMyPayments();

  const filteredPayments = myPayments.filter((payment) => {
    return statusFilter === 'all' || payment.status === statusFilter;
  });

  const totalPaid = myPayments.filter(p => p.status === 'pagado').reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPending = myPayments.filter(p => p.status === 'pendiente').reduce((sum, p) => sum + Number(p.amount), 0);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Mis Pagos" subtitle="Historial de pagos de renta" />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Total Pagado</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-yellow-100">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">Pendiente</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${totalPending.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pagado', 'pendiente', 'vencido'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {status === 'all' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Propiedad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{payment.property}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${Number(payment.amount).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      <span className="mr-1">{getStatusIcon(payment.status)}</span>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      {payment.dueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/pagos/${payment.id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
