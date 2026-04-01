import { useParams, useNavigate } from 'react-router';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  BedDouble, 
  Bath, 
  Maximize, 
  ArrowLeft,
  User,
  FileText,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

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
  {
    id: 2,
    name: 'Casa Residencial #102',
    address: 'Av. Los Pinos 456, Zona Norte',
    type: 'Casa',
    bedrooms: 3,
    bathrooms: 2,
    area: '120 m²',
    price: 4500,
    status: 'ocupado',
    tenant: 'Ana Martínez',
    description: 'Amplia casa en zona residencial tranquila y segura. Ideal para familias, con jardín privado y espacio para mascotas. Cercana a escuelas y centros comerciales.',
    amenities: ['Jardín', 'Garaje 2 autos', 'Cuarto de lavado', 'Terraza', 'Sistema de seguridad'],
    yearBuilt: 2015,
    floors: 2,
    furnished: false,
  },
  {
    id: 3,
    name: 'Apartamento Vista Mar #103',
    address: 'Malecón 789, Playa',
    type: 'Apartamento',
    bedrooms: 1,
    bathrooms: 1,
    area: '55 m²',
    price: 2800,
    status: 'ocupado',
    tenant: 'María García',
    description: 'Acogedor apartamento con vista directa al mar. Perfecto para profesionales o parejas que buscan tranquilidad y belleza natural. A pasos de la playa.',
    amenities: ['Vista al mar', 'Piscina compartida', 'Gimnasio', 'Seguridad 24/7', 'Estacionamiento'],
    yearBuilt: 2020,
    floors: 1,
    furnished: true,
  },
  {
    id: 4,
    name: 'Estudio Moderno #104',
    address: 'Calle Comercial 321, Centro',
    type: 'Estudio',
    bedrooms: 1,
    bathrooms: 1,
    area: '45 m²',
    price: 2200,
    status: 'disponible',
    tenant: null,
    description: 'Estudio completamente renovado con diseño minimalista y funcional. Ideal para estudiantes o profesionales jóvenes. Ubicación céntrica con fácil acceso a todo.',
    amenities: ['Cocina americana', 'Internet fibra óptica', 'Lavandería compartida', 'Espacio de coworking'],
    yearBuilt: 2022,
    floors: 1,
    furnished: true,
  },
  {
    id: 5,
    name: 'Casa Familiar #201',
    address: 'Residencial Las Flores 555',
    type: 'Casa',
    bedrooms: 4,
    bathrooms: 3,
    area: '180 m²',
    price: 5500,
    status: 'ocupado',
    tenant: 'Laura Gómez',
    description: 'Espaciosa casa familiar en exclusivo residencial privado. Cuenta con todas las comodidades para una familia grande, incluyendo áreas de entretenimiento y estudio.',
    amenities: ['Jardín amplio', 'Piscina privada', 'Garaje 3 autos', 'Cuarto de servicio', 'Sistema domótico'],
    yearBuilt: 2019,
    floors: 2,
    furnished: false,
  },
  {
    id: 6,
    name: 'Loft Industrial #205',
    address: 'Zona Industrial 234',
    type: 'Loft',
    bedrooms: 2,
    bathrooms: 1,
    area: '95 m²',
    price: 3800,
    status: 'disponible',
    tenant: null,
    description: 'Loft de estilo industrial con techos altos y amplios ventanales. Espacio versátil perfecto para creativos y profesionales independientes que buscan algo único.',
    amenities: ['Techos altos (4m)', 'Espacio abierto', 'Luz natural abundante', 'Estacionamiento', 'Pet-friendly'],
    yearBuilt: 2017,
    floors: 1,
    furnished: false,
  },
];

export function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const property = mockProperties.find(p => p.id === Number(id));

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Building2 className="w-16 h-16 text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-900">Propiedad no encontrada</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Volver a propiedades</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">{property.name}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{property.address}</span>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
            property.status === 'ocupado'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {property.status === 'ocupado' ? 'Ocupado' : 'Disponible'}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-6 h-6 text-blue-600" />
          <span className="text-3xl font-bold text-gray-900">${property.price.toLocaleString()}</span>
          <span className="text-gray-600">/mes</span>
        </div>

        {/* Image Placeholder */}
        <div className="h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
          <Building2 className="w-32 h-32 text-white opacity-30" />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BedDouble className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Habitaciones</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{property.bedrooms}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bath className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Baños</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{property.bathrooms}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Maximize className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Área</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{property.area}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Año</span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{property.yearBuilt}</p>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenidades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {property.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles Adicionales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tipo de propiedad</p>
                <p className="font-semibold text-gray-900">{property.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Pisos</p>
                <p className="font-semibold text-gray-900">{property.floors}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Amueblado</p>
                <p className="font-semibold text-gray-900">{property.furnished ? 'Sí' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Año de construcción</p>
                <p className="font-semibold text-gray-900">{property.yearBuilt}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Tenant */}
          {property.tenant ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Inquilino Actual</h2>
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{property.tenant}</p>
                  <p className="text-sm text-gray-600">Inquilino activo</p>
                </div>
              </div>
              <button className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                Ver Contrato
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Estado</h2>
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-gray-100 p-3 rounded-full">
                  <AlertCircle className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Disponible</p>
                  <p className="text-sm text-gray-600">Lista para arrendar</p>
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Crear Contrato
              </button>
            </div>
          )}

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Documentos</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <FileText className="w-5 h-5 text-gray-600" />
                <div className="text-left flex-1">
                  <p className="font-medium text-gray-900 text-sm">Ficha técnica</p>
                  <p className="text-xs text-gray-600">PDF - 245 KB</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <FileText className="w-5 h-5 text-gray-600" />
                <div className="text-left flex-1">
                  <p className="font-medium text-gray-900 text-sm">Título de propiedad</p>
                  <p className="text-xs text-gray-600">PDF - 1.2 MB</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <FileText className="w-5 h-5 text-gray-600" />
                <div className="text-left flex-1">
                  <p className="font-medium text-gray-900 text-sm">Inspección técnica</p>
                  <p className="text-xs text-gray-600">PDF - 876 KB</p>
                </div>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones</h2>
            <div className="space-y-2">
              <button 
                onClick={() => navigate(`/properties/${property.id}/edit`)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Editar Propiedad
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Ver Historial
              </button>
              <button className="w-full bg-red-50 text-red-700 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium">
                Eliminar Propiedad
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}