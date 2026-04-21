import { useState } from 'react';
import { MessageSquare, User } from 'lucide-react';
import { MessagesInterface, SummaryCards } from '../shared';

const mockConversations : { id: number | string; name: string; property: string; lastMessage: string; timestamp: string; unread: number; avatar: string }[] = [
  {
    id: 1,
    name: 'Carlos Rodríguez',
    property: 'Apartamento Centro #101',
    lastMessage: 'Gracias por la rápida respuesta',
    timestamp: '2026-03-27 10:30',
    unread: 0,
    avatar: 'CR',
  },
];

const mockMessages : { id: number | string; sender: 'me' | 'tenant'; content: string; timestamp: string }[] = [
  {
    id: 1,
    sender: 'me' as const,
    content: 'Hola, buenos días. Tengo una consulta sobre el pago de este mes.',
    timestamp: '2026-03-27 09:00',
  },
  {
    id: 2,
    sender: 'tenant' as const,
    content: 'Buenos días, con gusto te ayudo. ¿Cuál es tu consulta?',
    timestamp: '2026-03-27 09:15',
  },
  {
    id: 3,
    sender: 'me' as const,
    content: '¿Puedo hacer el pago el día 8 en lugar del día 5? Tengo un pequeño retraso con mi nómina.',
    timestamp: '2026-03-27 09:18',
  },
  {
    id: 4,
    sender: 'tenant' as const,
    content: 'No hay problema. Puedes realizar el pago hasta el día 8. Te confirmo recibido cuando lo proceses.',
    timestamp: '2026-03-27 09:25',
  },
  {
    id: 5,
    sender: 'me' as const,
    content: 'Gracias por la rápida respuesta',
    timestamp: '2026-03-27 10:30',
  },
];

export function InquilinoMessages() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Enviando mensaje:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <MessagesInterface
        role="inquilino"
        conversations={mockConversations}
        messages={mockMessages}
        selectedConversationId={selectedConversation.id}
        onSelectConversation={setSelectedConversation}
        newMessage={newMessage}
        onNewMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Quick Stats */}
      <SummaryCards
        cards={[
          { label: 'Mensajes Enviados', value: '12', icon: MessageSquare, color: 'bg-blue-500' },
          { label: 'Respuestas Recibidas', value: '10', icon: User, color: 'bg-green-500' },
          { label: 'Tiempo Promedio', value: '20 min', icon: MessageSquare, color: 'bg-orange-500' },
        ]}
        columns={3}
      />
    </div>
  );
}
