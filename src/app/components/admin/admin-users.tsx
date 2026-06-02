import { useState, useEffect } from 'react';
import { Trash2, Building2, Edit2 } from 'lucide-react';
import type { User } from '../../types';
import { useServices } from '../../services';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import { PageHeader } from '../shared/dashboard/page-header';
import { DataTable } from '../shared/ui/data-table';
import { Spinner } from '../shared/ui/spinner';
import { RoleBadge } from '../shared/ui/role-badge';

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

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" label="Cargando usuarios" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuarios"
        subtitle="Administra los usuarios del sistema"
        size="md"
      />

      <DataTable
        columns={[
          {
            key: 'name',
            header: 'Nombre',
            render: (user) => <span className="font-medium">{user.name}</span>,
          },
          {
            key: 'email',
            header: 'Correo',
            cellClassName: 'text-muted-foreground',
            render: (user) => user.email,
          },
          {
            key: 'role',
            header: 'Rol',
            render: (user) => <RoleBadge role={user.role} />,
          },
          {
            key: 'status',
            header: 'Estado',
            render: (user) =>
              user.status === 'activo' ? (
                <span className="inline-flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
                  <span className="text-foreground">Activo</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-warning" aria-hidden="true" />
                  <span className="text-foreground">Inactivo</span>
                </span>
              ),
          },
          {
            key: 'properties',
            header: 'Propiedades',
            cellClassName: 'text-muted-foreground',
            render: (user) => {
              const ids = user.properties ?? [];
              if (ids.length === 0)
                return <span className="italic text-muted-foreground">Sin propiedades</span>;
              return (
                <div className="flex flex-wrap gap-1">
                  {ids.map((propId) => (
                    <span
                      key={propId}
                      className="rounded-full bg-primary-muted px-2 py-0.5 text-xs text-primary-muted-foreground"
                    >
                      #{typeof propId === 'number' ? propId : parseInt(propId)}
                    </span>
                  ))}
                </div>
              );
            },
          },
          {
            key: 'actions',
            header: 'Acciones',
            headerClassName: 'text-right',
            cellClassName: 'text-right',
            render: (user) => (
              <div className="inline-flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => navigate(`/usuarios/${user.id}`)}
                  className="text-primary transition-colors hover:text-primary-hover"
                  title="Ver detalles"
                  aria-label="Ver detalles del usuario"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                {user.role !== 'administrador' && (
                  <button
                    type="button"
                    onClick={() => navigate(`/usuarios/${user.id}/propiedades`)}
                    className="text-primary transition-colors hover:text-primary-hover"
                    title="Ver propiedades"
                    aria-label="Ver propiedades del usuario"
                  >
                    <Building2 className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="button"
                  className="text-destructive transition-colors hover:text-destructive-muted-foreground"
                  title="Eliminar usuario"
                  aria-label="Eliminar usuario"
                  onClick={() => {
                    /* Lógica de eliminación */
                  }}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ),
          },
        ]}
        rows={filteredUsers}
        rowKey={(user) => user.id}
        emptyMessage="No se encontraron usuarios que cumplan con los filtros seleccionados."
      />
    </div>
  );
}
