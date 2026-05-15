import { FileText, User, Building2, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { cn } from '../../ui/utils';
import { StatusBadge } from '../ui/status-badge';
import { getDaysUntilExpiration } from '../utils/date-utils';
import type { ContractListItem } from '../../../types';

export type { ContractListItem };

interface ContractCardProps {
  contract: ContractListItem;
  onView?: (contract: ContractListItem) => void;
  onEdit?: (contract: ContractListItem) => void;
  onDelete?: (contract: ContractListItem) => void;
  showActions?: boolean;
  className?: string;
}

export function ContractCard({
  contract,
  onView,
  onEdit,
  onDelete,
  showActions = false,
  className,
}: ContractCardProps) {
  const daysLeft = getDaysUntilExpiration(contract.endDate);
  const isExpiringSoon = daysLeft <= 90 && daysLeft > 0;

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
        'hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{contract.code}</h3>
            <p className="text-sm text-gray-500">{contract.property}</p>
          </div>
        </div>
        <StatusBadge status={contract.status} type="contract" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Inquilino</p>
            <p className="text-sm font-medium text-gray-900">{contract.tenantName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Propiedad</p>
            <p className="text-sm font-medium text-gray-900 truncate">{contract.property}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Vencimiento</p>
            <p className="text-sm font-medium text-gray-900">{contract.endDate}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Renta Mensual</p>
            <p className="text-sm font-medium text-gray-900">{contract.monthlyRent}</p>
          </div>
        </div>
      </div>
      
      {isExpiringSoon && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div className="flex-1">
            <p className="text-sm text-yellow-800">
              <strong>Próximo a vencer:</strong> El contrato vence en {daysLeft} días
            </p>
          </div>
        </div>
      )}
      
      {showActions && (onView || onEdit || onDelete) && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          {onView && (
            <button
              onClick={() => onView(contract)}
              className="flex-1 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
            >
              Ver Detalles
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(contract)}
              className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(contract)}
              className="flex-1 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              Eliminar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
