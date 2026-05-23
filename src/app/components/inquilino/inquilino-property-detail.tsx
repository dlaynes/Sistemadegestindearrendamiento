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
import { useServices } from '../../services';
import { 
  BackButton, 
  StatusBadge, 
  InfoCard, 
  DocumentList,
  EmptyState 
} from '../shared';
import type { Document as Doc } from '../shared/detail/document-list';

export function InquilinoPropertyDetail() {
  const { id } = useParams();
  const { getPropertyById } = useProperty();
  const property = id ? getPropertyById(id) : undefined;
  const navigate = useRoleNavigation();
  
  const { document: documentService } = useServices();

  const [documents, setDocuments] = useState<Doc[]>([]);

  useEffect(() => {
    if (!property?.id) return;
    let cancelled = false;
    documentService
      .getDocuments('PROPERTY', property.id)
      .then((data) => {
        if (!cancelled) {
          setDocuments(
            data.map((d) => ({
              id: d.id,
              name: d.name,
              size: d.size < 1024 ? `${d.size} B` : d.size < 1024 * 1024 ? `${(d.size / 1024).toFixed(1)} KB` : `${(d.size / (1024 * 1024)).toFixed(1)} MB`,
              type: d.contentType,
            }))
          );
        }
      })
      .catch(() => {
        if (!cancelled) setDocuments([]);
      });
    return () => { cancelled = true; };
  }, [property?.id, documentService]);

  const handleDownload = async (doc: { name: string; size: string; type?: string; id?: string | number }) => {
    try {
      await documentService.downloadDocument(doc.id!);
    } catch (err) {
      console.error('Error descargando:', err);
    }
  };

  if (!property) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <EmptyState
        icon={Building2}
        title="Propiedad no encontrada"
        description="La propiedad que buscas no existe"
        action={{
          label: 'Volver a Propiedades',
          onClick: () => navigate('/propiedades'),
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

      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">{property.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
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
              {(property.amenities || []).map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="text-foreground">{amenity}</span>
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
                className="w-full bg-primary-muted text-primary-muted-foreground py-2 rounded-lg hover:bg-primary-muted transition-colors font-medium"
              >
                Ver Contrato
              </button>
            </InfoCard>
          ) : (
            <InfoCard
              title="Información"
              icon={AlertCircle}
              items={[
                { label: 'Estado', value: 'Propiedad disponible' },
              ]}
            />
          )}

          <DocumentList
            title="Documentos"
            documents={documents}
            onDownload={handleDownload}
          />
        </div>
      </div>
    </div>
  );
}
