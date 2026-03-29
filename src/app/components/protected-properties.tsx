import { useAuth } from '../contexts/auth-context';
import { Properties } from './properties';
import { ShieldAlert } from 'lucide-react';

export function ProtectedProperties() {
  const { user } = useAuth();

  const allowedRoles = ['administrador', 'arrendador'];
  
  if (user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Acceso Denegado</h2>
          <p className="text-gray-600 mb-6">
            No tienes permisos para acceder a esta sección.
          </p>
          <p className="text-sm text-gray-500">
            Tu rol: <span className="font-semibold">{user.role}</span>
          </p>
        </div>
      </div>
    );
  }

  return <Properties />;
}
