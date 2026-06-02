import { PageHeader } from '../shared/dashboard/page-header';
import { MessagesInterface } from '../shared/messages/messages-interface';

export function InquilinoMessages() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mensajes"
        subtitle="Comunícate con tu arrendador"
      />
      <MessagesInterface />
    </div>
  );
}
