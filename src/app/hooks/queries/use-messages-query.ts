import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../../services';

// Conversation list changes only on user actions (send / start / read).
// 60s staleTime + disabled focus refetch keeps the page calm.
const CONVERSATIONS_STALE_MS = 60_000;

// The active message thread is refetched when it becomes stale or the window
// regains focus after this many ms.
const MESSAGES_STALE_MS = 30_000;

export function useConversations() {
  const { message } = useServices();

  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => message.getConversations(),
    staleTime: CONVERSATIONS_STALE_MS,
    refetchOnWindowFocus: false,
  });
}

export function useMessages(conversationId: string | number | null) {
  const { message } = useServices();

  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => message.getMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: MESSAGES_STALE_MS,
    refetchOnWindowFocus: false,
  });
}

export function useSendMessage() {
  const { message } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: string | number; content: string }) =>
      message.sendMessage(conversationId, content),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useMarkAsRead() {
  const { message } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string | number) => message.markAsRead(conversationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useStartConversation() {
  const { message } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (otherUserId: string | number) => message.startConversation(otherUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
