import { useParams } from 'react-router';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  BedDouble, 
  Bath, 
  Maximize, 
  User,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useProperty } from '../../contexts/property-context';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { 
  BackButton, 
  StatusBadge, 
  InfoCard, 
  DocumentList,
  EmptyState 
} from '../shared';


const mockDocuments = [
  { name: 'Contrato de arrendamiento.pdf', size: '1.5 MB' },
  { name: 'Reglamento interno.pdf', size: '320 KB' },
];

export function InquilinoPropertyDetail() {
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

  const mainInfoItems = [
    { label: 'Dirección', value: property.address, icon: MapPin },
    { label: 'Renta Mensual', value: property.rent, icon: DollarSign },
    { label: 'Habitaciones', value: `${property.bedrooms} habitaciones`, icon: BedDouble },
    { label: 'Baños', value: `${property.bathrooms} baños`, icon: Bath },
    { label: 'Área', value: property.area, icon: Maximize },
    { label: 'Tipo', value: property.type, icon: Building2 },
  ];

  const additionalDetails = [
    { label: 'Pisos', value: property.floors },
    { label: 'Amueblado', value: property.furnished ? 'Sí' : 'No' },
    { label: 'Año de construcción', value: property.yearBuilt },
    { label: 'Estado', value: <StatusBadge status={property.status} type="property" /> },
  ];

  return (
    <div className="space-y-6">
      <BackButton onClick={() => navigate('/propiedades')} label="Volver a propiedades" />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">{property.name}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{property.address}</span>
            </div>
          </div>
          <StatusBadge status={property.status} type="property" size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard
            title="Información Principal"
            icon={Building2}
            items={mainInfoItems}
          />

          <InfoCard
            title="Descripción"
            icon={Calendar}
            items={[{ label: 'Detalles', value: property.description }]}
            columns={1}
          />

          <InfoCard
            title="Amenidades"
            icon={CheckCircle}
            columns={2} items={[]}          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </InfoCard>

          <InfoCard
            title="Detalles Adicionales"
            icon={FileText}
            items={additionalDetails}
          />
        </div>

        <div className="space-y-6">
          {property.status === 'ocupado' ? (
            <InfoCard
              title="Mi Arriendo"
              icon={User}
              items={[
                { label: 'Estado', value: 'Arriendo activo' },
                { label: 'Inquilino', value: property.tenantName || 'Yo' },
              ]}
            >
              <button 
                onClick={() => navigate(`/contratos`)}
                className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium"
              >
                Ver Contrato
              </button>
            </InfoCard>
          ) : (
            <InfoCard
              title="Información"
              icon={AlertCircle}
              items={[
                { label: 'Disponibilidad', value: 'Disponible para arriendo' },
              ]}
            >
              <button 
                onClick={() => navigate(`/contratos/nuevo`)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Solicitar Visita
              </button>
            </InfoCard>
          )}

          <DocumentList
            title="Documentos"
            documents={mockDocuments}
            onView={(doc) => console.log('View:', doc)}
            onDownload={(doc) => console.log('Download:', doc)}
          />
        </div>
      </div>
    </div>
  );
}
