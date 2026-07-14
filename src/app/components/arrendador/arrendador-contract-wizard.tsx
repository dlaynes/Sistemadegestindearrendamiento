import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useForm, Controller } from 'react-hook-form';
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  Save,
  Building2,
  User,
  Calendar,
  FileCheck,
  Upload,
  X,
  CheckCircle,
  Search,
  ChevronDown,
} from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { useProperty } from '../../contexts/property-context';
import { useContract } from '../../contexts/contract-context';
import { useServices } from '../../services/service-context';
import { LoadingOverlay } from '../shared/ui/loading-overlay';
import type { User as UserType } from '../../types/user';
import { Attachment, ContractFormData } from '@/app/types/contract';

const STEPS = [
  { id: 1, name: 'Propiedad', icon: Building2 },
  { id: 2, name: 'Inquilino', icon: User },
  { id: 3, name: 'Términos', icon: Calendar },
  { id: 4, name: 'Condiciones', icon: FileCheck },
  { id: 5, name: 'Documentos', icon: Upload },
  { id: 6, name: 'Revisión', icon: CheckCircle },
];

export function ArrendadorContractWizard() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  const isEditing = !!id;
  const { getAvailableProperties } = useProperty();
  const availableProperties = getAvailableProperties();
  const { getContractById, addContract, updateContract } = useContract();

  const contract = isEditing && id ? getContractById(id) : undefined;
  const { auth: authService, document: documentService } = useServices();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>(contract?.attachments || []);
  const [tenants, setTenants] = useState<UserType[]>([]);

  useEffect(() => {
    authService.getTenants().then(setTenants).catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autocomplete state for property selection
  const [propertyQuery, setPropertyQuery] = useState('');
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const [propertyHighlighted, setPropertyHighlighted] = useState(0);
  const propertyListRef = React.useRef<HTMLDivElement>(null);

  // Autocomplete state for tenant selection
  const [tenantQuery, setTenantQuery] = useState('');
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [tenantHighlighted, setTenantHighlighted] = useState(0);
  const tenantListRef = React.useRef<HTMLDivElement>(null);

  const filteredProperties = propertyQuery.trim() === ''
    ? availableProperties
    : availableProperties.filter(
        (p) =>
          p.name.toLowerCase().includes(propertyQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(propertyQuery.toLowerCase())
      );

  const filteredTenants = tenantQuery.trim() === ''
    ? tenants
    : tenants.filter(
        (t) =>
          t.name.toLowerCase().includes(tenantQuery.toLowerCase()) ||
          t.email.toLowerCase().includes(tenantQuery.toLowerCase())
      );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ContractFormData>({
    defaultValues: isEditing && contract
      ? {
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
        }
      : {
          contractType: 'fijo',
          duration: 12,
          paymentDay: 5,
          includeMaintenance: false,
        },
  });

  const watchedData = watch();
  const selectedProperty = availableProperties.find((p) => p.id === Number(watchedData.propertyId));

  const selectedTenant = watchedData.tenantId
    ? tenants.find((t) => String(t.id) === String(watchedData.tenantId))
    : null;

  const clearSelectedTenant = () => {
    setValue('invitedTenantName', '', { shouldValidate: true });
    setValue('invitedTenantEmail', '', { shouldValidate: true });
    setValue('tenantId', undefined, { shouldValidate: true });
    setTenantQuery('');
  };

  // Calcular fecha de fin basada en duraciÃ³n
  const handleDurationChange = (duration: number) => {
    setValue('duration', duration);
    if (watchedData.startDate) {
      const startDate = new Date(watchedData.startDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + duration);
      setValue('endDate', endDate.toISOString().split('T')[0]);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAttachments: Attachment[] = Array.from(files).map((file, index) => ({
        id: attachments.length + index + 1,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        type: file.type,
        file,
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (id: number) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const onSubmit = async (data: ContractFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
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
        status: 'activo' as const,
        paymentDay: data.paymentDay,
        terms: data.terms,
        attachments: attachments.map((a) => ({ id: a.id, name: a.name, size: a.size, type: a.type })),
      };

      let createdOrUpdatedContract;
      if (isEditing && id) {
        createdOrUpdatedContract = await updateContract(id, payload);
      } else {
        createdOrUpdatedContract = await addContract(payload);
      }

      const contractId = createdOrUpdatedContract?.id;
      const filesToUpload: Array<{ file: File }> = [];
      for (const a of attachments) {
        if (a.file) filesToUpload.push({ file: a.file });
      }
      if (contractId && filesToUpload.length > 0) {
        await Promise.all(
          filesToUpload.map((a) => documentService.uploadDocument('CONTRACT', contractId, a.file))
        );
      }

      navigate('/contratos');
    } catch (err) {
      console.error('Error guardando contrato:', err);
      alert(err instanceof Error ? err.message : 'Error al guardar el contrato');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return watchedData.propertyId;
      case 2:
        return selectedTenant
        ? true
        : (watchedData.invitedTenantName && watchedData.invitedTenantEmail && watchedData.invitedTenantPhone);
      case 3:
        return watchedData.startDate && watchedData.endDate && watchedData.monthlyRent && watchedData.deposit;
      case 4:
      case 5:
      case 6:
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/contratos')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Volver</span>
        </button>
      </div>

      <div className="relative bg-card rounded-xl border border-border-subtle shadow-elev-xs p-6">
        <LoadingOverlay visible={isSubmitting} message={isEditing ? "Guardando cambios..." : "Creando contrato..."} />
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-muted p-3 rounded-lg">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              {isEditing ? 'Editar Contrato' : 'Nuevo Contrato de Arrendamiento'}
            </h1>
            <p className="text-muted-foreground">
              Paso {currentStep} de {STEPS.length}: {STEPS[currentStep - 1].name}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
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
                  {index < STEPS.length - 1 && (
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

        <form onSubmit={() => false}>
          {/* Step 1: Seleccionar Propiedad */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Selecciona la Propiedad
                </h3>
                <p className="text-muted-foreground mb-4">
                  Elige la propiedad que será objeto del contrato de arrendamiento
                </p>

                {/* Autocomplete */}
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={propertyQuery}
                      onChange={(e) => {
                        setPropertyQuery(e.target.value);
                        setPropertyDropdownOpen(true);
                        setPropertyHighlighted(0);
                      }}
                      onFocus={() => setPropertyDropdownOpen(true)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          setPropertyHighlighted((prev) =>
                            prev < filteredProperties.length - 1 ? prev + 1 : prev
                          );
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          setPropertyHighlighted((prev) => (prev > 0 ? prev - 1 : 0));
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          const prop = filteredProperties[propertyHighlighted];
                          if (prop) {
                            setValue('propertyId', Number(prop.id), { shouldValidate: true });
                            setPropertyQuery(prop.name);
                            setPropertyDropdownOpen(false);
                          }
                        } else if (e.key === 'Escape') {
                          setPropertyDropdownOpen(false);
                        }
                      }}
                      placeholder="Buscar propiedad por nombre o dirección..."
                      className="w-full pl-10 pr-10 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setPropertyDropdownOpen((open) => !open)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-muted-foreground"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>

                  {propertyDropdownOpen && (
                    <div
                      ref={propertyListRef}
                      className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-auto"
                    >
                      {filteredProperties.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-muted-foreground">
                          No se encontraron propiedades
                        </div>
                      ) : (
                        filteredProperties.map((property, index) => (
                          <button
                            key={property.id}
                            type="button"
                            onClick={() => {
                              setValue('propertyId', Number(property.id), { shouldValidate: true });
                              setPropertyQuery(property.name);
                              setPropertyDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                              index === propertyHighlighted
                                ? 'bg-primary-muted'
                                : 'hover:bg-muted'
                            } ${
                              Number(watchedData.propertyId) === property.id
                                ? 'border-l-4 border-primary'
                                : 'border-l-4 border-transparent'
                            }`}
                            onMouseEnter={() => setPropertyHighlighted(index)}
                          >
                            <Building2 className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground truncate">
                                {property.name}
                              </div>
                              <div className="text-sm text-muted-foreground truncate">
                                {property.address} - S./{property.rent}/mes
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Selected property card */}
                {selectedProperty && (
                  <div className="mt-4 p-4 border-2 border-primary bg-primary-muted rounded-lg flex items-center gap-4">
                    <Building2 className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{selectedProperty.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedProperty.address}</div>
                      <div className="text-sm font-semibold text-primary mt-1">
                        ${selectedProperty.rent}/mes
                      </div>
                    </div>
                  </div>
                )}

                <input
                  type="hidden"
                  {...register('propertyId', { required: 'Debes seleccionar una propiedad' })}
                />
                {errors.propertyId && (
                  <p className="mt-2 text-sm text-destructive">{errors.propertyId.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Datos del Inquilino */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Información del Inquilino
                </h3>
                <p className="text-muted-foreground mb-4">
                  Busca un inquilino existente o ingresa los datos manualmente para enviar una invitación.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 relative">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Inquilino
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={tenantQuery}
                        disabled={!!selectedTenant}
                        onChange={(e) => {
                          const value = e.target.value;
                          setTenantQuery(value);
                          setTenantDropdownOpen(true);
                          setTenantHighlighted(0);
                          setValue('invitedTenantName', value, { shouldValidate: true });
                          if (value.trim() === '') {
                            setValue('tenantId', undefined, { shouldValidate: true });
                          }
                        }}
                        onFocus={() => {
                          if (!selectedTenant) setTenantDropdownOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (selectedTenant) return;
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setTenantHighlighted((prev) =>
                              prev < filteredTenants.length - 1 ? prev + 1 : prev
                            );
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setTenantHighlighted((prev) => (prev > 0 ? prev - 1 : 0));
                          } else if (e.key === 'Enter') {
                            e.preventDefault();
                            const t = filteredTenants[tenantHighlighted];
                            if (t) {
                              setValue('invitedTenantName', t.name, { shouldValidate: true });
                              setValue('invitedTenantEmail', t.email, { shouldValidate: true });
                              setValue('tenantId', Number(t.id), { shouldValidate: true });
                              setTenantQuery(t.name);
                              setTenantDropdownOpen(false);
                            }
                          } else if (e.key === 'Escape') {
                            setTenantDropdownOpen(false);
                          }
                        }}
                        placeholder={selectedTenant ? 'Inquilino seleccionado' : 'Buscar inquilino por nombre o correo...'}
                        className="w-full pl-10 pr-10 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:text-muted-foreground"
                      />
                      {!selectedTenant && (
                        <button
                          type="button"
                          onClick={() => setTenantDropdownOpen((open) => !open)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-muted-foreground"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {tenantDropdownOpen && !selectedTenant && (
                      <div
                        ref={tenantListRef}
                        className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-auto"
                      >
                        {filteredTenants.length > 0 ? (
                          filteredTenants.map((t, index) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => {
                                setValue('invitedTenantName', t.name, { shouldValidate: true });
                                setValue('invitedTenantEmail', t.email, { shouldValidate: true });
                                setValue('tenantId', Number(t.id), { shouldValidate: true });
                                setTenantQuery(t.name);
                                setTenantDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                                index === tenantHighlighted
                                  ? 'bg-primary-muted'
                                  : 'hover:bg-muted'
                              }`}
                              onMouseEnter={() => setTenantHighlighted(index)}
                            >
                              <User className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-foreground truncate">
                                  {t.name}
                                </div>
                                <div className="text-sm text-muted-foreground truncate">
                                  {t.email}
                                </div>
                              </div>
                            </button>
                          ))
                        ) : null}
                      </div>
                    )}

                    {selectedTenant && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="text-success">o</span>
                        <span className="text-muted-foreground">
                          Inquilino vinculado: {selectedTenant.name} ({selectedTenant.email})
                        </span>
                        <button
                          type="button"
                          onClick={clearSelectedTenant}
                          className="ml-2 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-destructive bg-destructive-muted rounded hover:bg-destructive-muted/80"
                        >
                          <X className="w-3 h-3" />
                          Cambiar inquilino
                        </button>
                      </div>
                    )}

                    <input
                      type="hidden"
                      {...register('invitedTenantName', { required: 'El nombre es requerido' })}
                    />
                    {errors.invitedTenantName && (
                      <p className="mt-1 text-sm text-destructive">{errors.invitedTenantName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      disabled={!!selectedTenant}
                      {...register('invitedTenantEmail', {
                        required: 'El correo es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Correo inválido',
                        },
                      })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:text-muted-foreground"
                      placeholder="juan.perez@email.com"
                    />
                    {errors.invitedTenantEmail && (
                      <p className="mt-1 text-sm text-destructive">{errors.invitedTenantEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      disabled={!!selectedTenant}
                      {...register('invitedTenantPhone', { required: 'El teléfono es requerido' })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:text-muted-foreground"
                      placeholder="+1234567890"
                    />
                    {errors.invitedTenantPhone && (
                      <p className="mt-1 text-sm text-destructive">{errors.invitedTenantPhone.message}</p>
                    )}
                  </div>

                  <input type="hidden" {...register('tenantId')} />
                </div>
              </div>
            </div>
          )}
          {/* Step 3: Términos del Contrato */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Términos del Contrato
                </h3>
                <p className="text-muted-foreground mb-4">
                  Define las fechas, montos y plazo del arrendamiento
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tipo de contrato *
                    </label>
                    <select
                      {...register('contractType', { required: 'El tipo es requerido' })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="fijo">Plazo Fijo</option>
                      <option value="mensual">Mes a Mes</option>
                      <option value="renovable">Renovable Automáticamente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Duración (meses) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register('duration', {
                        required: 'La duración es requerida',
                        onChange: (e) => handleDurationChange(Number(e.target.value)),
                      })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.duration && (
                      <p className="mt-1 text-sm text-destructive">{errors.duration.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Fecha de inicio *
                    </label>
                    <input
                      type="date"
                      {...register('startDate', {
                        required: 'La fecha de inicio es requerida',
                        onChange: (e) => {
                          if (watchedData.duration) {
                            const startDate = new Date(e.target.value);
                            const endDate = new Date(startDate);
                            endDate.setMonth(endDate.getMonth() + watchedData.duration);
                            setValue('endDate', endDate.toISOString().split('T')[0]);
                          }
                        },
                      })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-destructive">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Fecha de fin *
                    </label>
                    <input
                      type="date"
                      {...register('endDate', { required: 'La fecha de fin es requerida' })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-destructive">{errors.endDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Renta mensual (S/.) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('monthlyRent', {
                        required: 'La renta es requerida',
                        min: { value: 0, message: 'Debe ser mayor a 0' },
                      })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ej: 3200.00 (solo números)"
                    />
                    {errors.monthlyRent && (
                      <p className="mt-1 text-sm text-destructive">{errors.monthlyRent.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Servicios (S./)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('services', {
                        min: { value: 0, message: 'Debe ser mayor a 0' },
                      })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0.00"
                    />
                    {errors.services && (
                      <p className="mt-1 text-sm text-destructive">{errors.services.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Depósito de garantía (S/.) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('deposit', {
                        required: 'El depósito es requerido',
                        min: { value: 0, message: 'Debe ser mayor a 0' },
                      })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Ej: 6400.00 (solo números)"
                    />
                    {errors.deposit && (
                      <p className="mt-1 text-sm text-destructive">{errors.deposit.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Día de pago mensual *
                    </label>
                    <select
                      {...register('paymentDay', { required: 'El día de pago es requerido' })}
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
          )}

          {/* Step 4: Condiciones Adicionales */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Condiciones y Cláusulas Especiales
                </h3>
                <p className="text-muted-foreground mb-4">
                  Agrega términos y condiciones adicionales del contrato
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Cláusulas especiales
                    </label>
                    <Controller
                      name="terms"
                      control={control}
                      render={({ field: { onChange, value } })=>{
                        const inputValue = Array.isArray(value) ? value.join("\n") : value; 
                        return (
                          <textarea
                            value={inputValue}
                            onChange={(e)=>{
                              const rawValue = e.target.value;

                              const arrayValue = rawValue.split("\n")
                                                        .map(i => i.trim())
                                                        .filter(i => i !== "");
                              onChange(arrayValue);
                            }}
                            rows={6}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Ej: No se permiten mascotas. \nEl inquilino es responsable de los servicios públicos. \nSe requiere seguro de inquilino..."
                           />
                        )

                      }}
                    />
                    <p className="mt-1 text-xs text-muted-foreground">
                      Incluye restricciones, responsabilidades y acuerdos especiales
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('includeMaintenance')}
                        className="w-5 h-5 text-primary border-border rounded focus:ring-2 focus:ring-primary"
                      />
                      <div>
                        <span className="text-sm font-medium text-foreground">
                          Incluye mantenimiento
                        </span>
                        <p className="text-xs text-muted-foreground">
                          Reparaciones y mantenimiento general incluidos
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Documentos Adjuntos */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Documentos y Archivos Adjuntos
                </h3>
                <p className="text-muted-foreground mb-4">
                  Adjunta documentos requeridos como contrato firmado, identificaciones, comprobantes, etc.
                </p>

                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <div className="mb-4">
                    <label className="cursor-pointer">
                      <span className="text-primary hover:text-primary-muted-foreground font-medium">
                        Selecciona archivos
                      </span>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                    </label>
                    <span className="text-muted-foreground"> o arrastra y suelta aquí</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    PDF, JPG, PNG o DOC (máx. 10MB por archivo)
                  </p>
                </div>

                {attachments.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h4 className="font-medium text-foreground mb-3">
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

                <div className="mt-4 p-4 bg-primary-muted border border-primary-muted rounded-lg">
                  <div className="flex gap-3">
                    <FileCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-primary-hover text-sm mb-1">
                        Documentos recomendados
                      </h4>
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
          )}

          {/* Step 6: Revisión */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Revisión del Contrato
                </h3>
                <p className="text-muted-foreground mb-6">
                  Verifica que toda la información sea correcta antes de guardar
                </p>

                <div className="space-y-6">
                  {/* Propiedad */}
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Propiedad</h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="font-medium text-foreground">{selectedProperty?.name}</div>
                      <div className="text-muted-foreground">{selectedProperty?.address}</div>
                      <div className="text-primary font-semibold">
                        ${selectedProperty?.rent}/mes
                      </div>
                    </div>
                  </div>

                  {/* Inquilino */}
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
                        <span className="font-medium text-foreground">{watchedData.tenantId ? 'Sí (ID: ' + watchedData.tenantId + ')' : 'Nuevo (invitación)'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Términos */}
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-foreground">Términos del Contrato</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Tipo:</span>{' '}
                        <span className="font-medium text-foreground">
                          {watchedData.contractType === 'fijo'
                            ? 'Plazo Fijo'
                            : watchedData.contractType === 'mensual'
                            ? 'Mes a Mes'
                            : 'Renovable Automáticamente'}
                        </span>
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
                        <span className="font-medium text-foreground">
                          ${watchedData.monthlyRent?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Servicios:</span>{' '}
                        <span className="font-medium text-foreground">
                          ${watchedData.services?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Depósito:</span>{' '}
                        <span className="font-medium text-foreground">
                          ${watchedData.deposit?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Día de pago:</span>{' '}
                        <span className="font-medium text-foreground">Día {watchedData.paymentDay}</span>
                      </div>
                    </div>
                  </div>

                  {/* Condiciones */}
                  {(watchedData.terms || watchedData.includeUtilities || watchedData.includeMaintenance) && (
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileCheck className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold text-foreground">Condiciones Especiales</h4>
                      </div>
                      {watchedData.terms && (
                        <div className="text-sm text-foreground mb-3 whitespace-pre-line">
                          {Array.isArray(watchedData.terms) ? (watchedData.terms || []).join(', ') : watchedData.terms}
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

                  {/* Documentos */}
                  {attachments.length > 0 && (
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Upload className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold text-foreground">
                          Documentos Adjuntos ({attachments.length})
                        </h4>
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
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-border mt-8">
            <button
              type="button"
              onClick={prevStep}
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

            {currentStep < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
                  canProceed()
                    ? 'bg-primary text-primary-foreground hover:bg-primary-hover'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)} disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-success text-success-foreground rounded-lg hover:bg-success-muted-foreground transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                {isEditing ? 'Guardar Cambios' : 'Crear Contrato'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
