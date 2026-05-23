import { useState, useEffect } from 'react';
import { Plus, Trash2, Building2, Edit2Icon } from 'lucide-react';
import type { User } from '../../types';
import { useServices } from '../../services';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { PageHeader } from '../shared/dashboard/page-header';

export function AdminUsers() {
  const navigate = useRoleNavigation();
  const { auth: authService } = useServices();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm] = useState('');
  const [roleFilter] = useState<'all' | 'administrador' | 'arrendador' | 'inquilino'>('all');
  const [statusFilter] = useState<'all' | 'activo' | 'inactivo'>('all');

  useEffect(() => {
    let cancelled = false;
    authService
      .getAllUsers()
      .then((data) => {
        if (!cancelled) {
          setUsers(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [authService]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getUserRoleBadge = (role: string) => {
    const badges = {
      administrador: { bg: 'bg-destructive-muted', text: 'text-destructive-muted-foreground', label: 'Administrador' },
      arrendador: { bg: 'bg-primary-muted', text: 'text-primary-muted-foreground', label: 'Arrendador' },
      inquilino: { bg: 'bg-success-muted', text: 'text-success-muted-foreground', label: 'Inquilino' },
    };
    return badges[role as keyof typeof badges] || {};
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <PageHeader title='Usuarios' subtitle='Administra los usuarios del sistema' size='md' />
        <button
          onClick={() => navigate('/usuarios/nuevo')}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Agregar Usuario
        </button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg shadow-sm border border-border">
        <div className="flex flex-wrap gap-4 p-4">
            <div className='flex items-center'>
                <label htmlFor="role-filter" className="mr-2 text-sm">Rol:</label>
                <select id="role-filter" className="p-2 border rounded-md focus:ring-primary focus:border-primary">
                    <option>Todos los roles</option>
                    <option>Administrador</option>
                    <option>Arrendador</option>
                    <option>Inquilino</option>
                </select>
            </div>
            <div className='flex items-center'>
                <label htmlFor="status-filter" className="mr-2 text-sm">Estado:</label>
                <select id="status-filter" className="p-2 border rounded-md focus:ring-primary focus:border-primary">
                    <option>Todos los estados</option>
                    <option>Activo</option>
                    <option>Inactivo</option>
                </select>
            </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-border">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-muted">
                <tr className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Rol</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Propiedades</th>
                    <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody className="bg-card divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                        const roleBadge = getUserRoleBadge(user.role);
                        const statusBadge = user.status === 'activo' ? 'bg-success-muted text-success-muted-foreground' : 'bg-warning-muted text-warning-muted-foreground';
                        const propCount = user.properties?.length || 0;

                        return (
                            <tr key={user.id} className="hover:bg-muted transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roleBadge.bg} ${roleBadge.text}`}>
                                        {roleBadge.label}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge}`}>
                                        {user.status === 'activo' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                                    {propCount > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {user.properties?.map((propId) => (
                                                <span key={propId} className="px-2 py-0.5 bg-primary-muted text-primary-muted-foreground text-xs rounded-full">
                                                    #{typeof propId === 'number' ? propId : parseInt(propId)}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground italic">Sin propiedades</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => navigate(`/usuarios/${user.id}`)}
                                            className="text-primary hover:text-primary-hover transition-colors"
                                            title="Ver detalles"
                                        >
                                            <Edit2Icon className="w-5 h-5" />
                                        </button>
                                        {user.role !== 'administrador' ? <button
                                            onClick={() => navigate(`/usuarios/${user.id}/propiedades`)}
                                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                            title="Ver propiedades"
                                        >
                                            <Building2 className="w-5 h-5" />
                                        </button> : null}
                                        <button
                                            className="text-destructive hover:text-destructive-muted-foreground transition-colors"
                                            title="Eliminar usuario"
                                            onClick={() => {/* Lógica de eliminación */}}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                            No se encontraron usuarios que cumplan con los filtros seleccionados.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
