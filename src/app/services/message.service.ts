import { apiGet, apiPost, apiPut } from './api-client';

export interface Conversation {
  id: string | number;
  participantId: string | number;
  name: string;
  avatar?: string;
  lastMessage?: string;
  timestamp?: string;
  unread: number;
}

export interface Message {
  id: string | number;
  sender: 'me' | 'other';
  content: string;
  timestamp: string;
  read: boolean;
}

export interface MessageService {
  getConversations(): Promise<Conversation[]>;
  startConversation(otherUserId: string | number): Promise<Conversation>;
  getMessages(conversationId: string | number): Promise<Message[]>;
  sendMessage(conversationId: string | number, content: string): Promise<Message>;
  markAsRead(conversationId: string | number): Promise<void>;
}

function getCurrentUserId(): string | number | null {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return (JSON.parse(raw) as { id: string | number }).id;
  } catch {
    return null;
  }
}

export class ApiMessageService implements MessageService {
  async getConversations(): Promise<Conversation[]> {
    const data = await apiGet<Array<{
      id: number;
      participantId: number;
      participantName: string;
      participantAvatar?: string;
      lastMessage?: string;
      lastMessageAt?: string;
      unreadCount: number;
    }>>('/conversations');

    return data.map((c) => ({
      id: c.id,
      participantId: c.participantId,
      name: c.participantName,
      avatar: c.participantAvatar,
      lastMessage: c.lastMessage,
      timestamp: c.lastMessageAt,
      unread: Number(c.unreadCount),
    }));
  }

  async startConversation(otherUserId: string | number): Promise<Conversation> {
    const c = await apiPost<{
      id: number;
      participantId: number;
      participantName: string;
      participantAvatar?: string;
      lastMessage?: string;
      lastMessageAt?: string;
      unreadCount: number;
    }>('/conversations', { otherUserId });

    return {
      id: c.id,
      participantId: c.participantId,
      name: c.participantName,
      avatar: c.participantAvatar,
      lastMessage: c.lastMessage,
      timestamp: c.lastMessageAt,
      unread: Number(c.unreadCount),
    };
  }

  async getMessages(conversationId: string | number): Promise<Message[]> {
    const currentUserId = getCurrentUserId();
    const data = await apiGet<Array<{
      id: number;
      senderId: number;
      senderName: string;
      content: string;
      timestamp: string;
      read: boolean;
    }>>(`/conversations/${conversationId}/messages`);

    return data.map((m) => ({
      id: m.id,
      sender: String(m.senderId) === String(currentUserId) ? 'me' : 'other',
      content: m.content,
      timestamp: m.timestamp,
      read: m.read,
    }));
  }

  async sendMessage(conversationId: string | number, content: string): Promise<Message> {
    const currentUserId = getCurrentUserId();
    const m = await apiPost<{
      id: number;
      senderId: number;
      senderName: string;
      content: string;
      timestamp: string;
      read: boolean;
    }>(`/conversations/${conversationId}/messages`, { content });

    return {
      id: m.id,
      sender: String(m.senderId) === String(currentUserId) ? 'me' : 'other',
      content: m.content,
      timestamp: m.timestamp,
      read: m.read,
    };
  }

  async markAsRead(conversationId: string | number): Promise<void> {
    await apiPut(`/conversations/${conversationId}/read`, {});
  }
}
