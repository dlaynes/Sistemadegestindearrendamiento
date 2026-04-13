import { AlertCircle, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import { AlertType } from '../../types/alert-type';

interface AlertBoxProps {
  message: string;
  type: AlertType;
  title?: string;
  icon?: React.ReactNode;
}

export function AlertBox({ message, type, title, icon }: AlertBoxProps) {
  // Mapear tipos de alerta a sus colores y componentes de icono
  const config: Record<AlertType, { bg: string; border: string; text: string; iconComponent: typeof AlertCircle }> = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      iconComponent: CheckCircle,
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconComponent: XCircle,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      iconComponent: Info,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      iconComponent: AlertTriangle,
    },
  };

  const settings = config[type] || config.info;
  const IconComponent = settings.iconComponent;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg ${settings.bg} border ${settings.border}`}>
      <IconComponent className={`w-5 h-5 flex-shrink-0 ${settings.text}`} />
      <div className="flex-1">
        {title && (
          <p className={`text-sm font-semibold mb-1 ${settings.text}`}>
            {title}
          </p>
        )}
        <p className={`text-sm ${settings.text}`}>
          {message}
        </p>
      </div>
    </div>
  );
}