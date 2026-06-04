import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Building2, UserX } from 'lucide-react';
import { useServices } from '../../services';
import { useProperty } from '../../contexts/property-context';
import { useRoleNavigation } from '../../hooks/use-role-navigation';
import type { Property } from '../../types/property';
import type { User } from '../../types';
import { PageHeader } from '../shared/dashboard/page-header';
import { PropertyCard } from '../shared/lists/property-card';
import { BackButton } from '../shared/ui/back-button';
import { EmptyState } from '../shared/ui/empty-state';
import { Spinner } from '../shared/ui/spinner';

type LoadState =
  | { kind: 'loading' }
  | { kind: 'not-found' }
  | { kind: 'ready'; user: User; properties: Property[] };

export function AdminUserProperties() {
  const { id } = useParams();
  const navigate = useRoleNavigation();
  const { auth: authService, property: propertyService } = useServices();
  const { getPropertyById } = useProperty();

  const [state, setState] = useState<LoadState>({ kind: 'loading' });

  useEffect(() => {
    if (!id) {
      setState({ kind: 'not-found' });
      return;
    }
    let cancelled = false;
    setState({ kind: 'loading' });
    authService
      .getById(id)
      .then(async (user) => {
        if (cancelled) return;
        if (!user) {
          setState({ kind: 'not-found' });
          return;
        }
        // Pull the full property objects for the user's owned ids. Fall back to
        // the in-memory cache if the BE doesn't expose a per-user list endpoint.
        const ids = user.properties ?? [];
        let properties: Property[] = [];
        if (ids.length > 0) {
          try {
            const all = await propertyService.getAll();
            if (cancelled) return;
            const idSet = new Set(ids.map(String));
            properties = all.filter((p) => idSet.has(String(p.id)));
          } catch {
            properties = ids
              .map((pid) => getPropertyById(String(pid)))
              .filter((p): p is Property => Boolean(p));
          }
        }
        setState({ kind: 'ready', user, properties });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ kind: 'not-found' });
      });
    return () => {
      cancelled = true;
    };
  }, [id, authService, propertyService, getPropertyById]);

  if (state.kind === 'loading') {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Propiedades del Usuario"
          subtitle={id ? `ID: ${id}` : undefined}
        />
        <div
          className="flex min-h-[40vh] items-center justify-center rounded-xl border border-border-subtle bg-card shadow-elev-xs"
          aria-live="polite"
        >
          <Spinner size="lg" label="Cargando propiedades" />
        </div>
      </div>
    );
  }

  if (state.kind === 'not-found') {
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

  const { user, properties } = state;

  return (
    <div className="space-y-6">
      <BackButton
        onClick={() => navigate(`/usuarios/${user.id}`)}
        label="Volver al usuario"
      />
      <PageHeader
        title={`Propiedades de ${user.name}`}
        subtitle={user.email}
      />

      {properties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="Sin propiedades asignadas"
          description="Este usuario aún no tiene propiedades registradas en el sistema."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={String(property.id)}
              property={{
                id: property.id,
                name: property.name,
                address: property.address,
                status: property.status,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                area: property.area,
                rent: property.rent,
              }}
              onView={(p) => navigate(`/propiedades/${p.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
