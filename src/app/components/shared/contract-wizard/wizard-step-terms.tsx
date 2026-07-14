import { Calendar } from 'lucide-react';
import type { UseFormRegister } from 'react-hook-form';
import type { ContractFormData } from '../../../types/contract';

interface WizardStepTermsProps {
  startDate?: string;
  endDate?: string;
  duration: number;
  monthlyRent?: string;
  services?: string;
  deposit?: string;
  paymentDay: number;
  contractType: 'fijo' | 'mensual' | 'renovable';
  onChangeStartDate: (value: string) => void;
  onChangeEndDate: (value: string) => void;
  onChangeDuration: (value: number) => void;
  onChangeMonthlyRent: (value: string) => void;
  onChangeServices: (value: string) => void;
  onChangeDeposit: (value: string) => void;
  onChangePaymentDay: (value: number) => void;
  onChangeContractType: (value: 'fijo' | 'mensual' | 'renovable') => void;
  register: UseFormRegister<ContractFormData>;
  errors: Partial<Record<string, { message?: string }>>;
}

export function WizardStepTerms({
  startDate,
  endDate,
  duration,
  monthlyRent,
  services,
  deposit,
  paymentDay,
  contractType,
  onChangeStartDate,
  onChangeEndDate,
  onChangeDuration,
  onChangeMonthlyRent,
  onChangeServices,
  onChangeDeposit,
  onChangePaymentDay,
  onChangeContractType,
  register,
  errors,
}: WizardStepTermsProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Términos del Contrato</h3>
        </div>
        <p className="text-muted-foreground mb-4">Define la duración, renta y condiciones de pago del arrendamiento.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Tipo de contrato *</label>
            <select
              value={contractType}
              onChange={(e) => onChangeContractType(e.target.value as 'fijo' | 'mensual' | 'renovable')}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="fijo">Plazo Fijo</option>
              <option value="mensual">Mes a Mes</option>
              <option value="renovable">Renovable Automáticamente</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Duración (meses) *</label>
            <input
              type="number"
              min={1}
              max={60}
              value={duration}
              onChange={(e) => onChangeDuration(Number(e.target.value))}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Fecha de inicio *</label>
            <input
              type="date"
              value={startDate || ''}
              onChange={(e) => onChangeStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input type="hidden" {...register('startDate', { required: 'La fecha de inicio es requerida' })} />
            {errors.startDate?.message && <p className="mt-1 text-sm text-destructive">{errors.startDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Fecha de fin *</label>
            <input
              type="date"
              value={endDate || ''}
              onChange={(e) => onChangeEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input type="hidden" {...register('endDate', { required: 'La fecha de fin es requerida' })} />
            {errors.endDate?.message && <p className="mt-1 text-sm text-destructive">{errors.endDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Renta mensual (S/.) *</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={monthlyRent || ''}
              onChange={(e) => onChangeMonthlyRent(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input type="hidden" {...register('monthlyRent', { required: 'La renta mensual es requerida' })} />
            {errors.monthlyRent?.message && <p className="mt-1 text-sm text-destructive">{errors.monthlyRent.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Servicios adicionales (S/.) *</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={services || ''}
              onChange={(e) => onChangeServices(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.services?.message && <p className="mt-1 text-sm text-destructive">{errors.services.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Depósito de garantía (S/.) *</label>
            <input
              type="number"
              min={0}
              step={0.01}
              value={deposit || ''}
              onChange={(e) => onChangeDeposit(e.target.value)}
              placeholder="Ej: 6400.00 (solo números)"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="hidden"
              {...register('deposit', {
                required: 'El depósito es requerido',
                min: { value: 0, message: 'Debe ser mayor a 0' },
              })}
            />
            {errors.deposit?.message && <p className="mt-1 text-sm text-destructive">{errors.deposit.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Día de pago mensual *</label>
            <select
              value={paymentDay}
              onChange={(e) => onChangePaymentDay(Number(e.target.value))}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                <option key={day} value={day}>
                  Día {day} de cada mes
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}