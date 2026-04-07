import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { 
  Building2, 
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { useState } from 'react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';

// Mock data - debería coincidir con el de properties.tsx
const mockProperties = [
  {
    id: 1,
    name: 'Apartamento Centro #101',
    address: 'Calle Principal 123, Centro',
    type: 'Apartamento',
    bedrooms: 2,
    bathrooms: 2,
    area: '85 m²',
    price: 3200,
    status: 'ocupado',
    tenant: 'Juan Pérez',
    description: 'Moderno apartamento en el corazón del centro, con excelente iluminación natural y vistas panorámicas. Cuenta con acabados de primera calidad y ubicación privilegiada cerca de servicios y transporte público.',
    amenities: ['Estacionamiento', 'Balcón', 'Cocina equipada', 'Aire acondicionado', 'Internet incluido'],
    yearBuilt: 2018,
    floors: 1,
    furnished: true,
  },
];

type PropertyFormData = {
  name: string;
  address: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  price: number;
  status: 'ocupado' | 'disponible';
  description: string;
  yearBuilt: number;
  floors: number;
  furnished: boolean;
};

export function ArrendadorPropertyForm() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  const isEditing = !!id;
  
  // Buscar la propiedad si estamos editando
  const property = isEditing ? mockProperties.find(p => p.id === Number(id)) : null;

  const [amenities, setAmenities] = useState<string[]>(property?.amenities || []);
  const [newAmenity, setNewAmenity] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<PropertyFormData>({
    defaultValues: isEditing && property ? {
      name: property.name,
      address: property.address,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      price: property.price,
      status: property.status as PropertyFormData['status'],
      description: property.description,
      yearBuilt: property.yearBuilt,
      floors: property.floors,
      furnished: property.furnished,
    } : {
      status: 'disponible',
      bedrooms: 1,
      bathrooms: 1,
      floors: 1,
      furnished: false,
    }
  });

  const onSubmit = (data: PropertyFormData) => {
    const formData = {
      ...data,
      amenities,
    };
    
    console.log(isEditing ? 'Actualizando propiedad:' : 'Creando propiedad:', formData);
    
    // Aquí iría la lógica para guardar en el backend
    // Por ahora solo simulamos y redirigimos
    navigate('/propiedades');
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
      setAmenities([...amenities, newAmenity.trim()]);
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setAmenities(amenities.filter(a => a !== amenity));
  };

  const propertyTypes = [
    'Apartamento',
    'Casa',
    'Estudio',
    'Loft',
    'Departamento',
    'Penthouse',
    'Villa',
    'Otro'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/propiedades')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Volver</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEditing ? 'Editar Propiedad' : 'Agregar Nueva Propiedad'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Modifica la información de la propiedad' : 'Completa los datos de la nueva propiedad'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la propiedad *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'El nombre es requerido' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej. Apartamento Centro #101"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  {...register('address', { required: 'La dirección es requerida' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej. Calle Principal 123, Centro"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de propiedad *
                </label>
                <select
                  {...register('type', { required: 'El tipo es requerido' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona un tipo</option>
                  {propertyTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && (
                  <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="disponible">Disponible</option>
                  <option value="ocupado">Ocupado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Características */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Características</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Habitaciones *
                </label>
                <input
                  type="number"
                  min="0"
                  {...register('bedrooms', { 
                    required: 'Las habitaciones son requeridas',
                    min: { value: 0, message: 'Debe ser mayor o igual a 0' }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.bedrooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Baños *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  {...register('bathrooms', { 
                    required: 'Los baños son requeridos',
                    min: { value: 0, message: 'Debe ser mayor o igual a 0' }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.bathrooms && (
                  <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Área *
                </label>
                <input
                  type="text"
                  {...register('area', { required: 'El área es requerida' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej. 85 m²"
                />
                {errors.area && (
                  <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pisos
                </label>
                <input
                  type="number"
                  min="1"
                  {...register('floors', { 
                    min: { value: 1, message: 'Debe ser al menos 1' }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.floors && (
                  <p className="mt-1 text-sm text-red-600">{errors.floors.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año de construcción *
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  {...register('yearBuilt', { 
                    required: 'El año de construcción es requerido',
                    min: { value: 1900, message: 'Año inválido' },
                    max: { value: new Date().getFullYear(), message: 'Año inválido' }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={new Date().getFullYear().toString()}
                />
                {errors.yearBuilt && (
                  <p className="mt-1 text-sm text-red-600">{errors.yearBuilt.message}</p>
                )}
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('furnished')}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Amueblado</span>
                </label>
              </div>
            </div>
          </div>

          {/* Precio */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Precio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Renta mensual ($) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  {...register('price', { 
                    required: 'El precio es requerido',
                    min: { value: 0, message: 'El precio debe ser mayor a 0' }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción de la propiedad *
              </label>
              <textarea
                {...register('description', { required: 'La descripción es requerida' })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe las características principales de la propiedad..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Amenidades */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenidades</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAmenity}
                  onChange={(e) => setNewAmenity(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej. Estacionamiento, Piscina, Gimnasio..."
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Agregar
                </button>
              </div>

              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg"
                    >
                      <span>{amenity}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(amenity)}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/propiedades')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              {isEditing ? 'Guardar Cambios' : 'Crear Propiedad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
