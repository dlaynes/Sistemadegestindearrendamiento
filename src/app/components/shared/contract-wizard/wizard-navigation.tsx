import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
  isSubmitting: boolean;
  isEditing: boolean;
  canProceed: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function WizardNavigation({
  currentStep,
  isLastStep,
  isSubmitting,
  isEditing,
  canProceed,
  onPrev,
  onNext,
  onSubmit,
}: WizardNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentStep === 1}
        className={`flex items-center gap-2 px-6 py-2 border border-border rounded-lg font-medium transition-colors ${
          currentStep === 1
            ? 'text-muted-foreground cursor-not-allowed'
            : 'text-foreground hover:bg-muted'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Anterior
      </button>

      {isLastStep ? (
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-6 py-2 bg-success text-success-foreground rounded-lg hover:bg-success-muted-foreground transition-colors font-medium"
        >
          <Save className="w-4 h-4" />
          {isEditing ? 'Guardar Cambios' : 'Crear Contrato'}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
            canProceed
              ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          Siguiente
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}