import { useState } from 'react';
import { FileText, Calendar, User, Building2, Plus, Clock } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';

const mockContracts = [
  {
    id: 1,
    tenant: 'Juan Pérez',
    property: 'Apartamento Centro #101',
    startDate: '2025-06-01',
    endDate: '2026-06-01',
    duration: '12 meses',
    monthlyRent: 3200,
    deposit: 6400,
    status: 'activo',
  },
  {
    id: 2,
    tenant: 'Ana Martínez',
    property: 'Casa Residencial #102',
    startDate: '2025-08-15',
    endDate: '2027-08-15',
    duration: '24 meses',
    monthlyRent: 4500,
    deposit: 9000,
    status: 'activo',
  },
  {
    id: 3,
    tenant: 'María García',
    property: 'Apartamento Vista Mar #103',
    startDate: '2025-09-01',
    endDate: '2026-03-01',
    duration: '6 meses',
    monthlyRent: 2800,
    deposit: 5600,
    status: 'activo',
  },
  {
    id: 4,
    tenant: 'Laura Gómez',
    property: 'Casa Familiar #201',
    startDate: '2024-12-01',
    endDate: '2026-12-01',
    duration: '24 meses',
    monthlyRent: 5500,
    deposit: 11000,
    status: 'activo',
  },
  {
    id: 5,
    tenant: 'Roberto Silva',
    property: 'Estudio Moderno #104',
    startDate: '2025-01-15',
    endDate: '2025-12-15',
    duration: '12 meses',
    monthlyRent: 2200,
    deposit: 4400,
    status: 'proximo_vencer',
  },
];

export function ArrendadorContracts() {
  const navigate = useRoleNavigation();
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'proximo_vencer'>('all');

  const filteredContracts = mockContracts.filter((contract) => {
    return statusFilter === 'all' || contract.status === statusFilter;
  });

  const getDaysUntilExpiration = (endDate: string) => {
    const today = new Date('2026-03-27');
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Contratos</h1>
          <p className="text-gray-600 mt-1">Administra los contratos de arrendamiento</p>
        </div>
        <button 
          onClick={() => navigate('/contracts/new')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Contrato
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Contratos Activos</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Próximos a Vencer</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Duración Promedio</p>
              <p className="text-2xl font-semibold text-gray-900">15.6 m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">Filtrar por estado:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setStatusFilter('activo')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'activo'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Activos
            </button>
            <button
              onClick={() => setStatusFilter('proximo_vencer')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'proximo_vencer'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Próximos a Vencer
            </button>
          </div>
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {filteredContracts.map((contract) => {
          const daysLeft = getDaysUntilExpiration(contract.endDate);
          const isExpiringSoon = daysLeft <= 90;

          return (
            <div key={contract.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Contrato #{contract.id.toString().padStart(4, '0')}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{contract.tenant}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span>{contract.property}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  contract.status === 'activo'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {contract.status === 'activo' ? 'Activo' : 'Próximo a Vencer'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Inicio</p>
                  <p className="font-medium text-gray-900">{contract.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Finalización</p>
                  <p className="font-medium text-gray-900">{contract.endDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Duración</p>
                  <p className="font-medium text-gray-900">{contract.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Renta Mensual</p>
                  <p className="font-medium text-gray-900">${contract.monthlyRent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Depósito</p>
                  <p className="font-medium text-gray-900">${contract.deposit.toLocaleString()}</p>
                </div>
              </div>

              {isExpiringSoon && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Vence en {daysLeft} días - Considera renovar o buscar nuevo inquilino
                  </span>
                </div>
              )}

              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium" onClick={() => navigate(`/contracts/${contract.id}`)}>
                  Ver Detalles
                </button>
                <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                  Renovar
                </button>
                <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                  Descargar PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}