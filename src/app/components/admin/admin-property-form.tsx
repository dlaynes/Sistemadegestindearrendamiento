import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { Building2 } from 'lucide-react';
import { useState } from 'react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { PageHeader, BackButton, FormField, FormSection, TagInput, FormActions } from '../shared';
import type { Property, PropertyType } from '../../types';

const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Apartamento Centro #101',
    address: 'Calle Principal 123, Centro',
    type: 'apartamento',
    bedrooms: 2,
    bathrooms: 2,
    area: '85',
    rent: '$3,200',
    status: 'ocupado',
    description: 'Moderno apartamento en el corazón del centro.',
    amenities: ['Estacionamiento', 'Balcón', 'Cocina equipada'],
    yearBuilt: 2018,
    floors: 1,
    furnished: true,
  },
];

export function AdminPropertyForm() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  const isEditing = !!id;

  const property = isEditing ? mockProperties.find((p) => p.id === id) : null;

  const [amenities, setAmenities] = useState<string[]>(property?.amenities || []);

  const { register, handleSubmit } = useForm<Partial<Property>>({
    defaultValues: isEditing && property
      ? {
          name: property.name,
          address: property.address,
          type: property.type,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          rent: property.rent,
          status: property.status,
          description: property.description,
          yearBuilt: property.yearBuilt,
          floors: property.floors,
          furnished: property.furnished,
        }
      : {
          status: 'disponible',
          bedrooms: 1,
          bathrooms: 1,
          floors: 1,
          furnished: false,
        },
  });

  const onSubmit = (data: Partial<Property>) => {
    const formData = { ...data, amenities };
    console.log(isEditing ? 'Actualizando:' : 'Creando:', formData);
    navigate('/propiedades');
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de eliminar esta propiedad?')) {
      console.log('Eliminando propiedad:', id);
      navigate('/propiedades');
    }
  };

  const propertyTypes: PropertyType[] = [
    'apartamento',
    'casa',
    'estudio',
    'loft',
    'penthouse',
    'villa',
    'otro',
  ];

  return (
    <div className="space-y-6">
      <BackButton onClick={() => navigate('/properties')} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <PageHeader
            title={isEditing ? 'Editar Propiedad' : 'Agregar Nueva Propiedad'}
            subtitle={
              isEditing
                ? 'Modifica la información de la propiedad'
                : 'Completa los datos de la nueva propiedad'
            }
            size="sm"
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormSection title="Información Básica" columns={2}>
            <FormField
              label="Nombre de la propiedad"
              required
              className="md:col-span-2"
            >
              <input
                type="text"
                {...register('name', { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ej. Apartamento Centro #101"
              />
            </FormField>

            <FormField label="Dirección" required className="md:col-span-2">
              <input
                type="text"
                {...register('address', { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Calle, número, ciudad"
              />
            </FormField>

            <FormField label="Tipo de propiedad" required>
              <select
                {...register('type', { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona...</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Estado" required>
              <select
                {...register('status', { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="disponible">Disponible</option>
                <option value="ocupado">Ocupado</option>
                <option value="mantenimiento">En Mantenimiento</option>
              </select>
            </FormField>
          </FormSection>

          <FormSection title="Características" columns={3}>
            <FormField label="Habitaciones" required>
              <input
                type="number"
                {...register('bedrooms', { required: true, min: 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </FormField>

            <FormField label="Baños" required>
              <input
                type="number"
                {...register('bathrooms', { required: true, min: 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </FormField>

            <FormField label="Área (m²)" required>
              <input
                type="text"
                {...register('area', { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ej. 85"
              />
            </FormField>

            <FormField label="Pisos" required>
              <input
                type="number"
                {...register('floors', { required: true, min: 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </FormField>

            <FormField label="Año de construcción" required>
              <input
                type="number"
                {...register('yearBuilt', { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </FormField>

            <FormField label="Amueblado">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('furnished')}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="text-gray-700">Sí</span>
              </div>
            </FormField>
          </FormSection>

          <FormSection title="Precio" columns={2}>
            <FormField label="Renta mensual" required>
              <input
                type="text"
                {...register('rent', { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ej. $3,200"
              />
            </FormField>
          </FormSection>

          <FormSection title="Descripción" columns={1}>
            <FormField label="Descripción de la propiedad" required>
              <textarea
                {...register('description', { required: true })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe la propiedad..."
              />
            </FormField>
          </FormSection>

          <FormSection title="Amenidades" columns={1}>
            <TagInput
              label="Amenidades"
              tags={amenities}
              onTagsChange={setAmenities}
              placeholder="ej. Estacionamiento, Piscina, Gimnasio..."
              helpText="Presiona Enter o Agregar para añadir una amenidad"
            />
          </FormSection>

          <FormActions
            onCancel={() => navigate('/properties')}
            isEditing={isEditing}
            submitLabel={isEditing ? 'Guardar Cambios' : 'Crear Propiedad'}
            showDelete={isEditing}
            onDelete={handleDelete}
          />
        </form>
      </div>
    </div>
  );
}
