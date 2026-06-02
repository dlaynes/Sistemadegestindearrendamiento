import { useState, useEffect } from 'react';
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
  AlertCircle,
} from 'lucide-react';
import { useProperty } from '../../contexts/property-context';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import {
  BackButton,
  StatusBadge,
  InfoCard,
  DocumentList,
  EmptyState,
} from '../shared';
import type { Document as Doc } from '../shared/detail/document-list';
import { Spinner } from '../shared/ui/spinner';

export function InquilinoPropertyDetail() {
  const { id } = useParams();
  const { getPropertyById } = useProperty();
  const property = id ? getPropertyById(id) : undefined;
  const navigate = useRoleNavigation();

  const [documents, setDocuments] = useState<Doc[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  // Tenant cannot upload/delete; documents are read-only.
  useEffect(() => {
    if (!property?.id) {
      setIsLoadingDocs(false);
      return;
    }
    setDocuments([]);
    setIsLoadingDocs(false);
  }, [property?.id]);

  if (!property) {
    return (
      <div className="space-y-6">
        <BackButton onClick={() => navigate('/propiedades')} label="Volver a propiedades" />
        <EmptyState
          icon={Building2}
          title="Propiedad no encontrada"
          description="La propiedad que buscas no existe o ya no está disponible"
          action={{
            label: 'Volver a Propiedades',
            onClick: () => navigate('/propiedades'),
          }}
        />
      </div>
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

      <div className="rounded-xl border border-border-subtle bg-card p-6 shadow-elev-xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-h1 font-semibold text-foreground">{property.name}</h1>
            <div className="mt-1 flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>{property.address}</span>
            </div>
          </div>
          <StatusBadge status={property.status} type="property" size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
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

          {property.amenities.length > 0 && (
            <InfoCard
              title="Amenidades"
              icon={CheckCircle}
              columns={2}
              items={[]}
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </InfoCard>
          )}

          <InfoCard
            title="Detalles Adicionales"
            icon={FileText}
            items={additionalDetails}
          />
        </div>

        <div className="space-y-6">
          {property.tenantName ? (
            <InfoCard
              title="Inquilino Actual"
              icon={User}
              items={[
                { label: 'Nombre', value: property.tenantName },
                { label: 'Estado', value: 'Inquilino activo' },
              ]}
            />
          ) : (
            <InfoCard
              title="Estado"
              icon={AlertCircle}
              items={[{ label: 'Disponibilidad', value: 'Lista para arrendar' }]}
            />
          )}

          {isLoadingDocs ? (
            <div className="flex items-center justify-center rounded-xl border border-border-subtle bg-card p-12 shadow-elev-xs">
              <Spinner size="md" label="Cargando documentos" />
            </div>
          ) : (
            <DocumentList
              title="Documentos"
              documents={documents}
            />
          )}
        </div>
      </div>
    </div>
  );
}
