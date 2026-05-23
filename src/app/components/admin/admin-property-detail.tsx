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
  Edit,
  Trash2,
  History,
  Upload
} from 'lucide-react';
import { useProperty } from '../../contexts/property-context';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { useServices } from '../../services';
import { 
  BackButton, 
  StatusBadge, 
  InfoCard, 
  SidebarActions, 
  DocumentList,
  EmptyState 
} from '../shared';
import type { Document as Doc } from '../shared/detail/document-list';

export function AdminPropertyDetail() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  const { getPropertyById } = useProperty();
  const { document: documentService } = useServices();
  
  const property = id ? getPropertyById(id) : undefined;

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
      })

    return () => { cancelled = true; };
  }, [property?.id, documentService]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !property?.id) return;
    try {
      await documentService.uploadDocument('PROPERTY', property.id, file);
      const data = await documentService.getDocuments('PROPERTY', property.id);
      setDocuments(
        data.map((d) => ({
          id: d.id,
          name: d.name,
          size: d.size < 1024 ? `${d.size} B` : d.size < 1024 * 1024 ? `${(d.size / 1024).toFixed(1)} KB` : `${(d.size / (1024 * 1024)).toFixed(1)} MB`,
          type: d.contentType,
        }))
      );
    } catch (err) {
      alert('Error al subir el archivo: ' + (err instanceof Error ? err.message : 'desconocido'));
    }
  };

  const handleDownload = async (doc: { name: string; size: string; type?: string; id?: string | number }) => {
    try {
      await documentService.downloadDocument(doc.id!);
    } catch (err) {
      console.error('Error descargando:', err);
    }
  };

  const handleDelete = async (doc: { name: string; size: string; type?: string; id?: string | number }) => {
    try {
      await documentService.deleteDocument(doc.id!);
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id!));
    } catch (err) {
      alert('Error al eliminar el archivo');
    }
  };

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
              {property.amenities.map((amenity, index) => (
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
          {property.tenantName ? (
            <InfoCard
              title="Inquilino Actual"
              icon={User}
              items={[
                { label: 'Nombre', value: property.tenantName },
                { label: 'Estado', value: 'Inquilino activo' },
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
              title="Estado"
              icon={AlertCircle}
              items={[
                { label: 'Disponibilidad', value: 'Lista para arrendar' },
              ]}
            >
              <button 
                onClick={() => navigate(`/contratos/nuevo`)}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary-hover transition-colors font-medium"
              >
                Crear Contrato
              </button>
            </InfoCard>
          )}

          <DocumentList
            title="Documentos"
            documents={documents}
            onDownload={handleDownload}
            onDelete={handleDelete}
          />

          <div className="bg-card rounded-lg shadow-sm border border-border p-4">
            <label className="flex items-center gap-2 text-primary hover:text-primary-muted-foreground cursor-pointer font-medium">
              <Upload className="w-4 h-4" />
              <span>Subir documento</span>
              <input type="file" className="hidden" onChange={handleUpload} />
            </label>
            <p className="text-xs text-muted-foreground mt-1">Máx. 4MB. Imágenes, PDF, Word, Excel o TXT.</p>
          </div>

          <SidebarActions
            title="Acciones"
            actions={[
              { 
                label: 'Editar Propiedad', 
                icon: Edit, 
                onClick: () => navigate(`/propiedades/${property.id}/editar`), 
                variant: 'primary' 
              },
              { 
                label: 'Ver Historial', 
                icon: History, 
                onClick: () => console.log('Ver historial'), 
                variant: 'secondary' 
              },
              { 
                label: 'Eliminar Propiedad', 
                icon: Trash2, 
                onClick: () => console.log('Eliminar'), 
                variant: 'danger' 
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
