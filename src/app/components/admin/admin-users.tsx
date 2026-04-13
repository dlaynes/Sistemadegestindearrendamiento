import { useState } from 'react';
import { User, Shield, Plus, Search, Filter, Trash2, Mail as MailIcon, BuildingIcon } from 'lucide-react';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { mockUsers } from '../../contexts/auth-context';

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
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Agregar Usuario
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar usuarios por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los roles</option>
              <option value="administrador">Administradores</option>
              <option value="arrendador">Arrendadores</option>
              <option value="inquilino">Inquilinos</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const roleBadge = getUserRoleBadge(user.role);
          return (
            <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* User Header with Avatar */}
              <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                      {user.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.status === 'activo'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.status === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              {/* User Details */}
              <div className="p-5 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${roleBadge.bg} ${roleBadge.text}`}>
                    {roleBadge.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    Última conexión: {user.lastLogin}
                  </div>
                </div>

                {user.properties && user.properties.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Propiedades asignadas:</p>
                    <div className="flex flex-wrap gap-2">
                      {user.properties.map((propId) => (
                        <span key={propId} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          #{propId}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <button 
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-2 rounded hover:bg-blue-50 transition-colors"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    <MailIcon className="w-4 h-4" />
                    Ver Detalles
                  </button>

                  <button 
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-2 rounded hover:bg-blue-50 transition-colors"
                    onClick={() => navigate(`/users/${user.id}/properties`)}
                  >
                    <BuildingIcon className="w-4 h-4" />
                    Ver Propiedades
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Eliminar usuario"
                      onClick={() => navigate(`/users/${user.id}/edit`)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No se encontraron usuarios</h3>
          <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
}
