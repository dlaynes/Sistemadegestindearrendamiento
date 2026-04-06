import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FileText, Calendar, Building2, Clock } from 'lucide-react';

// Para inquilinos, solo mostrar su contrato actual
const mockContracts = [
  {
    id: 3,
    tenant: 'Yo (María García)',
    property: 'Apartamento Vista Mar #103',
    startDate: '2025-09-01',
    endDate: '2026-03-01',
    duration: '6 meses',
    monthlyRent: 2800,
    deposit: 5600,
    status: 'activo',
  },
];

export function InquilinoContracts() {
  const navigate = useNavigate();

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
          <h1 className="text-3xl font-semibold text-gray-900">Mi Contrato</h1>
          <p className="text-gray-600 mt-1">Información de tu contrato de arrendamiento</p>
        </div>
      </div>

      {/* Contract Card */}
      <div className="space-y-4">
        {mockContracts.map((contract) => {
          const daysLeft = getDaysUntilExpiration(contract.endDate);
          const isExpiringSoon = daysLeft <= 90;

          return (
            <div key={contract.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">Contrato #{contract.id.toString().padStart(4, '0')}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        <span>{contract.property}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  Activo
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Inicio</p>
                  <p className="font-medium text-gray-900">{contract.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Finalización</p>
                  <p className="font-medium text-gray-900">{contract.endDate}</p>
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
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    Tu contrato vence en {Math.abs(daysLeft)} días {daysLeft < 0 ? '(vencido)' : ''}
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium" onClick={() => navigate(`/contracts/${contract.id}`)}>
                  Ver Detalles
                </button>
                <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                  Descargar Contrato
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Información Importante</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• El pago de la renta debe realizarse dentro de los primeros 5 días del mes</li>
          <li>• Puedes ver el historial de pagos en la sección de detalles del contrato</li>
          <li>• Para solicitar renovación, contacta con tu arrendador</li>
        </ul>
      </div>
    </div>
  );
}
