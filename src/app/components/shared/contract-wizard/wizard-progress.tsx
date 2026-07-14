import { CheckCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface WizardProgressProps {
  steps: { id: number; name: string; icon: LucideIcon }[];
  currentStep: number;
}

export function WizardProgress({ steps, currentStep }: WizardProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? 'bg-success-muted border-success'
                      : isActive
                      ? 'bg-primary-muted border-primary'
                      : 'bg-muted border-border'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-success" />
                  ) : (
                    <Icon
                      className={`w-6 h-6 ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                  )}
                </div>
                <span
                  className={`text-xs mt-2 font-medium ${
                    isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted-foreground'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 transition-colors ${
                    isCompleted ? 'bg-success' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}