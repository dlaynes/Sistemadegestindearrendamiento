import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useContract } from '../../contexts/contract-context';
import { useServices } from '../../services';
import {
  DollarSign,
  ArrowLeft,
  Save,
  FileText,
  Upload,
  X,
  AlertCircle,
} from 'lucide-react';
import type { Payment } from '../../types';

type PaymentFormData = {
  contractId: number;
  baseRent: number;
  services: number;
  paymentDate: string;
  paymentMethod: 'transferencia' | 'efectivo' | 'cheque' | 'tarjeta';
  reference: string;
  month: string;
  year: number;
  notes: string;
  lateFee: number;
};

type Attachment = {
  id: number;
  name: string;
  size: string;
  type: string;
};

export function InquilinoPaymentForm() {
  const { contractId } = useParams();
  const navigate = useNavigate();
  const { payment: paymentService } = useServices();

  const { getContractById } = useContract();
  const contract = contractId ? getContractById(contractId) : undefined;
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    defaultValues: {
      contractId: Number(contractId),
      baseRent: Number(contract?.monthlyRent?.replace(/[^\d]/g, '') || '0'),
      services: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'transferencia',
      month: new Date().toLocaleString('es', { month: 'long' }),
      year: new Date().getFullYear(),
      lateFee: 0,
    },
  });

  const watchedData = watch();
  const totalAmount = (watchedData.baseRent || 0) + (watchedData.services || 0) + (watchedData.lateFee || 0);

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <AlertCircle className="w-16 h-16 text-muted-foreground" />
        <h2 className="text-2xl font-semibold text-foreground">Contrato no encontrado</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary hover:text-primary-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>
    );
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAttachments: Attachment[] = Array.from(files).map((file, index) => ({
        id: attachments.length + index + 1,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type,
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (id: number) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    try {
      const paymentData: Partial<Payment> = {
        contractId: data.contractId,
        amount: `$${totalAmount.toLocaleString()}`,
        status: 'pagado',
        method: data.paymentMethod,
        dueDate: data.paymentDate,
        paidDate: data.paymentDate,
        referenceNumber: data.reference,
        notes: data.notes,
        property: contract.property,
      };

      const created = await paymentService.create(paymentData as Payment);
      navigate(`/pagos/${created.id}`);
    } catch (err) {
      console.error('Error registrando pago:', err);
      alert('Ocurrió un error al registrar el pago. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - 1 + i);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Volver</span>
        </button>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-success-muted p-3 rounded-lg">
            <DollarSign className="w-6 h-6 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Registrar Pago</h1>
            <p className="text-muted-foreground">
              Contrato #{contractId?.toString().padStart(4, '0')} - {contract.tenantName}
            </p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-primary-muted border border-primary-muted rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-primary-muted-foreground font-medium">Propiedad:</span>
              <p className="text-primary-hover font-semibold">{contract.property}</p>
            </div>
            <div>
              <span className="text-primary-muted-foreground font-medium">Renta mensual:</span>
              <p className="text-primary-hover font-semibold">${contract.monthlyRent.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-primary-muted-foreground font-medium">Inquilino:</span>
              <p className="text-primary-hover font-semibold">{contract.tenantName}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Monto Base de Renta *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  {...register('baseRent', { required: 'El monto es requerido', min: 0 })}
                  className="w-full pl-7 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                />
              </div>
              {errors.baseRent && (
                <p className="mt-1 text-sm text-destructive">{errors.baseRent.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Servicios Adicionales
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  {...register('services', { min: 0 })}
                  className="w-full pl-7 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cargo por Mora
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <input
                  type="number"
                  {...register('lateFee', { min: 0 })}
                  className="w-full pl-7 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Fecha de Pago *
              </label>
              <input
                type="date"
                {...register('paymentDate', { required: 'La fecha es requerida' })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.paymentDate && (
                <p className="mt-1 text-sm text-destructive">{errors.paymentDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mes de Pago *
              </label>
              <select
                {...register('month', { required: 'El mes es requerido' })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {months.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Año *
              </label>
              <select
                {...register('year', { required: 'El año es requerido' })}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Método de Pago *
            </label>
            <select
              {...register('paymentMethod', { required: 'El método es requerido' })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="transferencia">Transferencia Bancaria</option>
              <option value="efectivo">Efectivo</option>
              <option value="cheque">Cheque</option>
              <option value="tarjeta">Tarjeta de Crédito/Débito</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Número de Referencia / Transacción
            </label>
            <input
              type="text"
              {...register('reference')}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ej: TRANS-123456789"
            />
          </div>

          {totalAmount > 0 && (
            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold text-foreground mb-3">Resumen</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Renta Base:</span>
                  <span className="font-medium text-foreground">
                    ${watchedData.baseRent?.toLocaleString()}
                  </span>
                </div>
                {watchedData.services && watchedData.services > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Servicios:</span>
                    <span className="font-medium text-foreground">
                      ${watchedData.services?.toLocaleString()}
                    </span>
                  </div>
                )}
                {watchedData.lateFee && watchedData.lateFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cargo por mora:</span>
                    <span className="font-medium text-destructive">
                      ${watchedData.lateFee?.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-border flex justify-between">
                  <span className="font-semibold text-foreground">Total:</span>
                  <span className="font-bold text-foreground text-lg">
                    ${totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Comprobante de Pago (Opcional)
            </h3>

            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <div className="mb-3">
                <label className="cursor-pointer">
                  <span className="text-primary hover:text-primary-muted-foreground font-medium">
                    Selecciona archivos
                  </span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
                <span className="text-muted-foreground"> o arrastra y suelta aquí</span>
              </div>
              <p className="text-sm text-muted-foreground">
                PDF, JPG o PNG (máx. 5MB por archivo)
              </p>
            </div>

            {attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium text-foreground mb-2">
                  Archivos adjuntos ({attachments.length})
                </h4>
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <div className="font-medium text-foreground text-sm">
                          {attachment.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{attachment.size}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(attachment.id)}
                      className="text-destructive hover:text-destructive-muted-foreground transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Notas Adicionales</h3>
            <textarea
              {...register('notes')}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Agrega cualquier comentario o nota relevante sobre este pago..."
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-success text-white rounded-lg hover:bg-success-muted-foreground transition-colors font-medium disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Registrando...' : 'Registrar Pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
