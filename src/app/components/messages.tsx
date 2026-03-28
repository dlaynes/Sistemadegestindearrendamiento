import { useState } from 'react';
import { MessageSquare, Send, User, Clock, Search } from 'lucide-react';

const mockConversations = [
  {
    id: 1,
    tenant: 'Juan Pérez',
    property: 'Apartamento Centro #101',
    lastMessage: 'Gracias por la rápida respuesta',
    timestamp: '2026-03-27 10:30',
    unread: 0,
    avatar: 'JP',
  },
  {
    id: 2,
    tenant: 'Ana Martínez',
    property: 'Casa Residencial #102',
    lastMessage: 'Buenos días, necesito reportar un problema',
    timestamp: '2026-03-27 09:15',
    unread: 2,
    avatar: 'AM',
  },
  {
    id: 3,
    tenant: 'María García',
    property: 'Apartamento Vista Mar #103',
    lastMessage: 'Perfecto, estaré disponible ese día',
    timestamp: '2026-03-26 18:45',
    unread: 0,
    avatar: 'MG',
  },
  {
    id: 4,
    tenant: 'Laura Gómez',
    property: 'Casa Familiar #201',
    lastMessage: '¿Podemos agendar una visita?',
    timestamp: '2026-03-26 14:20',
    unread: 1,
    avatar: 'LG',
  },
  {
    id: 5,
    tenant: 'Roberto Silva',
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
  {
    id: 3,
    sender: 'tenant',
    content: '¿Puedo hacer el pago el día 8 en lugar del día 5? Tengo un pequeño retraso con mi nómina.',
    timestamp: '2026-03-27 09:18',
  },
  {
    id: 4,
    sender: 'owner',
    content: 'No hay problema Juan. Puedes realizar el pago hasta el día 8. Te confirmo recibido cuando lo proceses.',
    timestamp: '2026-03-27 09:25',
  },
  {
    id: 5,
    sender: 'tenant',
    content: 'Gracias por la rápida respuesta',
    timestamp: '2026-03-27 10:30',
  },
];

export function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = mockConversations.filter((conv) =>
    conv.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.property.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Aquí se enviaría el mensaje
      console.log('Enviando mensaje:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Mensajes</h1>
        <p className="text-gray-600 mt-1">Comunicación con inquilinos</p>
      </div>

      {/* Messages Interface */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[700px] flex">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conversaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
                  selectedConversation.id === conversation.id
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                    {conversation.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{conversation.tenant}</h3>
                      {conversation.unread > 0 && (
                        <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1 truncate">{conversation.property}</p>
                    <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{conversation.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {selectedConversation.avatar}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selectedConversation.tenant}</h3>
                <p className="text-sm text-gray-600">{selectedConversation.property}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'owner' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-3 ${
                      message.sender === 'owner'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'owner' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Conversaciones Activas</p>
              <p className="text-2xl font-semibold text-gray-900">5</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Tiempo de Respuesta Promedio</p>
              <p className="text-2xl font-semibold text-gray-900">15 min</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <MessageSquare className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Mensajes Sin Leer</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
