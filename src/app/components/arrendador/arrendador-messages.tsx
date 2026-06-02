import { PageHeader } from '../shared/dashboard/page-header';
import { MessagesInterface } from '../shared/messages/messages-interface';

export function ArrendadorMessages() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mensajes"
        subtitle="Comunícate con tus inquilinos"
      />
      <MessagesInterface />
    </div>
  );
}
