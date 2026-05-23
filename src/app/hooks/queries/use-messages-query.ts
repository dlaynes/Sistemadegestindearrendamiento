import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useServices } from '../../services';

export function useConversations() {
  const { message } = useServices();

  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => message.getConversations(),
  });
}

export function useMessages(conversationId: string | number | null) {
  const { message } = useServices();

  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => message.getMessages(conversationId!),
    enabled: !!conversationId,
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
