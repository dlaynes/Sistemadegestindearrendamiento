import { useState } from 'react';
import { MessageSquare, Send, Search, Plus, ArrowLeft, User } from 'lucide-react';
import { cn } from '../../ui/utils';

export interface Conversation {
  id: string | number;
  name: string;
  property?: string;
  lastMessage?: string;
  timestamp?: string;
  unread: number;
  avatar?: string;
}

export interface Message {
  id: string | number;
  sender: 'me' | 'other';
  content: string;
  timestamp: string;
}

export interface Contact {
  id: string | number;
  name: string;
  subtitle?: string;
  avatar?: string;
}

interface MessagesInterfaceProps {
  role: 'arrendador' | 'inquilino';
  conversations: Conversation[];
  messages: Message[];
  selectedConversationId: string | number;
  onSelectConversation: (conversation: Conversation) => void;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  className?: string;
  contacts?: Contact[];
  onStartConversation?: (contact: Contact) => void;
}

export function MessagesInterface({
  role,
  conversations,
  messages,
  selectedConversationId,
  onSelectConversation,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  searchValue,
  onSearchChange,
  className,
  contacts,
  onStartConversation,
}: MessagesInterfaceProps) {
  const [showContacts, setShowContacts] = useState(false);

  const subtitle =
    role === 'arrendador'
      ? 'Comunicación con inquilinos'
      : 'Comunicación con arrendatarios';

  const selectedConversation = conversations.find(
    (c) => String(c.id) === String(selectedConversationId)
  );

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      (conv.property?.toLowerCase() || '').includes(searchValue.toLowerCase())
  );

  const filteredContacts = (contacts || []).filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      (contact.subtitle?.toLowerCase() || '').includes(searchValue.toLowerCase())
  );

  return (
    <div className={cn('space-y-6', className)}>
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Mensajes</h1>
        <p className="text-gray-600 mt-1">{subtitle}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[700px] flex">
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={showContacts ? 'Buscar contactos...' : 'Buscar conversaciones...'}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {contacts && contacts.length > 0 && onStartConversation && (
              <button
                onClick={() => {
                  setShowContacts((prev) => !prev);
                  onSearchChange('');
                }}
                className={cn(
                  'w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors',
                  showContacts
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                )}
              >
                {showContacts ? (
                  <>
                    <ArrowLeft className="w-4 h-4" />
                    Volver a conversaciones
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Nueva conversación
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {showContacts ? (
              filteredContacts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <User className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p>No se encontraron contactos</p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => onStartConversation?.(contact)}
                    className="p-4 border-b border-gray-200 cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                        {contact.avatar || contact.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {contact.name}
                        </h3>
                        {contact.subtitle && (
                          <p className="text-sm text-gray-500 truncate">
                            {contact.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  className={cn(
                    'p-4 border-b border-gray-200 cursor-pointer transition-colors',
                    selectedConversationId === conversation.id
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                      {conversation.avatar || conversation.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.name}
                        </h3>
                        {conversation.unread > 0 && (
                          <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                      {conversation.property && (
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.property}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.lastMessage || 'Sin mensajes'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{conversation.timestamp || ''}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {selectedConversation.avatar || selectedConversation.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConversation.name}</h3>
                    {selectedConversation.property && (
                      <p className="text-sm text-gray-500">{selectedConversation.property}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.sender === 'me'
                        ? 'justify-end'
                        : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[70%] p-3 rounded-lg',
                        message.sender === 'me'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      )}
                    >
                      <p>{message.content}</p>
                      <p
                        className={cn(
                          'text-xs mt-1',
                          message.sender === 'me'
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        )}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => onNewMessageChange(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={onSendMessage}
                    disabled={!newMessage.trim()}
                    className={cn(
                      'px-4 py-2 bg-blue-600 text-white rounded-lg',
                      'hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                    )}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Selecciona una conversación</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
