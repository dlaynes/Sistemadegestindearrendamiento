import { Upload, FileText, X, FileCheck } from 'lucide-react';
import type { Attachment } from '../../../types/contract';

interface WizardStepDocumentsProps {
  attachments: Attachment[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: (id: number) => void;
}

export function WizardStepDocuments({
  attachments,
  onFileUpload,
  onRemoveAttachment,
}: WizardStepDocumentsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Documentos y Archivos Adjuntos</h3>
        <p className="text-muted-foreground mb-4">
          Adjunta documentos requeridos como contrato firmado, identificaciones, comprobantes, etc.
        </p>

        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <div className="mb-4">
            <label className="cursor-pointer">
              <span className="text-primary hover:text-primary-muted-foreground font-medium">Selecciona archivos</span>
              <input
                type="file"
                multiple
                onChange={onFileUpload}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
            </label>
            <span className="text-muted-foreground"> o arrastra y suelta aquí</span>
          </div>
          <p className="text-sm text-muted-foreground">PDF, JPG, PNG o DOC (máx. 10MB por archivo)</p>
        </div>

        {attachments.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="font-medium text-foreground mb-3">Archivos adjuntos ({attachments.length})</h4>
            {attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-foreground text-sm">{attachment.name}</div>
                    <div className="text-xs text-muted-foreground">{attachment.size}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(attachment.id)}
                  className="text-destructive hover:text-destructive-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-4 bg-primary-muted border border-primary-muted rounded-lg">
          <div className="flex gap-3">
            <FileCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-primary-hover text-sm mb-1">Documentos recomendados</h4>
              <ul className="text-sm text-primary-muted-foreground space-y-1">
                <li>• Contrato de arrendamiento firmado</li>
                <li>• Identificación oficial del inquilino</li>
                <li>• Comprobante de domicilio</li>
                <li>• Referencias personales o laborales</li>
                <li>• Comprobante de depósito de garantía</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}