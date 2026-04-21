import * as React from 'react';
import { MessageSquare, Send, Search } from 'lucide-react';
import { cn } from '../../ui/utils';

export interface Conversation {
  /**
   * Conversation ID
   */
  id: string | number;
  /**
   * Contact name
   */
  name: string;
  /**
   * Property reference
   */
  property: string;
  /**
   * Last message preview
   */
  lastMessage: string;
  /**
   * Last message timestamp
   */
  timestamp: string;
  /**
   * Number of unread messages
   */
  unread: number;
  /**
   * Avatar initials
   */
  avatar: string;
}

export interface Message {
  /**
   * Message ID
   */
  id: string | number;
  /**
   * Message sender type
   */
  sender: 'tenant' | 'owner' | 'me';
  /**
   * Message content
   */
  content: string;
  /**
   * Message timestamp
   */
  timestamp: string;
}

interface MessagesInterfaceProps {
  /**
   * User role (affects labels)
   */
  role: 'arrendador' | 'inquilino';
  /**
   * Array of conversations
   */
  conversations: Conversation[];
  /**
   * Array of messages for the selected conversation
   */
  messages: Message[];
  /**
   * Currently selected conversation ID
   */
  selectedConversationId: string | number;
  /**
   * Callback when conversation is selected
   */
  onSelectConversation: (conversation: Conversation) => void;
  /**
   * New message input value
   */
  newMessage: string;
  /**
   * Callback when new message changes
   */
  onNewMessageChange: (value: string) => void;
  /**
   * Callback when message is sent
   */
  onSendMessage: () => void;
  /**
   * Search value
   */
  searchValue: string;
  /**
   * Callback when search changes
   */
  onSearchChange: (value: string) => void;
  /**
   * Optional additional class names
   */
  className?: string;
}

/**
 * MessagesInterface - A reusable messages interface component
 * 
 * Usage:
 * ```tsx
 * <MessagesInterface
 *   role="arrendador"
 *   conversations={conversations}
 *   messages={messages}
 *   selectedConversationId={selectedId}
 *   onSelectConversation={setSelected}
 *   newMessage={newMessage}
 *   onNewMessageChange={setNewMessage}
 *   onSendMessage={handleSend}
 *   searchValue={search}
 *   onSearchChange={setSearch}
 * />
 * ```
 */
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
}: MessagesInterfaceProps) {
  const subtitle = role === 'arrendador'
    ? 'Comunicación con inquilinos'
    : 'Comunicación con arrendatarios';

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    conv.property.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Mensajes</h1>
        <p className="text-gray-600 mt-1">{subtitle}</p>
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
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
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
                    {conversation.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                      {conversation.unread > 0 && (
                        <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{conversation.property}</p>
                    <p className="text-sm text-gray-600 truncate mt-1">{conversation.lastMessage}</p>
                    <p className="text-xs text-gray-400 mt-1">{conversation.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Messages Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {selectedConversation.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConversation.name}</h3>
                    <p className="text-sm text-gray-500">{selectedConversation.property}</p>
                  </div>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.sender === 'me' || message.sender === 'owner'
                        ? 'justify-end'
                        : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-[70%] p-3 rounded-lg',
                        message.sender === 'me' || message.sender === 'owner'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      )}
                    >
                      <p>{message.content}</p>
                      <p
                        className={cn(
                          'text-xs mt-1',
                          message.sender === 'me' || message.sender === 'owner'
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

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => onNewMessageChange(e.target.value)}
                    onKeyPress={handleKeyPress}
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
