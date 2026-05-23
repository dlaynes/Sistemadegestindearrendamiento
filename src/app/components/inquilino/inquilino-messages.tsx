import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, User } from 'lucide-react';
import { toast } from 'sonner';
import { MessagesInterface, SummaryCards } from '../shared';
import type { Conversation, Message, Contact } from '../shared/messages/messages-interface';
import { useServices } from '../../services';

export function InquilinoMessages() {
  const { message: messageService, contract: contractService } = useServices();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [landlords, setLandlords] = useState<Contact[]>([]);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await messageService.getConversations();
      setConversations(data);
      if (data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0]);
        await fetchMessages(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando conversaciones');
    } finally {
      setIsLoading(false);
    }
  }, [messageService]);

  const fetchLandlords = useCallback(async () => {
    try {
      const contracts = await contractService.getAll();
      const uniqueLandlords = new Map<string | number, Contact>();
      contracts.forEach((c) => {
        if (c.landlordId && !uniqueLandlords.has(c.landlordId)) {
          uniqueLandlords.set(c.landlordId, {
            id: c.landlordId,
            name: c.landlordName || 'Arrendador',
            subtitle: c.property || '',
            avatar: (c.landlordName || 'A').substring(0, 2).toUpperCase(),
          });
        }
      });
      setLandlords(Array.from(uniqueLandlords.values()));
    } catch (err) {
      console.error('Error cargando arrendadores:', err);
      toast.error('Error al cargar la lista de arrendadores');
    }
  }, [contractService]);

  useEffect(() => {
    fetchConversations();
    fetchLandlords();
  }, [fetchConversations, fetchLandlords]);

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
        role="inquilino"
        conversations={conversations}
        messages={messages}
        selectedConversationId={selectedConversation?.id ?? 0}
        onSelectConversation={handleSelectConversation}
        newMessage={newMessage}
        onNewMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        contacts={landlords}
        onStartConversation={handleStartConversation}
      />

      <SummaryCards
        cards={[
          { label: 'Conversaciones Activas', value: String(conversations.length), icon: MessageSquare, color: 'bg-info' },
          { label: 'Mensajes Sin Leer', value: String(conversations.reduce((sum, c) => sum + c.unread, 0)), icon: User, color: 'bg-warning' },
          { label: 'Arrendadores Disponibles', value: String(landlords.length), icon: User, color: 'bg-success' },
        ]}
        columns={3}
      />
    </div>
  );
}
