import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, User } from 'lucide-react';
import { toast } from 'sonner';
import { MessagesInterface, SummaryCards } from '../shared';
import type { Conversation, Message, Contact } from '../shared/messages/messages-interface';
import { useServices } from '../../services';

export function ArrendadorMessages() {
  const { message: messageService, auth: authService } = useServices();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tenants, setTenants] = useState<Contact[]>([]);

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

  const fetchTenants = useCallback(async () => {
    try {
      const data = await authService.getTenants();
      setTenants(
        data.map((t) => ({
          id: t.id,
          name: t.name,
          subtitle: t.email,
          avatar: t.name.substring(0, 2).toUpperCase(),
        }))
      );
    } catch (err) {
      console.error('Error cargando inquilinos:', err);
      toast.error('Error al cargar la lista de inquilinos');
    }
  }, [authService]);

  useEffect(() => {
    fetchConversations();
    fetchTenants();
  }, [fetchConversations, fetchTenants]);

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

  const handleStartConversation = useCallback(
    async (contact: Contact) => {
      try {
        const conversation = await messageService.startConversation(contact.id);
        toast.success(`Conversación iniciada con ${contact.name}`);
        setConversations((prev) => {
          const exists = prev.find((c) => String(c.id) === String(conversation.id));
          if (exists) return prev;
          return [conversation, ...prev];
        });
        setSelectedConversation(conversation);
        await fetchMessages(conversation.id);
        setSearchTerm('');
      } catch (err) {
        console.error('Error iniciando conversación:', err);
        toast.error('Error al iniciar la conversación');
      }
    },
    [messageService, fetchMessages]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
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
        contacts={tenants}
        onStartConversation={handleStartConversation}
      />

      <SummaryCards
        cards={[
          { label: 'Conversaciones Activas', value: String(conversations.length), icon: MessageSquare, color: 'bg-info' },
          { label: 'Mensajes Sin Leer', value: String(conversations.reduce((sum, c) => sum + c.unread, 0)), icon: User, color: 'bg-warning' },
          { label: 'Inquilinos Disponibles', value: String(tenants.length), icon: User, color: 'bg-success' },
        ]}
        columns={3}
      />
    </div>
  );
}
