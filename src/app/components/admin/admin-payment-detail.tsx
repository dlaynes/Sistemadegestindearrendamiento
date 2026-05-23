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
        <DollarSign className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold text-foreground">Pago no encontrado</h2>
        <button
          onClick={() => navigate('/pagos')}
          className="flex items-center gap-2 text-primary hover:text-primary-muted-foreground"
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
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Volver a pagos</span>
      </button>

      {/* Header */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className={`p-4 rounded-lg ${
              payment.status === 'pagado' ? 'bg-success-muted' :
              payment.status === 'pendiente' ? 'bg-warning-muted' : 'bg-destructive-muted'
            }`}>
              {getStatusIcon()}
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Pago #{payment.id.toString().padStart(5, '0')}
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
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {getStatusLabel()}
          </span>
        </div>

        {payment.status === 'vencido' && (
          <div className="p-4 bg-destructive-muted border border-destructive-muted rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <div className="flex-1">
              <p className="font-semibold text-destructive-muted-foreground">Pago vencido</p>
              <p className="text-sm text-destructive-muted-foreground">
                Este pago venció hace {getDaysOverdue()} días. Se están acumulando cargos por mora.
              </p>
            </div>
            <button className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive-muted transition-colors font-medium whitespace-nowrap">
              Registrar Pago
            </button>
          </div>
        )}

        {payment.status === 'pendiente' && (
          <div className="p-4 bg-warning-muted border border-warning rounded-lg flex items-center gap-3">
            <Clock className="w-5 h-5 text-warning" />
            <div className="flex-1">
              <p className="font-semibold text-warning-muted-foreground">Pago pendiente</p>
              <p className="text-sm text-warning-muted-foreground">
                Este pago vence el {payment.dueDate}.
              </p>
            </div>
            <button className="bg-warning text-warning-foreground px-4 py-2 rounded-lg hover:bg-warning-muted-foreground transition-colors font-medium whitespace-nowrap">
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
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Información del Pago</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tenant */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Inquilino</h3>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">{payment.tenantName}</p>
                  <p className="text-sm text-muted-foreground">{payment.tenantEmail}</p>
                  <button className="text-sm text-primary hover:text-primary-muted-foreground font-medium">
                    Ver perfil →
                  </button>
                </div>
              </div>

              {/* Property */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Propiedad</h3>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-foreground">{payment.property}</p>
                  <p className="text-sm text-muted-foreground">{payment.propertyAddress}</p>
                  <button className="text-sm text-primary hover:text-primary-muted-foreground font-medium">
                    Ver detalles →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Desglose del Pago</h2>
            <div className="space-y-3">
              {payment.breakdown?.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <span className="text-foreground">{item.concept}</span>
                  <span className="font-semibold text-foreground">${item.amount.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-3 bg-primary-muted rounded-lg px-4 mt-4">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">${totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          {payment.status === 'pagado' && (
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Detalles del Pago</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Método de pago</p>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-muted-foreground" />
                    <p className="font-semibold text-foreground">{payment.method}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Número de referencia</p>
                  <p className="font-semibold text-foreground">{payment.referenceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fecha de vencimiento</p>
                  <p className="font-semibold text-foreground">{payment.dueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fecha de pago</p>
                  <p className="font-semibold text-foreground">{payment.paidDate}</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Notas</h2>
            <p className="text-foreground">{payment.notes}</p>
          </div>

          {/* Related Payments */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Historial de Pagos Relacionados</h2>
            <div className="space-y-3">
              {payment.relatedPayments?.map((related, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <div>
                      <p className="font-medium text-foreground">{related.month}</p>
                      <p className="text-sm text-muted-foreground">Pagado el {related.date}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-success-muted text-success-muted-foreground rounded-full text-xs font-medium">
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
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Resumen</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monto original</p>
                <p className="text-2xl font-bold text-foreground">${Number(payment.amount).toLocaleString()}</p>
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
                    <p className="text-2xl font-bold text-foreground">${totalAmount.toLocaleString()}</p>
                  </div>
                </>
              )}
              <div>
                <p className="text-sm text-muted-foreground mb-1">Estado</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                  {getStatusLabel()}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Acciones</h2>
            <div className="space-y-2">
              {payment.status === 'pagado' ? (
                <>
                  <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary-hover transition-colors font-medium">
                    <Receipt className="w-4 h-4" />
                    Ver Recibo
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 bg-muted text-foreground py-2 rounded-lg hover:bg-muted transition-colors font-medium">
                    <Download className="w-4 h-4" />
                    Descargar PDF
                  </button>
                  <button className="w-full bg-muted text-foreground py-2 rounded-lg hover:bg-muted transition-colors font-medium">
                    Enviar Recibo
                  </button>
                </>
              ) : (
                <>
                  <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary-hover transition-colors font-medium">
                    Registrar Pago
                  </button>
                  <button className="w-full bg-muted text-foreground py-2 rounded-lg hover:bg-muted transition-colors font-medium">
                    Enviar Recordatorio
                  </button>
                  <button className="w-full bg-muted text-foreground py-2 rounded-lg hover:bg-muted transition-colors font-medium">
                    Ajustar Monto
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Payment Stats */}
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Estadísticas</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pagos a tiempo</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-foreground">
                    {payment.relatedPayments?.length || 0} / {payment.relatedPayments?.length || 0}
                  </p>
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total pagado este año</p>
                <p className="text-lg font-semibold text-foreground">
                  ${(payment.relatedPayments?.length || 0 * Number(payment.amount)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          {payment.status === 'pagado' && (
            <div className="bg-card rounded-lg shadow-sm border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Documentos</h2>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted transition-colors text-left">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">Recibo de pago</p>
                    <p className="text-xs text-muted-foreground">PDF - 124 KB</p>
                  </div>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted transition-colors text-left">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">Comprobante bancario</p>
                    <p className="text-xs text-muted-foreground">PDF - 89 KB</p>
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
