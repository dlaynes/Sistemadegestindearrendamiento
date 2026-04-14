import { useState } from 'react';
import { Plus, Trash2, Mail as MailIcon, Building2, Edit2Icon } from 'lucide-react';
import { mockUsers } from '../../contexts/auth-context';
import { useRoleNavigation } from '../../hooks/use-role-navigation';

export function AdminUsers() {
  const navigate = useRoleNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'administrador' | 'arrendador' | 'inquilino'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'activo' | 'inactivo'>('all');

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getUserRoleBadge = (role: string) => {
    const badges = {
      administrador: { bg: 'bg-red-100', text: 'text-red-700', label: 'Administrador' },
      arrendador: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Arrendador' },
      inquilino: { bg: 'bg-green-100', text: 'text-green-700', label: 'Inquilino' },
    };
    return badges[role as keyof typeof badges] || {};
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">Usuarios</h1>
          <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
        </div>
        <button 
          onClick={() => navigate('/users/new')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Agregar Usuario
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap gap-4 p-4">
            <div className='flex items-center'>
                <label htmlFor="role-filter" className="mr-2 text-sm">Rol:</label>
                <select id="role-filter" className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option>Todos los roles</option>
                    <option>Administrador</option>
                    <option>Arrendador</option>
                    <option>Inquilino</option>
                </select>
            </div>
            <div className='flex items-center'>
                <label htmlFor="status-filter" className="mr-2 text-sm">Estado:</label>
                <select id="status-filter" className="p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500">
                    <option>Todos los estados</option>
                    <option>Activo</option>
                    <option>Inactivo</option>
                </select>
            </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-3">Nombre</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Rol</th>
                    <th className="px-6 py-3">Estado</th>
                    <th className="px-6 py-3">Propiedades</th>
                    <th className="px-6 py-3 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                        const roleBadge = getUserRoleBadge(user.role);
                        const statusBadge = user.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
                        const propCount = user.properties?.length || 0;
                        
                        return (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${roleBadge.bg} ${roleBadge.text}`}>
                                        {roleBadge.label}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge}`}>
                                        {user.status === 'activo' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {propCount > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                            {user.properties?.map((propId) => (
                                                <span key={propId} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
                                                    #{Math.abs(parseInt(propId))}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 italic">Sin propiedades</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-3">
                                        <button 
                                            onClick={() => navigate(`/users/${user.id}`)}
                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                            title="Ver detalles"
                                        >
                                            <Edit2Icon className="w-5 h-5" />
                                        </button>
                                        {user.role !== 'administrador' ? <button 
                                            onClick={() => navigate(`/users/${user.id}/properties`)}
                                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                            title="Ver propiedades"
                                        >
                                            <Building2 className="w-5 h-5" />
                                        </button> : null}
                                        <button 
                                            className="text-red-600 hover:text-red-900 transition-colors"
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
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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