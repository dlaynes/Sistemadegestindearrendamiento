import { useEffect, useState } from 'react';
import {
  FileText,
  ArrowLeft,
  Building2,
  User,
  Calendar,
  FileCheck,
  Upload,
  CheckCircle,
} from 'lucide-react';
import { useRoleNavigation } from '../../../hooks/use-role-navigation';
import { useContractWizard } from '../../../hooks/use-contract-wizard';
import { useServices } from '../../../services/service-context';
import { useProperty } from '../../../contexts/property-context';
import { LoadingOverlay } from '../ui/loading-overlay';
import { WizardProgress } from './wizard-progress';
import { WizardNavigation } from './wizard-navigation';
import { WizardStepProperty } from './wizard-step-property';
import { WizardStepTenant } from './wizard-step-tenant';
import { WizardStepTerms } from './wizard-step-terms';
import { WizardStepConditions } from './wizard-step-conditions';
import { WizardStepDocuments } from './wizard-step-documents';
import { WizardStepReview } from './wizard-step-review';
import type { User as UserType } from '../../../types/user';

const STEPS = [
  { id: 1, name: 'Propiedad', icon: Building2 },
  { id: 2, name: 'Inquilino', icon: User },
  { id: 3, name: 'Términos', icon: Calendar },
  { id: 4, name: 'Condiciones', icon: FileCheck },
  { id: 5, name: 'Documentos', icon: Upload },
  { id: 6, name: 'Revisión', icon: CheckCircle },
];

export type ContractWizardMode = 'administrador' | 'arrendador';

export interface ContractWizardProps {
  mode: ContractWizardMode;
  title: string;
  backUrl: string;
}

export function ContractWizard({ mode, title, backUrl }: ContractWizardProps) {
  const navigate = useRoleNavigation();
  const { auth: authService } = useServices();
  const { getAvailableProperties } = useProperty();
  const availableProperties = getAvailableProperties();
  const [tenants, setTenants] = useState<UserType[]>([]);

  const {
    isEditing,
    currentStep,
    isSubmitting,
    form,
    watchedData,
    attachments,
    selectedProperty,
    handleDurationChange,
    handleFileUpload,
    handleRemoveAttachment,
    onSubmit,
    nextStep,
    prevStep,
    canProceed,
  } = useContractWizard();

  const { register, handleSubmit, setValue, control, formState } = form;

  useEffect(() => {
    authService.getTenants().then(setTenants).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectProperty = (property: (typeof availableProperties)[number]) => {
    setValue('propertyId', Number(property.id), { shouldValidate: true });
  };

  const handleSelectTenant = (user: UserType) => {
    setValue('tenantId', Number(user.id), { shouldValidate: true });
    setValue('invitedTenantName', user.name, { shouldValidate: true });
    setValue('invitedTenantEmail', user.email, { shouldValidate: true });
  };

  const handleClearTenant = () => {
    setValue('invitedTenantName', '', { shouldValidate: true });
    setValue('invitedTenantEmail', '', { shouldValidate: true });
    setValue('invitedTenantPhone', '', { shouldValidate: true });
    setValue('tenantId', undefined, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(backUrl)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Volver</span>
        </button>
      </div>

      <div className="relative bg-card rounded-xl border border-border-subtle shadow-elev-xs p-6">
        <LoadingOverlay
          visible={isSubmitting}
          message={isEditing ? 'Guardando cambios...' : 'Creando contrato...'}
        />

        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-muted p-3 rounded-lg">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            <p className="text-muted-foreground">
              Paso {currentStep} de {STEPS.length}: {STEPS[currentStep - 1].name}
            </p>
          </div>
        </div>

        <WizardProgress steps={STEPS} currentStep={currentStep} />

        <form onSubmit={() => false}>
          {currentStep === 1 && (
            <WizardStepProperty
              properties={availableProperties}
              selectedPropertyId={watchedData.propertyId}
              onSelect={handleSelectProperty}
              register={register}
              error={formState.errors.propertyId?.message}
            />
          )}

          {currentStep === 2 && (
            <WizardStepTenant
              users={tenants}
              selectedTenantId={watchedData.tenantId}
              invitedTenantName={watchedData.invitedTenantName}
              invitedTenantEmail={watchedData.invitedTenantEmail}
              invitedTenantPhone={watchedData.invitedTenantPhone}
              onSelectTenant={handleSelectTenant}
              onClearTenant={handleClearTenant}
              onChangeName={(value) => setValue('invitedTenantName', value, { shouldValidate: true })}
              onChangeEmail={(value) => setValue('invitedTenantEmail', value, { shouldValidate: true })}
              onChangePhone={(value) => setValue('invitedTenantPhone', value, { shouldValidate: true })}
              register={register}
              errors={formState.errors}
              disabled={mode === 'administrador' && false /* placeholder for future arbitrary-user restriction */}
            />
          )}

          {currentStep === 3 && (
            <WizardStepTerms
              startDate={watchedData.startDate}
              endDate={watchedData.endDate}
              duration={watchedData.duration}
              monthlyRent={watchedData.monthlyRent}
              services={watchedData.services}
              deposit={watchedData.deposit}
              paymentDay={watchedData.paymentDay}
              contractType={watchedData.contractType}
              onChangeStartDate={(value) => setValue('startDate', value, { shouldValidate: true })}
              onChangeEndDate={(value) => setValue('endDate', value, { shouldValidate: true })}
              onChangeDuration={handleDurationChange}
              onChangeMonthlyRent={(value) => setValue('monthlyRent', value, { shouldValidate: true })}
              onChangeServices={(value) => setValue('services', value)}
              onChangeDeposit={(value) => setValue('deposit', value, { shouldValidate: true })}
              onChangePaymentDay={(value) => setValue('paymentDay', value)}
              onChangeContractType={(value) => setValue('contractType', value)}
              register={register}
              errors={formState.errors}
            />
          )}

          {currentStep === 4 && (
            <WizardStepConditions
              control={control}/>
          )}

          {currentStep === 5 && (
            <WizardStepDocuments
              attachments={attachments}
              onFileUpload={handleFileUpload}
              onRemoveAttachment={handleRemoveAttachment}
            />
          )}

          {currentStep === 6 && (
            <WizardStepReview
              watchedData={watchedData}
              selectedProperty={selectedProperty}
              attachments={attachments}
            />
          )}

          <WizardNavigation
            currentStep={currentStep}
            totalSteps={STEPS.length}
            isLastStep={currentStep === STEPS.length}
            isSubmitting={isSubmitting}
            isEditing={isEditing}
            canProceed={canProceed()}
            onPrev={prevStep}
            onNext={nextStep}
            onSubmit={handleSubmit(onSubmit)}
          />
        </form>
      </div>
    </div>
  );
}