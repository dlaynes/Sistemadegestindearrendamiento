import { useParams } from 'react-router';
import { 
  DollarSign,
  ArrowLeft,
  User,
  Building2,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  CreditCard,
  Receipt,
  FileText,
  TrendingUp
} from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { usePayment } from "../../contexts/payment-context";


export function AdminPaymentDetail() {
  const { getPaymentById } = usePayment();
  const { id } = useParams();
  const navigate = useRoleNavigation();
  
  const payment = id ? getPaymentById(id) : undefined;

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <DollarSign className="w-16 h-16 text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-900">Pago no encontrado</h2>
        <button
          onClick={() => navigate('/pagos')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (payment.status) {
      case 'pagado':
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case 'pendiente':
        return <Clock className="w-8 h-8 text-yellow-600" />;
      case 'vencido':
        return <AlertCircle className="w-8 h-8 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (payment.status) {
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

  const getStatusLabel = () => {
    switch (payment.status) {
      case 'pagado':
        return 'Pagado';
      case 'pendiente':
        return 'Pendiente';
      case 'vencido':
        return 'Vencido';
      default:
        return payment.status;
    }
  };

  const getDaysOverdue = () => {
    if (payment.status !== 'vencido') return 0;
    const today = new Date('2026-03-31');
    const due = new Date(payment.dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalAmount = payment.breakdown?.reduce((sum, item) => sum + item.amount, 0) ?? 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/pagos')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Volver a pagos</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className={`p-4 rounded-lg ${
              payment.status === 'pagado' ? 'bg-green-100' :
              payment.status === 'pendiente' ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              {getStatusIcon()}
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Pago #{payment.id.toString().padStart(5, '0')}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>Vencimiento: {payment.dueDate}</span>
              </div>
              {payment.paidDate && (
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <CheckCircle className="w-5 h-5" />
                  <span>Pagado el: {payment.paidDate}</span>
                </div>
              )}
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {getStatusLabel()}
          </span>
        </div>

        {payment.status === 'vencido' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold text-red-800">Pago vencido</p>
              <p className="text-sm text-red-700">
                Este pago venció hace {getDaysOverdue()} días. Se están acumulando cargos por mora.
              </p>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium whitespace-nowrap">
              Registrar Pago
            </button>
          </div>
        )}

        {payment.status === 'pendiente' && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-800">Pago pendiente</p>
              <p className="text-sm text-yellow-700">
                Este pago vence el {payment.dueDate}.
              </p>
            </div>
            <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors font-medium whitespace-nowrap">
              Registrar Pago
            </button>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parties Involved */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Pago</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tenant */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Inquilino</h3>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{payment.tenant}</p>
                  <p className="text-sm text-gray-600">{payment.tenantEmail}</p>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Ver perfil →
                  </button>
                </div>
              </div>

              {/* Property */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Propiedad</h3>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{payment.property}</p>
                  <p className="text-sm text-gray-600">{payment.propertyAddress}</p>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Ver detalles →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Desglose del Pago</h2>
            <div className="space-y-3">
              {payment.breakdown?.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                  <span className="text-gray-700">{item.concept}</span>
                  <span className="font-semibold text-gray-900">${item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-3 bg-blue-50 rounded-lg px-4 mt-4">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">${totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          {payment.status === 'pagado' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles del Pago</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Método de pago</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <p className="font-semibold text-gray-900">{payment.method}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Número de referencia</p>
                  <p className="font-semibold text-gray-900">{payment.referenceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fecha de vencimiento</p>
                  <p className="font-semibold text-gray-900">{payment.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fecha de pago</p>
                  <p className="font-semibold text-gray-900">{payment.paidDate}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notas</h2>
            <p className="text-gray-700">{payment.notes}</p>
          </div>

          {/* Related Payments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial de Pagos Relacionados</h2>
            <div className="space-y-3">
              {payment.relatedPayments?.map((related, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{related.month}</p>
                      <p className="text-sm text-gray-600">Pagado el {related.date}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Pagado
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Amount Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Monto original</p>
                <p className="text-2xl font-bold text-gray-900">${Number(payment.amount).toLocaleString()}</p>
              </div>
              {payment.status === 'vencido' && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Mora acumulada</p>
                    <p className="text-lg font-semibold text-red-600">
                      ${(totalAmount - Number(payment.amount)).toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Total a pagar</p>
                    <p className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Estado</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                  {getStatusLabel()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones</h2>
            <div className="space-y-2">
              {payment.status === 'pagado' ? (
                <>
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <Receipt className="w-4 h-4" />
                    Ver Recibo
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    <Download className="w-4 h-4" />
                    Descargar PDF
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Enviar Recibo
                  </button>
                </>
              ) : (
                <>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Registrar Pago
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Enviar Recordatorio
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                    Ajustar Monto
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Payment Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Estadísticas</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pagos a tiempo</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-gray-900">
                    {payment.relatedPayments?.length || 0} / {payment.relatedPayments?.length || 0}
                  </p>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total pagado este año</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${(payment.relatedPayments?.length || 0 * Number(payment.amount)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          {payment.status === 'pagado' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Documentos</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Recibo de pago</p>
                    <p className="text-xs text-gray-600">PDF - 124 KB</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Comprobante bancario</p>
                    <p className="text-xs text-gray-600">PDF - 89 KB</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
