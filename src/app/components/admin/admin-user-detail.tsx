import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  Building2,
  Edit2,
  Mail,
  ShieldCheck,
  User as UserIcon,
  UserX,
} from 'lucide-react';
import { useServices } from '../../services';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import type { User as UserType } from '../../types';
import { PageHeader } from '../shared/dashboard/page-header';
import { InfoCard, SidebarActions } from '../shared/detail';
import { BackButton } from '../shared/ui/back-button';
import { EmptyState } from '../shared/ui/empty-state';
import { RoleBadge } from '../shared/ui/role-badge';
import { Spinner } from '../shared/ui/spinner';
import { StatusBadge } from '../shared/ui/status-badge';
import { toast } from 'sonner';

export function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  const { auth: authService } = useServices();

  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);
    authService
      .getById(id)
      .then((data) => {
        if (cancelled) return;
        if (!data) {
          setNotFound(true);
          setUser(null);
        } else {
          setUser(data);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setNotFound(true);
        setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, authService]);

  const handleToggleStatus = async () => {
    if (!user) return;
    const nextStatus = user.status === 'activo' ? 'inactivo' : 'activo';
    setIsTogglingStatus(true);
    try {
      const updated = await authService.updateUser(user.id, { status: nextStatus });
      setUser((prev) => (prev ? { ...prev, ...updated, status: nextStatus } : prev));
      toast.success(
        nextStatus === 'activo'
          ? 'Usuario reactivado'
          : 'Usuario desactivado',
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'No se pudo actualizar el estado',
      );
    } finally {
      setIsTogglingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Detalle de Usuario"
          subtitle={id ? `ID: ${id}` : undefined}
        />
        <div
          className="flex min-h-[40vh] items-center justify-center rounded-xl border border-border-subtle bg-card shadow-elev-xs"
          aria-live="polite"
        >
          <Spinner size="lg" label="Cargando usuario" />
        </div>
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className="space-y-6">
        <BackButton onClick={() => navigate('/usuarios')} label="Volver a usuarios" />
        <EmptyState
          icon={UserX}
          title="Usuario no encontrado"
          description="El usuario que buscas no existe o fue eliminado."
          action={{
            label: 'Volver a Usuarios',
            onClick: () => navigate('/usuarios'),
          }}
        />
      </div>
    );
  }

  const isInactive = user.status === 'inactivo' || user.status === 'suspendido';

  return (
    <div className="space-y-6">
      <BackButton onClick={() => navigate('/usuarios')} label="Volver a usuarios" />

      <PageHeader
        title={user.name}
        subtitle={user.email}
        action={<RoleBadge role={user.role} size="md" />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <InfoCard
            title="Información de la cuenta"
            icon={UserIcon}
            columns={2}
            items={[
              { label: 'Nombre', value: user.name, icon: UserIcon },
              { label: 'Correo', value: user.email, icon: Mail },
              {
                label: 'Rol',
                value: <RoleBadge role={user.role} size="sm" />,
                icon: ShieldCheck,
              },
              {
                label: 'Estado',
                value: <StatusBadge status={user.status} type="user" />,
                icon: ShieldCheck,
              },
              {
                label: 'ID',
                value: <span className="font-mono text-sm">{String(user.id)}</span>,
              },
              {
                label: 'Último acceso',
                value: user.lastLogin ?? 'Sin registros',
              },
            ]}
          />

          {user.role !== 'administrador' && (
            <InfoCard
              title="Propiedades asociadas"
              icon={Building2}
              items={[
                {
                  label: 'Cantidad',
                  value:
                    user.properties && user.properties.length > 0
                      ? `${user.properties.length} propiedades`
                      : 'Sin propiedades asignadas',
                },
              ]}
            >
              {user.properties && user.properties.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.properties.map((pid) => (
                    <span
                      key={String(pid)}
                      className="inline-flex items-center rounded-md border border-border-subtle bg-background px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      #{String(pid)}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Este usuario aún no tiene propiedades asignadas.
                </p>
              )}
            </InfoCard>
          )}
        </div>

        <div className="space-y-6">
          <SidebarActions
            title="Acciones"
            actions={[
              {
                label: 'Editar usuario',
                icon: Edit2,
                variant: 'primary',
                onClick: () => navigate(`/usuarios/${user.id}/editar`),
              },
              {
                label: isInactive ? 'Reactivar usuario' : 'Desactivar usuario',
                icon: UserX,
                variant: isInactive ? 'secondary' : 'danger',
                disabled: isTogglingStatus,
                onClick: handleToggleStatus,
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
