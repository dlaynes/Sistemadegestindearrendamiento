import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, User } from 'lucide-react';
import { MessagesInterface, SummaryCards } from '../shared';
import type { Conversation, Message } from '../shared/messages/messages-interface';
import { useServices } from '../../services';

export function ArrendadorMessages() {
  const { message: messageService } = useServices();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando conversaciones');
    } finally {
      setIsLoading(false);
    }
  }, [messageService]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const fetchMessages = useCallback(async (conversationId: string | number) => {
    try {
      const data = await messageService.getMessages(conversationId);
      setMessages(data);
    } catch (err) {
      console.error('Error cargando mensajes:', err);
    }
  }, [messageService]);

  const handleSelectConversation = useCallback(async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    await fetchMessages(conversation.id);
    if (conversation.unread > 0) {
      try {
        await messageService.markAsRead(conversation.id);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === conversation.id ? { ...c, unread: 0 } : c
          )
        );
      } catch {
        // ignore
      }
    }
  }, [fetchMessages, messageService]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      const sent = await messageService.sendMessage(selectedConversation.id, newMessage.trim());
      setMessages((prev) => [...prev, sent]);
      setNewMessage('');
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedConversation.id
            ? { ...c, lastMessage: sent.content, timestamp: sent.timestamp }
            : c
        )
      );
    } catch (err) {
      console.error('Error enviando mensaje:', err);
    }
  }, [newMessage, selectedConversation, messageService]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MessagesInterface
        role="arrendador"
        conversations={conversations}
        messages={messages}
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
          { label: 'Conversaciones Activas', value: String(conversations.length), icon: MessageSquare, color: 'bg-blue-500' },
          { label: 'Mensajes Sin Leer', value: String(conversations.reduce((sum, c) => sum + c.unread, 0)), icon: User, color: 'bg-orange-500' },
        ]}
        columns={3}
      />
    </div>
  );
}
