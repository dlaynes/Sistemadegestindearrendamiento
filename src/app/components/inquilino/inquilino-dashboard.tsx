import { Home, FileText, DollarSign, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { PageHeader, StatusBadge } from '../shared';
import { useDashboard } from '../../contexts/dashboard-context';

export function InquilinoDashboard() {
  const { stats, isLoading, upcomingPayments, myProperties, myPayments } = useDashboard();

  const nextPayment = upcomingPayments[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard - Inquilino"
        subtitle="Información de tu arrendamiento"
      />

      {/* Notificaciones */}
      {nextPayment && (
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-yellow-600" />
            <p className="text-sm font-medium text-yellow-800">
              Tu próximo pago de {nextPayment.amount} vence el {nextPayment.dueDate}
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-500">
              <Home className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{myProperties.length}</h3>
          <p className="text-sm text-gray-600 mb-2">Mi Propiedad</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-purple-500">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.activeContracts}</h3>
          <p className="text-sm text-gray-600 mb-2">Contrato Activo</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-500">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">${stats.totalIncome.toLocaleString()}</h3>
          <p className="text-sm text-gray-600 mb-2">Total Pagado</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{stats.pendingPayments}</h3>
          <p className="text-sm text-gray-600 mb-2">Pagos Pendientes</p>
        </div>
      </div>

      {/* Historial de Pagos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Historial de Pagos</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {myPayments.length > 0 ? (
            myPayments.map((payment) => {
              const statusIcon =
                payment.status === 'pagado' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : payment.status === 'pendiente' ? (
                  <Clock className="w-5 h-5 text-yellow-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                );
              return (
                <div
                  key={payment.id}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {statusIcon}
                    <div>
                      <p className="font-medium text-gray-900">{payment.property || 'Propiedad'}</p>
                      <p className="text-sm text-gray-500">{payment.dueDate}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${Number(payment.amount).toLocaleString()}</p>
                    <StatusBadge status={payment.status} type="payment" size="sm" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-500">No hay pagos registrados</div>
          )}
        </div>
      </div>
    </div>
  );
}
