import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { 
  User, 
  ArrowLeft,
  Save,
  Building2
} from 'lucide-react';
import type { User as UserType } from '../../types';
import { useServices } from '../../services';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { PageHeader } from '../shared/dashboard/page-header';

export function AdminUserForm() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  const isEditing = !!id;
  const { auth: authService } = useServices();
  
  const [user, setUser] = useState<(UserType & { properties?: string[] }) | null>(null);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    if (!isEditing || !id) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    authService
      .getById(id)
      .then((data) => {
        if (!cancelled) setUser(data as (UserType & { properties?: string[] }) | null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [id, isEditing, authService]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UserType>({
    defaultValues: {
      role: 'arrendador',
      status: 'activo',
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        properties: user.properties || [],
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserType) => {
    const formData = {
      ...data,
      avatar: data.name?.substring(0, 2).toUpperCase(),
    };

    try {
      if (isEditing && id) {
        await authService.updateUser(id, formData);
      } else {
        // Note: backend create endpoint exists but is not wired in ApiAuthService yet
        console.log('Creando usuario:', formData);
      }
      navigate('/usuarios');
    } catch (err) {
      console.error('Error guardando usuario:', err);
    }
  };

  const userRoles = [
    'administrador',
    'arrendador',
    'inquilino'
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/usuarios')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver</span>
          </button>
        </div>
        <p className="text-muted-foreground">Cargando usuario...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/usuarios')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Volver</span>
        </button>
      </div>

      <div className="bg-card rounded-lg shadow-sm border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary-muted p-3 rounded-lg">
            <User className="w-6 h-6 text-primary" />
          </div>
          <PageHeader title={isEditing ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
            subtitle={isEditing ? 'Modifica la información del usuario' : 'Completa los datos del nuevo usuario'} size="sm" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'El nombre es requerido' })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="ej. Juan Pérez"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">
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
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="ej. maria@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Rol y Estado</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rol del usuario *
                </label>
                <select
                  {...register('role', { required: 'El rol es requerido' })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <p className="mt-1 text-sm text-destructive">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Estado del usuario
                </label>
                <select
                  {...register('status')}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Propiedades Asignadas</h3>
            <div className="space-y-4">
              {isEditing && user ? (
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Propiedades actuales asignadas al usuario:</p>
                  {user.properties && user.properties.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.properties.map((propId) => (
                        <div
                          key={propId}
                          className="flex items-center gap-2 px-3 py-2 bg-primary-muted text-primary-muted-foreground rounded-lg"
                        >
                          <Building2 className="w-4 h-4 text-primary" />
                          <span className="font-medium">#{propId}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">No hay propiedades asignadas</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    Nota: Las propiedades asignadas se gestionan desde el panel de arrendador.
                  </p>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  <p className="mt-2 text-xs text-muted-foreground">
                    Nota: Para asignar propiedades a nuevos usuarios, ingresa al panel de arrendador y crea las propiedades desde allí.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => navigate('/usuarios')}
              className="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium"
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
