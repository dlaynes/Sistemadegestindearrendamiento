import { useParams } from 'react-router';
import { toast } from 'sonner';
import {
  DollarSign,
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
import { BackButton } from '../shared/ui/back-button';
import { EmptyState } from '../shared/ui/empty-state';

export function ArrendadorPaymentDetail() {
  const { getPaymentById } = usePayment();
  const { id } = useParams();
  const navigate = useRoleNavigation();

  const payment = id ? getPaymentById(id) : undefined;

  if (!payment) {
    return (
      <div className="space-y-6">
        <BackButton onClick={() => navigate('/pagos')} label="Volver a pagos" />
        <EmptyState
          icon={DollarSign}
          title="Pago no encontrado"
          description="El pago que buscas no existe o fue eliminado."
          action={{
            label: 'Volver a Pagos',
            onClick: () => navigate('/pagos'),
          }}
        />
      </div>
    );
  }

  const getStatusIcon = () => {
    switch (payment.status) {
      case 'pagado':
        return <CheckCircle className="w-8 h-8 text-success" />;
      case 'pendiente':
        return <Clock className="w-8 h-8 text-warning" />;
      case 'vencido':
        return <AlertCircle className="w-8 h-8 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (payment.status) {
      case 'pagado':
        return 'bg-success-muted text-success-muted-foreground';
      case 'pendiente':
        return 'bg-warning-muted text-warning-muted-foreground';
      case 'vencido':
        return 'bg-destructive-muted text-destructive-muted-foreground';
      default:
        return 'bg-muted text-foreground';
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
      <BackButton onClick={() => navigate('/pagos')} label="Volver a pagos" />

      {/* Header */}
      <div className="bg-card rounded-xl border border-border-subtle shadow-elev-xs p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-4 rounded-lg ${
                payment.status === 'pagado'
                  ? 'bg-success-muted'
                  : payment.status === 'pendiente'
                  ? 'bg-warning-muted'
                  : 'bg-destructive-muted'
              }`}
            >
              {getStatusIcon()}
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Pago #{String(payment.id).padStart(5, '0')}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-5 h-5" />
                <span>Vencimiento: {payment.dueDate}</span>
              </div>
              {payment.paidDate && (
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
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
          <div className="p-4 bg-destructive-muted border border-destructive-muted rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <div className="flex-1">
              <p className="font-semibold text-destructive-muted-foreground">Pago vencido</p>
              <p className="text-sm text-destructive-muted-foreground">
                Este pago venció hace {getDaysOverdue()} días. Se están
                acumulando cargos por mora.
              </p>
            </div>
            <button
              onClick={registrarPago}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive-muted transition-colors font-medium whitespace-nowrap"
            >
              Registrar Pago
            </button>
          </div>
        )}

        {payment.status === 'pendiente' && (
          <div className="p-4 bg-warning-muted border border-warning rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-warning" />
            <div className="flex-1">
              <p className="font-semibold text-warning-muted-foreground">Pago pendiente</p>
              <p className="text-sm text-warning-muted-foreground">
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
          <div className="bg-card rounded-xl border border-border-subtle shadow-elev-xs p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Detalles del Pago
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Inquilino</p>
                <p className="text-lg font-semibold text-foreground">
                  {payment.tenantName || 'No especificado'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Propiedad</p>
                <p className="text-lg font-semibold text-foreground">
                  {payment.property || 'No especificada'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Dirección</p>
                <p className="text-lg font-semibold text-foreground">
                  {payment.propertyAddress || 'No especificada'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monto base</p>
                <p className="text-lg font-semibold text-foreground">
                  ${Number(payment.amount).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Método de pago</p>
                <p className="text-lg font-semibold text-foreground">
                  {payment.method === 'transferencia' && 'Transferencia'}
                  {payment.method === 'cheque' && 'Cheque'}
                  {payment.method === 'tarjeta' && 'Tarjeta'}
                  {payment.method === 'efectivo' && 'Efectivo'}
                  {payment.method === 'digital' && 'Digital'}
                  {!payment.method && 'No especificado'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estado</p>
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
            <div className="bg-card rounded-xl border border-border-subtle shadow-elev-xs p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Desglose
              </h2>
              <div className="space-y-3">
                {payment.breakdown.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-muted rounded-lg"
                  >
                    <span className="text-foreground">{item.concept}</span>
                    <span className="font-semibold text-foreground">
                      ${item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center p-3 bg-primary-muted rounded-lg border-t-2 border-primary-muted">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-primary">
                    ${totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Payment History */}
          {payment.relatedPayments && payment.relatedPayments.length > 0 && (
            <div className="bg-card rounded-xl border border-border-subtle shadow-elev-xs p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Historial de Pagos Relacionados
              </h2>
              <div className="space-y-3">
                {payment.relatedPayments.map((related, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {related.status === 'pagado' && (
                        <CheckCircle className="w-5 h-5 text-success" />
                      )}
                      {related.status === 'pendiente' && (
                        <Clock className="w-5 h-5 text-warning" />
                      )}
                      {related.status === 'vencido' && (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">{related.month}</p>
                        <p className="text-sm text-muted-foreground">{related.date}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        related.status === 'pagado'
                          ? 'bg-success-muted text-success-muted-foreground'
                          : related.status === 'pendiente'
                          ? 'bg-warning-muted text-warning-muted-foreground'
                          : related.status === 'vencido'
                          ? 'bg-destructive-muted text-destructive-muted-foreground'
                          : 'bg-muted text-foreground'
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
          <div className="bg-card rounded-xl border border-border-subtle shadow-elev-xs p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Resumen</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Inquilino</p>
                <p className="text-lg font-semibold text-foreground">
                  {payment.tenantName || 'No especificado'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monto base</p>
                <p className="text-lg font-semibold text-foreground">
                  ${Number(payment.amount).toLocaleString()}
                </p>
              </div>
              {payment.status === 'vencido' && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Mora acumulada</p>
                    <p className="text-lg font-semibold text-destructive">
                      ${(totalAmount - Number(payment.amount)).toLocaleString()}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">Total a pagar</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${totalAmount.toLocaleString()}
                    </p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estado</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
                >
                  {getStatusLabel()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-card rounded-xl border border-border-subtle shadow-elev-xs p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Acciones</h2>
            <div className="space-y-2">
              {payment.status === 'pagado' ? (
                <>
                  <button
                    onClick={onViewReceipt}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary-hover transition-colors font-medium"
                  >
                    <Receipt className="w-4 h-4" />
                    Ver Recibo
                  </button>
                  <button
                    onClick={onDownloadPDF}
                    className="w-full flex items-center justify-center gap-2 bg-muted text-foreground py-2 rounded-lg hover:bg-muted transition-colors font-medium"
                  >
                    <Download className="w-4 h-4" />
                    Descargar PDF
                  </button>
                  <button
                    onClick={onSendReceipt}
                    className="w-full bg-muted text-foreground py-2 rounded-lg hover:bg-muted transition-colors font-medium"
                  >
                    Enviar Recibo
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={registrarPago}
                    className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary-hover transition-colors font-medium"
                  >
                    Registrar Pago
                  </button>
                  <button
                    onClick={onSendReminder}
                    className="w-full bg-muted text-foreground py-2 rounded-lg hover:bg-muted transition-colors font-medium"
                  >
                    Enviar Recordatorio
                  </button>
                  <button
                    onClick={onAdjustAmount}
                    className="w-full bg-muted text-foreground py-2 rounded-lg hover:bg-muted transition-colors font-medium"
                  >
                    Ajustar Monto
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Payment Stats */}
          <div className="bg-card rounded-xl border border-border-subtle shadow-elev-xs p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Estadísticas</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pagos a tiempo</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-foreground">
                    {relatedCount} / {relatedCount}
                  </p>
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div
                    className="bg-success h-2 rounded-full"
                    style={{ width: relatedCount > 0 ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total pagado este año</p>
                <p className="text-lg font-semibold text-foreground">
                  ${totalPaidThisYear.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          {payment.status === 'pagado' && (
            <div className="bg-card rounded-xl border border-border-subtle shadow-elev-xs p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Documentos</h2>
              <div className="space-y-2">
                <button
                  onClick={onViewReceipt}
                  className="w-full flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">Recibo de pago</p>
                    <p className="text-xs text-muted-foreground">PDF</p>
                  </div>
                </button>
                {payment.referenceNumber && (
                  <button
                    onClick={onViewReceipt}
                    className="w-full flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">Comprobante bancario</p>
                      <p className="text-xs text-muted-foreground">
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
