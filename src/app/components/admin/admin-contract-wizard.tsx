import { useState } from 'react';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  Save,
  Building2,
  User,
  Calendar,
  DollarSign,
  FileCheck,
  Upload,
  X,
  CheckCircle,
} from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { PageHeader } from '../shared/dashboard/page-header';

// Mock data para propiedades disponibles
const mockAvailableProperties = [
  { id: 1, name: 'Apartamento Centro #101', address: 'Calle Principal 123, Centro', price: 3200 },
  { id: 4, name: 'Casa Familiar #201', address: 'Av. Secundaria 456, Residencial', price: 5500 },
  { id: 5, name: 'Estudio Moderno #104', address: 'Calle Comercial 789, Centro', price: 2200 },
];

// Mock data para contratos existentes (para edición)
const mockContracts = [
  {
    id: 1,
    propertyId: 1,
    tenantName: 'Juan Pérez',
    tenantEmail: 'juan.perez@email.com',
    tenantPhone: '+1234567890',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    duration: 12,
    monthlyRent: 3200,
    deposit: 6400,
    contractType: 'fijo',
    paymentDay: 5,
    specialClauses: 'No se permiten mascotas. Mantenimiento incluye jardinería.',
    attachments: [
      { id: 1, name: 'Contrato firmado.pdf', size: '2.4 MB', type: 'application/pdf' },
      { id: 2, name: 'Identificación inquilino.pdf', size: '1.1 MB', type: 'application/pdf' },
    ],
  },
];

type ContractFormData = {
  propertyId: number;
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  tenantId: string;
  startDate: string;
  endDate: string;
  duration: number;
  monthlyRent: number;
  deposit: number;
  contractType: 'fijo' | 'mensual' | 'renovable';
  paymentDay: number;
  specialClauses: string;
  includeUtilities: boolean;
  includeMaintenance: boolean;
};

type Attachment = {
  id: number;
  name: string;
  size: string;
  type: string;
};

const STEPS = [
  { id: 1, name: 'Propiedad', icon: Building2 },
  { id: 2, name: 'Inquilino', icon: User },
  { id: 3, name: 'Términos', icon: Calendar },
  { id: 4, name: 'Condiciones', icon: FileCheck },
  { id: 5, name: 'Documentos', icon: Upload },
  { id: 6, name: 'Revisión', icon: CheckCircle },
];

export function AdminContractWizard() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  const isEditing = !!id;

  const contract = isEditing ? mockContracts.find((c) => c.id === Number(id)) : null;

  const [currentStep, setCurrentStep] = useState(1);
  const [attachments, setAttachments] = useState<Attachment[]>(contract?.attachments || []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContractFormData>({
    defaultValues: isEditing && contract
      ? {
          propertyId: contract.propertyId,
          tenantName: contract.tenantName,
          tenantEmail: contract.tenantEmail,
          tenantPhone: contract.tenantPhone,
          tenantId: '',
          startDate: contract.startDate,
          endDate: contract.endDate,
          duration: contract.duration,
          monthlyRent: contract.monthlyRent,
          deposit: contract.deposit,
          contractType: contract.contractType as 'fijo' | 'mensual' | 'renovable',
          paymentDay: contract.paymentDay,
          specialClauses: contract.specialClauses,
          includeUtilities: false,
          includeMaintenance: false,
        }
      : {
          contractType: 'fijo',
          duration: 12,
          paymentDay: 5,
          includeUtilities: false,
          includeMaintenance: false,
        },
  });

  const watchedData = watch();
  const selectedProperty = mockAvailableProperties.find((p) => p.id === Number(watchedData.propertyId));

  // Calcular fecha de fin basada en duración
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
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const handleRemoveAttachment = (id: number) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const onSubmit = (data: ContractFormData) => {
    const formData = {
      ...data,
      attachments,
    };

    console.log(isEditing ? 'Actualizando contrato:' : 'Creando contrato:', formData);

    // Aquí iría la lógica para guardar en el backend
    navigate('/contratos');
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
        return watchedData.tenantName && watchedData.tenantEmail && watchedData.tenantPhone;
      case 3:
        return watchedData.startDate && watchedData.endDate && watchedData.monthlyRent && watchedData.deposit;
      case 4:
      case 5:
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
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Volver</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <PageHeader title={isEditing ? 'Editar Contrato' : 'Nuevo Contrato de Arrendamiento'}
              subtitle={ `Paso ${currentStep} de ${STEPS.length}: ${STEPS[currentStep - 1].name}`} size='sm' />
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
                          ? 'bg-green-100 border-green-600'
                          : isActive
                          ? 'bg-blue-100 border-blue-600'
                          : 'bg-gray-100 border-gray-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Icon
                          className={`w-6 h-6 ${
                            isActive ? 'text-blue-600' : 'text-gray-400'
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 transition-colors ${
                        isCompleted ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Seleccionar Propiedad */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Selecciona la Propiedad
                </h3>
                <p className="text-gray-600 mb-4">
                  Elige la propiedad que será objeto del contrato de arrendamiento
                </p>

                <div className="space-y-3">
                  {mockAvailableProperties.map((property) => (
                    <label
                      key={property.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        Number(watchedData.propertyId) === property.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        value={property.id}
                        {...register('propertyId', { required: 'Debes seleccionar una propiedad' })}
                        className="w-5 h-5 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{property.name}</div>
                        <div className="text-sm text-gray-600">{property.address}</div>
                        <div className="text-sm font-semibold text-blue-600 mt-1">
                          ${property.price.toLocaleString()}/mes
                        </div>
                      </div>
                      <Building2 className="w-8 h-8 text-gray-400" />
                    </label>
                  ))}
                </div>
                {errors.propertyId && (
                  <p className="mt-2 text-sm text-red-600">{errors.propertyId.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Datos del Inquilino */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información del Inquilino
                </h3>
                <p className="text-gray-600 mb-4">
                  Ingresa los datos personales del inquilino
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      {...register('tenantName', { required: 'El nombre es requerido' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Juan Pérez González"
                    />
                    {errors.tenantName && (
                      <p className="mt-1 text-sm text-red-600">{errors.tenantName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      {...register('tenantEmail', {
                        required: 'El correo es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Correo inválido',
                        },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="juan.perez@email.com"
                    />
                    {errors.tenantEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.tenantEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      {...register('tenantPhone', { required: 'El teléfono es requerido' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1234567890"
                    />
                    {errors.tenantPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.tenantPhone.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de identificación *
                    </label>
                    <input
                      type="text"
                      {...register('tenantId', { required: 'La identificación es requerida' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Cédula, DNI, o Pasaporte"
                    />
                    {errors.tenantId && (
                      <p className="mt-1 text-sm text-red-600">{errors.tenantId.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Términos del Contrato */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Términos del Contrato
                </h3>
                <p className="text-gray-600 mb-4">
                  Define las fechas, montos y plazo del arrendamiento
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de contrato *
                    </label>
                    <select
                      {...register('contractType', { required: 'El tipo es requerido' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="fijo">Plazo Fijo</option>
                      <option value="mensual">Mes a Mes</option>
                      <option value="renovable">Renovable Automáticamente</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duración (meses) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      {...register('duration', {
                        required: 'La duración es requerida',
                        onChange: (e) => handleDurationChange(Number(e.target.value)),
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.duration && (
                      <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de fin *
                    </label>
                    <input
                      type="date"
                      {...register('endDate', { required: 'La fecha de fin es requerida' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Renta mensual ($) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('monthlyRent', {
                        required: 'La renta es requerida',
                        min: { value: 0, message: 'Debe ser mayor a 0' },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="3200.00"
                    />
                    {errors.monthlyRent && (
                      <p className="mt-1 text-sm text-red-600">{errors.monthlyRent.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Depósito de garantía ($) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register('deposit', {
                        required: 'El depósito es requerido',
                        min: { value: 0, message: 'Debe ser mayor a 0' },
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="6400.00"
                    />
                    {errors.deposit && (
                      <p className="mt-1 text-sm text-red-600">{errors.deposit.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Día de pago mensual *
                    </label>
                    <select
                      {...register('paymentDay', { required: 'El día de pago es requerido' })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Condiciones y Cláusulas Especiales
                </h3>
                <p className="text-gray-600 mb-4">
                  Agrega términos y condiciones adicionales del contrato
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cláusulas especiales
                    </label>
                    <textarea
                      {...register('specialClauses')}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: No se permiten mascotas. El inquilino es responsable de los servicios públicos. Se requiere seguro de inquilino..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Incluye restricciones, responsabilidades y acuerdos especiales
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('includeUtilities')}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Incluye servicios públicos
                        </span>
                        <p className="text-xs text-gray-500">
                          Agua, luz, gas incluidos en la renta
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('includeMaintenance')}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Incluye mantenimiento
                        </span>
                        <p className="text-xs text-gray-500">
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Documentos y Archivos Adjuntos
                </h3>
                <p className="text-gray-600 mb-4">
                  Adjunta documentos requeridos como contrato firmado, identificaciones, comprobantes, etc.
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="mb-4">
                    <label className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-700 font-medium">
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
                    <span className="text-gray-600"> o arrastra y suelta aquí</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    PDF, JPG, PNG o DOC (máx. 10MB por archivo)
                  </p>
                </div>

                {attachments.length > 0 && (
                  <div className="mt-6 space-y-2">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Archivos adjuntos ({attachments.length})
                    </h4>
                    {attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {attachment.name}
                            </div>
                            <div className="text-xs text-gray-500">{attachment.size}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex gap-3">
                    <FileCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 text-sm mb-1">
                        Documentos recomendados
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
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
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Revisión del Contrato
                </h3>
                <p className="text-gray-600 mb-6">
                  Verifica que toda la información sea correcta antes de guardar
                </p>

                <div className="space-y-6">
                  {/* Propiedad */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Propiedad</h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="font-medium text-gray-900">{selectedProperty?.name}</div>
                      <div className="text-gray-600">{selectedProperty?.address}</div>
                      <div className="text-blue-600 font-semibold">
                        ${selectedProperty?.price.toLocaleString()}/mes
                      </div>
                    </div>
                  </div>

                  {/* Inquilino */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Inquilino</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Nombre:</span>{' '}
                        <span className="font-medium text-gray-900">{watchedData.tenantName}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span>{' '}
                        <span className="font-medium text-gray-900">{watchedData.tenantEmail}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Teléfono:</span>{' '}
                        <span className="font-medium text-gray-900">{watchedData.tenantPhone}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Identificación:</span>{' '}
                        <span className="font-medium text-gray-900">{watchedData.tenantId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Términos */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Términos del Contrato</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Tipo:</span>{' '}
                        <span className="font-medium text-gray-900">
                          {watchedData.contractType === 'fijo'
                            ? 'Plazo Fijo'
                            : watchedData.contractType === 'mensual'
                            ? 'Mes a Mes'
                            : 'Renovable Automáticamente'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Duración:</span>{' '}
                        <span className="font-medium text-gray-900">{watchedData.duration} meses</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Inicio:</span>{' '}
                        <span className="font-medium text-gray-900">{watchedData.startDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Fin:</span>{' '}
                        <span className="font-medium text-gray-900">{watchedData.endDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Renta mensual:</span>{' '}
                        <span className="font-medium text-gray-900">
                          ${watchedData.monthlyRent?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Depósito:</span>{' '}
                        <span className="font-medium text-gray-900">
                          ${watchedData.deposit?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Día de pago:</span>{' '}
                        <span className="font-medium text-gray-900">Día {watchedData.paymentDay}</span>
                      </div>
                    </div>
                  </div>

                  {/* Condiciones */}
                  {(watchedData.specialClauses || watchedData.includeUtilities || watchedData.includeMaintenance) && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FileCheck className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Condiciones Especiales</h4>
                      </div>
                      {watchedData.specialClauses && (
                        <div className="text-sm text-gray-700 mb-3 whitespace-pre-line">
                          {watchedData.specialClauses}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {watchedData.includeUtilities && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            Servicios incluidos
                          </span>
                        )}
                        {watchedData.includeMaintenance && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                            Mantenimiento incluido
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Documentos */}
                  {attachments.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Upload className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">
                          Documentos Adjuntos ({attachments.length})
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700">{attachment.name}</span>
                            <span className="text-gray-500">({attachment.size})</span>
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
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg font-medium transition-colors ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
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
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
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
