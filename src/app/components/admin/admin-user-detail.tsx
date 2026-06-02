import { useParams } from 'react-router';
import { PageHeader } from '../shared/dashboard/page-header';
import { Spinner } from '../shared/ui/spinner';

export function AdminUserDetail() {
  const { id } = useParams();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Detalle de Usuario"
        subtitle={`ID: ${id ?? ''}`}
      />
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" label="Cargando" />
      </div>
    </div>
  );
}
