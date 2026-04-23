import { useParams } from 'react-router';
import { Building2 } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { useProperty } from '../../contexts/property-context';
import { 
  PageHeader, 
  BackButton, 
  InfoCard,
  EmptyState 
} from '../shared';


export function InquilinoPropertyForm() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  const { getPropertyById } = useProperty();
  
  const property = id ? getPropertyById(id) : undefined;

  if (!property) {
    return (
      <EmptyState
        icon={Building2}
        title="Propiedad no encontrada"
        description="La propiedad que buscas no existe"
        action={{
          label: "Volver a Propiedades",
          onClick: () => navigate('/propiedades')
        }}
      />
    );
  }

  const infoItems = [
    { label: 'Nombre', value: property.name },
    { label: 'Dirección', value: property.address },
    { label: 'Tipo', value: property.type },
    { label: 'Habitaciones', value: property.bedrooms },
    { label: 'Baños', value: property.bathrooms },
    { label: 'Área', value: `${property.area} m²` },
    { label: 'Renta Mensual', value: property.rent },
    { label: 'Año de Construcción', value: property.yearBuilt },
    { label: 'Pisos', value: property.floors },
    { label: 'Amueblado', value: property.furnished ? 'Sí' : 'No' },
  ];

  return (
    <div className="space-y-6">
      <BackButton onClick={() => navigate('/propiedades')} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          <PageHeader 
            title="Detalles de la Propiedad"
            subtitle="Información de tu propiedad actual"
            size="sm"
          />
        </div>

        <div className="space-y-6">
          <InfoCard
            title="Información de la Propiedad"
            icon={Building2}
            items={infoItems}
          />

          <InfoCard
            title="Descripción"
            icon={Building2}
            items={[{ label: 'Detalles', value: property.description }]}
            columns={1}
          />

          <InfoCard
            title="Amenidades"
            icon={Building2}
            columns={2}
          >
            <ul className="list-disc list-inside space-y-1">
              {property.amenities.map((amenity, index) => (
                <li key={index} className="text-gray-700">{amenity}</li>
              ))}
            </ul>
          </InfoCard>

          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600">
              Para modificar información de la propiedad, contacta a tu arrendador.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
