import { FileCheck } from 'lucide-react';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import type { ContractFormData } from '../../../types/contract';

interface WizardStepConditionsProps {
  control: Control<ContractFormData>;
}

export function WizardStepConditions({ control }: WizardStepConditionsProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileCheck className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Condiciones y Cláusulas Especiales</h3>
        </div>
        <p className="text-muted-foreground mb-4">Agrega términos y condiciones adicionales del contrato.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Cláusulas especiales</label>
            <Controller
              name="terms"
              control={control}
              render={({ field: { onChange, value } }) => {
                const inputValue = Array.isArray(value) ? value.join('\n') : value;
                return (
                  <textarea
                    value={inputValue || ''}
                    onChange={(e) => {
                      const rawValue = e.target.value;
                      const arrayValue = rawValue
                        .split('\n')
                        .map((i) => i.trim())
                        .filter((i) => i !== '');
                      onChange(arrayValue);
                    }}
                    rows={6}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: No se permiten mascotas.\nEl inquilino es responsable de los servicios públicos.\nSe requiere seguro de inquilino..."
                  />
                );
              }}
            />
            <p className="mt-1 text-xs text-muted-foreground">Incluye restricciones, responsabilidades y acuerdos especiales.</p>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <Controller
                name="includeMaintenance"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="w-5 h-5 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                  />
                )}
              />
              <div>
                <span className="text-sm font-medium text-foreground">Incluye mantenimiento</span>
                <p className="text-xs text-muted-foreground">Reparaciones y mantenimiento general incluidos.</p>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}