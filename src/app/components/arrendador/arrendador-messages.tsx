import { useState } from 'react';
import { MessageSquare, User } from 'lucide-react';
import { MessagesInterface, SummaryCards } from '../shared';
import type { Conversation, Message } from '../shared/messages/messages-interface';

const mockConversations: Conversation[] = [
  {
    id: 1,
    name: 'Juan Pérez',
    property: 'Apartamento Centro #101',
    lastMessage: 'Gracias por la rápida respuesta',
    timestamp: '2026-03-27 10:30',
    unread: 0,
    avatar: 'JP',
  },
  {
    id: 2,
    name: 'Ana Martínez',
    property: 'Casa Residencial #102',
    lastMessage: 'Buenos días, necesito reportar un problema',
    timestamp: '2026-03-27 09:15',
    unread: 2,
    avatar: 'AM',
  },
];

const mockMessages: Message[] = [
  {
    id: 1,
    sender: 'tenant',
    content: 'Hola, buenos días. Tengo una consulta sobre el pago de este mes.',
    timestamp: '2026-03-27 09:00',
  },
  {
    id: 2,
    sender: 'owner',
    content: 'Buenos días Juan, con gusto te ayudo. ¿Cuál es tu consulta?',
    timestamp: '2026-03-27 09:15',
  },
];

export function ArrendadorMessages() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    mockConversations[0]
  );
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Enviando mensaje:', newMessage);
      setNewMessage('');
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  return (
    <div className="space-y-6">
      <MessagesInterface
        role="arrendador"
        conversations={mockConversations}
        messages={mockMessages}
        selectedConversationId={selectedConversation?.id ?? 0}
        onSelectConversation={handleSelectConversation}
        newMessage={newMessage}
        onNewMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <SummaryCards
        cards={[
          { label: 'Conversaciones Activas', value: '5', icon: MessageSquare, color: 'bg-blue-500' },
          { label: 'Tiempo de Respuesta', value: '15 min', icon: User, color: 'bg-green-500' },
          { label: 'Mensajes Sin Leer', value: '3', icon: MessageSquare, color: 'bg-orange-500' },
        ]}
        columns={3}
      />
    </div>
  );
}
