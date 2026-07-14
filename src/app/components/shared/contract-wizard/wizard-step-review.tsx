import { Building2, User, Calendar, FileCheck, Upload, FileText } from 'lucide-react';
import type { Property } from '../../../types';
import type { Attachment, ContractFormData } from '../../../types/contract';

interface WizardStepReviewProps {
  watchedData: ContractFormData;
  selectedProperty?: Property;
  attachments: Attachment[];
}

export function WizardStepReview({ watchedData, selectedProperty, attachments }: WizardStepReviewProps) {
  const typeLabel =
    watchedData.contractType === 'fijo'
      ? 'Plazo Fijo'
      : watchedData.contractType === 'mensual'
      ? 'Mes a Mes'
      : 'Renovable Automáticamente';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Revisión del Contrato</h3>
        <p className="text-muted-foreground mb-6">Verifica que toda la información sea correcta antes de guardar.</p>

        <div className="space-y-6">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Propiedad</h4>
            </div>
            <div className="space-y-1 text-sm">
              <div className="font-medium text-foreground">{selectedProperty?.name}</div>
              <div className="text-muted-foreground">{selectedProperty?.address}</div>
              <div className="text-primary font-semibold">${selectedProperty?.rent}/mes</div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Inquilino</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Nombre:</span>{' '}
                <span className="font-medium text-foreground">{watchedData.invitedTenantName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>{' '}
                <span className="font-medium text-foreground">{watchedData.invitedTenantEmail}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Teléfono:</span>{' '}
                <span className="font-medium text-foreground">{watchedData.invitedTenantPhone}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Inquilino asignado:</span>{' '}
                <span className="font-medium text-foreground">
                  {watchedData.tenantId ? `Sí (ID: ${watchedData.tenantId})` : 'Nuevo (invitación)'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-primary" />
              <h4 className="font-semibold text-foreground">Términos del Contrato</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Tipo:</span>{' '}
                <span className="font-medium text-foreground">{typeLabel}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Duración:</span>{' '}
                <span className="font-medium text-foreground">{watchedData.duration} meses</span>
              </div>
              <div>
                <span className="text-muted-foreground">Inicio:</span>{' '}
                <span className="font-medium text-foreground">{watchedData.startDate}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Fin:</span>{' '}
                <span className="font-medium text-foreground">{watchedData.endDate}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Renta mensual:</span>{' '}
                <span className="font-medium text-foreground">${Number(watchedData.monthlyRent).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Servicios:</span>{' '}
                <span className="font-medium text-foreground">${Number(watchedData.services).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Depósito:</span>{' '}
                <span className="font-medium text-foreground">${Number(watchedData.deposit).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Día de pago:</span>{' '}
                <span className="font-medium text-foreground">Día {watchedData.paymentDay}</span>
              </div>
            </div>
          </div>

          {(watchedData.terms || watchedData.services || watchedData.includeMaintenance) && (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileCheck className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">Condiciones Especiales</h4>
              </div>
              {watchedData.terms && (
                <div className="text-sm text-foreground mb-3 whitespace-pre-line">
                  {Array.isArray(watchedData.terms) ? watchedData.terms.join(', ') : watchedData.terms}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {!!watchedData.services && (
                  <span className="px-3 py-1 bg-primary-muted text-primary-muted-foreground rounded-full text-xs font-medium">
                    Servicios cobrados por separado
                  </span>
                )}
                {watchedData.includeMaintenance && (
                  <span className="px-3 py-1 bg-primary-muted text-primary-muted-foreground rounded-full text-xs font-medium">
                    Mantenimiento incluido
                  </span>
                )}
              </div>
            </div>
          )}

          {attachments.length > 0 && (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Upload className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">Documentos Adjuntos ({attachments.length})</h4>
              </div>
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{attachment.name}</span>
                    <span className="text-muted-foreground">({attachment.size})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}