import { useState } from 'react';
import { MessageSquare, User } from 'lucide-react';
import { MessagesInterface, SummaryCards } from '../shared';

const mockConversations = [
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
  {
    id: 3,
    name: 'María García',
    property: 'Apartamento Vista Mar #103',
    lastMessage: 'Perfecto, estaré disponible ese día',
    timestamp: '2026-03-26 18:45',
    unread: 0,
    avatar: 'MG',
  },
  {
    id: 4,
    name: 'Laura Gómez',
    property: 'Casa Familiar #201',
    lastMessage: '¿Podemos agendar una visita?',
    timestamp: '2026-03-26 14:20',
    unread: 1,
    avatar: 'LG',
  },
  {
    id: 5,
    name: 'Roberto Silva',
    property: 'Estudio Moderno #104',
    lastMessage: 'Ya realicé el pago, adjunto comprobante',
    timestamp: '2026-03-25 16:30',
    unread: 0,
    avatar: 'RS',
  },
];

const mockMessages = [
  {
    id: 1,
    sender: 'tenant' as const,
    content: 'Hola, buenos días. Tengo una consulta sobre el pago de este mes.',
    timestamp: '2026-03-27 09:00',
  },
  {
    id: 2,
    sender: 'owner' as const,
    content: 'Buenos días Juan, con gusto te ayudo. ¿Cuál es tu consulta?',
    timestamp: '2026-03-27 09:15',
  },
  {
    id: 3,
    sender: 'tenant' as const,
    content: '¿Puedo hacer el pago el día 8 en lugar del día 5? Tengo un pequeño retraso con mi nómina.',
    timestamp: '2026-03-27 09:18',
  },
  {
    id: 4,
    sender: 'owner' as const,
    content: 'No hay problema Juan. Puedes realizar el pago hasta el día 8. Te confirmo recibido cuando lo proceses.',
    timestamp: '2026-03-27 09:25',
  },
  {
    id: 5,
    sender: 'tenant' as const,
    content: 'Gracias por la rápida respuesta',
    timestamp: '2026-03-27 10:30',
  },
];

export function ArrendadorMessages() {
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
        role="arrendador"
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
          { label: 'Conversaciones Activas', value: '5', icon: MessageSquare, color: 'bg-blue-500' },
          { label: 'Tiempo de Respuesta', value: '15 min', icon: User, color: 'bg-green-500' },
          { label: 'Mensajes Sin Leer', value: '3', icon: MessageSquare, color: 'bg-orange-500' },
        ]}
        columns={3}
      />
    </div>
  );
}
