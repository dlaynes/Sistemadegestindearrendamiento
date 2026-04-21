import { useParams, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { 
  User, 
  ArrowLeft,
  Save,
  Mail,
  Building2
} from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { User as UserType } from '../../types/user';
import { PageHeader } from '../shared/dashboard/page-header';

// Mock data - debería coincidir con el de users.tsx
const mockUsers: UserType[] = [
  {
    id: '1',
    name: 'Admin Principal',
    email: 'admin@rentmanager.com',
    role: 'administrador',
    status: 'activo',
    lastLogin: '2026-04-12 10:30:00',
    avatar: 'AP',
    properties: ['1', '2', '5'],
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos@rentmanager.com',
    role: 'arrendador',
    status: 'activo',
    lastLogin: '2026-04-11 16:45:00',
    avatar: 'CR',
    properties: ['1', '2', '5'],
  },
  {
    id: '3',
    name: 'Juan Pérez',
    email: 'juan@email.com',
    role: 'inquilino',
    status: 'activo',
    lastLogin: '2026-04-10 09:15:00',
    avatar: 'JP',
    properties: ['1'],
  },
];

type UserFormData = {
  name: string;
  email: string;
  role: 'administrador' | 'arrendador' | 'inquilino';
  status: 'activo' | 'inactivo';
  properties: string[];
};

export function AdminUserForm() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  const isEditing = !!id;
  
  // Buscar el usuario si estamos editando
  const user = isEditing ? mockUsers.find(u => u.id === id) : null;

  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    defaultValues: isEditing && user ? {
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      properties: user.properties || [],
    } : {
      role: 'arrendador',
      status: 'activo',
    }
  });

  const onSubmit = (data: UserFormData) => {
    const formData = {
      ...data,
      avatar: data.name.substring(0, 2).toUpperCase(),
    };
    
    console.log(isEditing ? 'Actualizando usuario:' : 'Creando usuario:', formData);
    
    // Aquí iría la lógica para guardar en el backend
    // Por ahora solo simulamos y redirigimos
    navigate('/users');
  };

  const userRoles = [
    'administrador',
    'arrendador',
    'inquilino'
  ];

  // Obtener todas las propiedades existentes para mostrarlas en modo edición
  const allProperties = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Volver</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-lg">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <PageHeader title={isEditing ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
            subtitle={isEditing ? 'Modifica la información del usuario' : 'Completa los datos del nuevo usuario'} size="sm" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Básica */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'El nombre es requerido' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej. Juan Pérez"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'El correo es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Formato de correo inválido'
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ej. juan@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Rol y Estado */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rol y Estado</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol del usuario *
                </label>
                <select
                  {...register('role', { required: 'El rol es requerido' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona un rol</option>
                  {userRoles.map((role) => (
                    <option key={role} value={role}>
                      {role === 'administrador' ? 'Administrador' : 
                       role === 'arrendador' ? 'Arrendador' : 'Inquilino'}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del usuario
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Propiedades */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Propiedades Asignadas</h3>
            <div className="space-y-4">
              {/* Solo mostrar propiedades en modo edición, no permitir agregar en modo creación */}
              {isEditing && user ? (
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Propiedades actuales asignadas al usuario:</p>
                  {user.properties && user.properties.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.properties.map((propId) => (
                        <div
                          key={propId}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg"
                        >
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">#{propId}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No hay propiedades asignadas</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Nota: Las propiedades asignadas se gestionan desde el panel de arrendador.
                  </p>
                </div>
              ) : (
                // Modo creación: mostrar propiedades existentes disponibles pero deshabilitadas
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Propiedades disponibles en el sistema:</p>
                  <div className="flex flex-wrap gap-2">
                    {allProperties.map((propId) => (
                      <div
                        key={propId}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-400 rounded-lg border border-gray-200 cursor-not-allowed"
                      >
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">#{propId}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Nota: Para asignar propiedades a nuevos usuarios, ingresa al panel de arrendador y crea las propiedades desde allí.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}