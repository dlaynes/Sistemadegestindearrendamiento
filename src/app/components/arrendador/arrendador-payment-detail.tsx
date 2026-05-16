import { useParams } from 'react-router';
import { toast } from 'sonner';
import {
  DollarSign,
  ArrowLeft,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  Receipt,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { usePayment } from '../../contexts/payment-context';

export function ArrendadorPaymentDetail() {
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
    const today = new Date();
    const due = new Date(payment.dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const totalAmount =
    payment.breakdown?.reduce((sum, item) => sum + item.amount, 0) ??
    Number(payment.amount);

  const relatedCount = payment.relatedPayments?.length ?? 0;
  const totalPaidThisYear = relatedCount * Number(payment.amount);

  const registrarPago = () =>
    navigate(`/contratos/${payment.contractId}/pagos/nuevo`);
  const onViewReceipt = () => toast.info('Visualización de recibo próximamente');
  const onDownloadPDF = () => toast.info('Descarga de recibo próximamente');
  const onSendReceipt = () => toast.info('Envío de recibo próximamente');
  const onSendReminder = () => toast.info('Envío de recordatorio próximamente');
  const onAdjustAmount = () => toast.info('Ajuste de monto próximamente');

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
            <div
              className={`p-4 rounded-lg ${
                payment.status === 'pagado'
                  ? 'bg-green-100'
                  : payment.status === 'pendiente'
                  ? 'bg-yellow-100'
                  : 'bg-red-100'
              }`}
            >
              {getStatusIcon()}
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Pago #{String(payment.id).padStart(5, '0')}
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
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor()}`}
          >
            {getStatusLabel()}
          </span>
        </div>

        {payment.status === 'vencido' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="flex-1">
              <p className="font-semibold text-red-800">Pago vencido</p>
              <p className="text-sm text-red-700">
                Este pago venció hace {getDaysOverdue()} días. Se están
                acumulando cargos por mora.
              </p>
            </div>
            <button
              onClick={registrarPago}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium whitespace-nowrap"
            >
              Registrar Pago
            </button>
          </div>
        )}

        {payment.status === 'pendiente' && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div className="flex-1">
              <p className="font-semibold text-yellow-800">Pago pendiente</p>
              <p className="text-sm text-yellow-700">
                Este pago está pendiente. Se enviará un recordatorio al
                inquilino.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Detalles del Pago
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Inquilino</p>
                <p className="text-lg font-semibold text-gray-900">
                  {payment.tenantName || 'No especificado'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Propiedad</p>
                <p className="text-lg font-semibold text-gray-900">
                  {payment.property || 'No especificada'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Dirección</p>
                <p className="text-lg font-semibold text-gray-900">
                  {payment.propertyAddress || 'No especificada'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Monto base</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${Number(payment.amount).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Método de pago</p>
                <p className="text-lg font-semibold text-gray-900">
                  {payment.method === 'transferencia' && 'Transferencia'}
                  {payment.method === 'cheque' && 'Cheque'}
                  {payment.method === 'tarjeta' && 'Tarjeta'}
                  {payment.method === 'efectivo' && 'Efectivo'}
                  {payment.method === 'digital' && 'Digital'}
                  {!payment.method && 'No especificado'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Estado</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
                >
                  {getStatusLabel()}
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          {payment.breakdown && payment.breakdown.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Desglose
              </h2>
              <div className="space-y-3">
                {payment.breakdown.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700">{item.concept}</span>
                    <span className="font-semibold text-gray-900">
                      ${item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-t-2 border-blue-100">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-blue-600">
                    ${totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Payment History */}
          {payment.relatedPayments && payment.relatedPayments.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Historial de Pagos Relacionados
              </h2>
              <div className="space-y-3">
                {payment.relatedPayments.map((related, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {related.status === 'pagado' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {related.status === 'pendiente' && (
                        <Clock className="w-5 h-5 text-yellow-600" />
                      )}
                      {related.status === 'vencido' && (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{related.month}</p>
                        <p className="text-sm text-gray-600">{related.date}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        related.status === 'pagado'
                          ? 'bg-green-100 text-green-700'
                          : related.status === 'pendiente'
                          ? 'bg-yellow-100 text-yellow-700'
                          : related.status === 'vencido'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {related.status === 'pagado'
                        ? 'Pagado'
                        : related.status === 'pendiente'
                        ? 'Pendiente'
                        : related.status === 'vencido'
                        ? 'Vencido'
                        : related.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Inquilino</p>
                <p className="text-lg font-semibold text-gray-900">
                  {payment.tenantName || 'No especificado'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Monto base</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${Number(payment.amount).toLocaleString()}
                </p>
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
                    <p className="text-2xl font-bold text-gray-900">
                      ${totalAmount.toLocaleString()}
                    </p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Estado</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
                >
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
                  <button
                    onClick={onViewReceipt}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Receipt className="w-4 h-4" />
                    Ver Recibo
                  </button>
                  <button
                    onClick={onDownloadPDF}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Descargar PDF
                  </button>
                  <button
                    onClick={onSendReceipt}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Enviar Recibo
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={registrarPago}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Registrar Pago
                  </button>
                  <button
                    onClick={onSendReminder}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Enviar Recordatorio
                  </button>
                  <button
                    onClick={onAdjustAmount}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
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
                    {relatedCount} / {relatedCount}
                  </p>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: relatedCount > 0 ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total pagado este año</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${totalPaidThisYear.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          {payment.status === 'pagado' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Documentos</h2>
              <div className="space-y-2">
                <button
                  onClick={onViewReceipt}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                >
                  <FileText className="w-5 h-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">Recibo de pago</p>
                    <p className="text-xs text-gray-600">PDF</p>
                  </div>
                </button>
                {payment.referenceNumber && (
                  <button
                    onClick={onViewReceipt}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <FileText className="w-5 h-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Comprobante bancario</p>
                      <p className="text-xs text-gray-600">
                        Referencia: {payment.referenceNumber}
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
