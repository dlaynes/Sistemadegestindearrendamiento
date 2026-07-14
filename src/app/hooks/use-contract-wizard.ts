import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { useContract } from '../contexts/contract-context';
import { useProperty } from '../contexts/property-context';
import { useServices } from '../services/service-context';
import { useRoleNavigation } from './use-role-navigation';
import type { Attachment, Contract, ContractFormData } from '../types/contract';

export interface UseContractWizardResult {
  id?: string;
  isEditing: boolean;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isSubmitting: boolean;
  form: {
    register: ReturnType<typeof useForm<ContractFormData>>['register'];
    handleSubmit: ReturnType<typeof useForm<ContractFormData>>['handleSubmit'];
    watch: ReturnType<typeof useForm<ContractFormData>>['watch'];
    setValue: ReturnType<typeof useForm<ContractFormData>>['setValue'];
    control: ReturnType<typeof useForm<ContractFormData>>['control'];
    formState: ReturnType<typeof useForm<ContractFormData>>['formState'];
  };
  watchedData: ContractFormData;
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  selectedProperty?: ReturnType<typeof useProperty> extends infer P
    ? P extends { getPropertyById: (id: string) => infer R }
      ? R
      : never
    : never;
  handleDurationChange: (duration: number) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveAttachment: (id: number) => void;
  onSubmit: (data: ContractFormData) => Promise<void>;
  nextStep: () => void;
  prevStep: () => void;
  canProceed: () => boolean;
}

export function useContractWizard(): UseContractWizardResult {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  const { getAvailableProperties } = useProperty();
  const availableProperties = getAvailableProperties();
  const { getContractById, addContract, updateContract } = useContract();
  const { document: documentService } = useServices();

  const isEditing = !!id;
  const contract = isEditing && id ? getContractById(id) : undefined;

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>(contract?.attachments || []);

  const defaultValues: Partial<ContractFormData> = useMemo(() => {
    if (isEditing && contract) {
      return {
        propertyId: contract.propertyId,
        invitedTenantName: contract.invitedTenantName,
        invitedTenantEmail: contract.invitedTenantEmail,
        invitedTenantPhone: contract.invitedTenantPhone,
        tenantId: undefined,
        services: contract.services,
        startDate: contract.startDate,
        endDate: contract.endDate,
        duration: contract.duration,
        monthlyRent: contract.monthlyRent,
        deposit: contract.deposit,
        contractType: contract.contractType as 'fijo' | 'mensual' | 'renovable',
        paymentDay: contract.paymentDay,
        terms: contract.terms,
        includeUtilities: false,
        includeMaintenance: false,
      };
    }
    return {
      contractType: 'fijo',
      duration: 12,
      paymentDay: 5,
      includeMaintenance: false,
    };
  }, [contract, isEditing]);

  const form = useForm<ContractFormData>({ defaultValues });
  const { watch, setValue, handleSubmit, register, control, formState } = form;
  const watchedData = watch();

  useEffect(() => {
    if (contract?.attachments) {
      setAttachments(contract.attachments);
    }
  }, [contract?.attachments]);

  const selectedProperty = useMemo(() => {
    return availableProperties.find((p) => p.id === Number(watchedData.propertyId));
  }, [availableProperties, watchedData.propertyId]);

  const handleDurationChange = useCallback(
    (duration: number) => {
      setValue('duration', duration);
      if (watchedData.startDate) {
        const startDate = new Date(watchedData.startDate);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + duration);
        setValue('endDate', endDate.toISOString().split('T')[0]);
      }
    },
    [setValue, watchedData.startDate]
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;
      const newAttachments: Attachment[] = Array.from(files).map((file, index) => ({
        id: attachments.length + index + 1,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type,
        file,
      }));
      setAttachments((prev) => [...prev, ...newAttachments]);
    },
    [attachments.length]
  );

  const handleRemoveAttachment = useCallback((id: number) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const onSubmit = useCallback(
    async (data: ContractFormData) => {
      setIsSubmitting(true);
      try {
        const payload: Contract = {
          id: id || String(Date.now()),
          code: contract?.code || `CT-${String(Date.now()).slice(-4)}`,
          invitedTenantName: data.invitedTenantName,
          invitedTenantEmail: data.invitedTenantEmail,
          invitedTenantPhone: data.invitedTenantPhone,
          tenantId: data.tenantId,
          propertyId: data.propertyId,
          property: selectedProperty?.name || '',
          propertyAddress: selectedProperty?.address || '',
          startDate: data.startDate,
          endDate: data.endDate,
          duration: data.duration,
          monthlyRent: data.monthlyRent,
          services: data.services,
          deposit: data.deposit,
          contractType: data.contractType,
          status: 'activo',
          paymentDay: data.paymentDay,
          terms: data.terms,
          attachments: attachments.map((a) => ({ id: a.id, name: a.name, size: a.size, type: a.type })),
        };

        let createdOrUpdatedContract: Contract;
        if (isEditing && id) {
          createdOrUpdatedContract = await updateContract(id, payload);
        } else {
          createdOrUpdatedContract = await addContract(payload);
        }

        const contractId = createdOrUpdatedContract?.id;
        const filesToUpload = attachments.filter((a) => a.file);
        if (contractId && filesToUpload.length > 0) {
          await Promise.all(
            filesToUpload.map((a) => documentService.uploadDocument('CONTRACT', contractId, a.file as File))
          );
        }

        navigate('/contratos');
      } catch (err) {
        console.error('Error guardando contrato:', err);
        alert(err instanceof Error ? err.message : 'Error al guardar el contrato');
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      id,
      isEditing,
      contract?.code,
      selectedProperty,
      attachments,
      addContract,
      updateContract,
      documentService,
      navigate,
    ]
  );

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (prev < 6 ? prev + 1 : prev));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return !!watchedData.propertyId;
      case 2:
        return (
          !!watchedData.tenantId ||
          (!!watchedData.invitedTenantName &&
            !!watchedData.invitedTenantEmail &&
            !!watchedData.invitedTenantPhone)
        );
      case 3:
        return (
          !!watchedData.startDate &&
          !!watchedData.endDate &&
          !!watchedData.monthlyRent &&
          !!watchedData.deposit
        );
      case 4:
      case 5:
      case 6:
        return true;
      default:
        return true;
    }
  }, [currentStep, watchedData]);

  return {
    id,
    isEditing,
    currentStep,
    setCurrentStep,
    isSubmitting,
    form: { register, handleSubmit, watch, setValue, control, formState },
    watchedData,
    attachments,
    setAttachments,
    selectedProperty,
    handleDurationChange,
    handleFileUpload,
    handleRemoveAttachment,
    onSubmit,
    nextStep,
    prevStep,
    canProceed,
  };
}