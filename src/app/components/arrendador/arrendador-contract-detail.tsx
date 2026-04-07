import { useParams, useNavigate } from 'react-router';
import { 
  FileText, 
  ArrowLeft,
  User,
  Building2,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Mail,
  Phone,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';

// Mock data - debería coincidir con el de contracts.tsx
const mockContracts = [
  {
    id: 1,
    tenant: 'Juan Pérez',
    tenantEmail: 'juan.perez@email.com',
    tenantPhone: '+1 (555) 123-4567',
    property: 'Apartamento Centro #101',
    propertyAddress: 'Calle Principal 123, Centro',
    startDate: '2025-06-01',
    endDate: '2026-06-01',
    duration: '12 meses',
    monthlyRent: 3200,
    deposit: 6400,
    status: 'activo',
    paymentDay: 5,
    terms: [
      'El arrendatario se compromete a pagar la renta mensual puntualmente.',
      'No se permiten mascotas sin autorización previa del arrendador.',
      'El arrendatario debe mantener la propiedad en buen estado.',
      'Cualquier modificación a la propiedad requiere aprobación escrita.',
      'El depósito será devuelto al finalizar el contrato si no hay daños.'
    ],
    paymentHistory: [
      { month: 'Marzo 2026', amount: 3200, status: 'pagado', date: '2026-03-04' },
      { month: 'Febrero 2026', amount: 3200, status: 'pagado', date: '2026-02-03' },
      { month: 'Enero 2026', amount: 3200, status: 'pagado', date: '2026-01-04' },
    ]
  },
  {
    id: 2,
    tenant: 'Ana Martínez',
    tenantEmail: 'ana.martinez@email.com',
    tenantPhone: '+1 (555) 234-5678',
    property: 'Casa Residencial #102',
    propertyAddress: 'Av. Los Pinos 456, Zona Norte',
    startDate: '2025-08-15',
    endDate: '2027-08-15',
    duration: '24 meses',
    monthlyRent: 4500,
    deposit: 9000,
    status: 'activo',
    paymentDay: 15,
    terms: [
      'El arrendatario se compromete a pagar la renta mensual puntualmente.',
      'Se permite máximo 2 mascotas pequeñas.',
      'El mantenimiento del jardín es responsabilidad del arrendatario.',
      'El arrendatario debe contratar un seguro de contenidos.',
      'El depósito será devuelto al finalizar el contrato si no hay daños.'
    ],
    paymentHistory: [
      { month: 'Marzo 2026', amount: 4500, status: 'pagado', date: '2026-03-14' },
      { month: 'Febrero 2026', amount: 4500, status: 'pagado', date: '2026-02-14' },
      { month: 'Enero 2026', amount: 4500, status: 'pagado', date: '2026-01-15' },
    ]
  },
  {
    id: 3,
    tenant: 'María García',
    tenantEmail: 'maria.garcia@email.com',
    tenantPhone: '+1 (555) 345-6789',
    property: 'Apartamento Vista Mar #103',
    propertyAddress: 'Malecón 789, Playa',
    startDate: '2025-09-01',
    endDate: '2026-03-01',
    duration: '6 meses',
    monthlyRent: 2800,
    deposit: 5600,
    status: 'activo',
    paymentDay: 1,
    terms: [
      'El arrendatario se compromete a pagar la renta mensual puntualmente.',
      'No se permiten fiestas o reuniones ruidosas.',
      'El uso de amenidades compartidas debe respetar el reglamento.',
      'Prohibido fumar dentro de la propiedad.',
      'El depósito será devuelto al finalizar el contrato si no hay daños.'
    ],
    paymentHistory: [
      { month: 'Marzo 2026', amount: 2800, status: 'vencido', date: null },
      { month: 'Febrero 2026', amount: 2800, status: 'pagado', date: '2026-02-02' },
      { month: 'Enero 2026', amount: 2800, status: 'pagado', date: '2026-01-01' },
    ]
  },
];

export function ArrendadorContractDetail() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  
  const contract = mockContracts.find(c => c.id === Number(id));

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <FileText className="w-16 h-16 text-gray-400" />
        <h2 className="text-2xl font-semibold text-gray-900">Contrato no encontrado</h2>
        <button
          onClick={() => navigate('/contratos')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>
    );
  }

  const getDaysUntilExpiration = (endDate: string) => {
    const today = new Date('2026-03-31');
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = getDaysUntilExpiration(contract.endDate);
  const isExpiringSoon = daysLeft <= 90;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/contratos')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Volver a contratos</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                Contrato #{contract.id.toString().padStart(4, '0')}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>Del {contract.startDate} al {contract.endDate}</span>
              </div>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            contract.status === 'activo'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {contract.status === 'activo' ? 'Activo' : 'Próximo a Vencer'}
          </span>
        </div>

        {isExpiringSoon && daysLeft > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="font-semibold text-yellow-800">Este contrato vence pronto</p>
              <p className="text-sm text-yellow-700">
                Quedan {daysLeft} días. Considera renovar o buscar nuevo inquilino.
              </p>
            </div>
          </div>
        )}

        {daysLeft < 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-semibold text-red-800">Contrato vencido</p>
              <p className="text-sm text-red-700">
                Este contrato venció hace {Math.abs(daysLeft)} días.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Parties Involved */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Partes Involucradas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tenant */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Inquilino</h3>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{contract.tenant}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{contract.tenantEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{contract.tenantPhone}</span>
                  </div>
                </div>
              </div>

              {/* Property */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Propiedad</h3>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{contract.property}</p>
                  <p className="text-sm text-gray-600">{contract.propertyAddress}</p>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Ver detalles de propiedad →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles Financieros</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <p className="text-sm text-gray-600">Renta Mensual</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">${contract.monthlyRent.toLocaleString()}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <p className="text-sm text-gray-600">Depósito</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">${contract.deposit.toLocaleString()}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <p className="text-sm text-gray-600">Día de Pago</p>
                </div>
                <p className="text-2xl font-bold text-gray-900">{contract.paymentDay}</p>
                <p className="text-xs text-gray-600">de cada mes</p>
              </div>
            </div>
          </div>

          {/* Contract Terms */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Términos y Condiciones</h2>
            <div className="space-y-3">
              {contract.terms.map((term, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{term}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Historial de Pagos</h2>
            </div>
            <div className="space-y-3">
              {contract.paymentHistory.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {payment.status === 'pagado' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{payment.month}</p>
                      <p className="text-sm text-gray-600">
                        {payment.date ? `Pagado el ${payment.date}` : 'Pago vencido'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${payment.amount.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      payment.status === 'pagado'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {payment.status === 'pagado' ? 'Pagado' : 'Vencido'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Duración</p>
                <p className="text-lg font-semibold text-gray-900">{contract.duration}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Días restantes</p>
                <p className="text-lg font-semibold text-gray-900">
                  {daysLeft > 0 ? `${daysLeft} días` : 'Vencido'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total pagado</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-gray-900">
                    ${(contract.paymentHistory.filter(p => p.status === 'pagado').length * contract.monthlyRent).toLocaleString()}
                  </p>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Pagos realizados</p>
                <p className="text-lg font-semibold text-gray-900">
                  {contract.paymentHistory.filter(p => p.status === 'pagado').length} de {contract.paymentHistory.length}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Download className="w-4 h-4" />
                Descargar PDF
              </button>
              <button className="w-full bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors font-medium">
                Renovar Contrato
              </button>
              <button 
                onClick={() => navigate(`/contracts/${contract.id}/edit`)}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Editar Contrato
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Enviar Recordatorio
              </button>
              <button className="w-full bg-red-50 text-red-700 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium">
                Terminar Contrato
              </button>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Documentos</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                <FileText className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Contrato firmado</p>
                  <p className="text-xs text-gray-600">PDF - 2.4 MB</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                <FileText className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Comprobante depósito</p>
                  <p className="text-xs text-gray-600">PDF - 156 KB</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
                <FileText className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Identificación inquilino</p>
                  <p className="text-xs text-gray-600">PDF - 892 KB</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}