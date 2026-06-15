import { useEffect, useMemo, useRef, useState } from 'react';
import { Send, MessageSquare, Paperclip, X } from 'lucide-react';
import { cn } from '../../ui/utils';
import { Button } from '../../ui/button';
import { Spinner } from '../ui/spinner';
import { EmptyState } from '../ui/empty-state';
import { StatusBadge } from '../ui/status-badge';
import { useAuth } from '../../../contexts/auth-context';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useSendMessageWithAttachment,
  useMarkAsRead,
  useStartConversation,
} from '../../../hooks/queries/use-messages-query';
import type { Message } from '../../../services/message.service';
import type { UserRole } from '../../../types/user';
import { Avatar } from '../ui/avatar';

export interface Contact {
  id: string | number;
  name: string;
  email?: string;
  role?: UserRole;
}

export type { Message };
export interface Conversation {
  id: string | number;
  name: string;
  lastMessage?: string;
  updatedAt?: string;
  unread: number;
  avatar?: string;
}

interface MessagesInterfaceProps {
  className?: string;
  /** Optional list of users the current user can start a conversation with. */
  availableContacts?: Contact[];
}

function formatTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDay(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) return formatTime(iso);
  return d.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
}

function formatFileSize(bytes?: number): string {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MessagesInterface({ className, availableContacts = [] }: MessagesInterfaceProps) {
  const { user } = useAuth();

  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [composer, setComposer] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Track which conversations we've already marked as read in this session
  // so we don't fire markAsRead on every refetch of the conversation list.
  const markedReadRef = useRef<Set<string>>(new Set());

  const conversationsQuery = useConversations();
  const messagesQuery = useMessages(activeId);
  const sendMessage = useSendMessage();
  const sendAttachment = useSendMessageWithAttachment();
  const markAsRead = useMarkAsRead();
  const startConversation = useStartConversation();

  const conversations = useMemo(
    () => conversationsQuery.data ?? [],
    [conversationsQuery.data],
  );
  const activeConversation = useMemo(
    () => conversations.find((c: Conversation) => String(c.id) === String(activeId)) ?? null,
    [conversations, activeId],
  );

  // Auto-select the first conversation when the list loads.
  useEffect(() => {
    if (activeId === null && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  // Mark the active conversation as read, but only once per activeId transition.
  // We intentionally do NOT include `activeConversation` in deps - its object identity
  // changes on every conversation-list refetch, and we don't want each refetch to
  // re-fire the mutation (which would invalidate the list and refetch it again).
  useEffect(() => {
    if (activeId === null) return;
    const key = String(activeId);
    if (markedReadRef.current.has(key)) return;
    markedReadRef.current.add(key);
    markAsRead.mutate(activeId);
  }, [activeId, markAsRead]);

  // Scroll to the bottom of the thread when new messages arrive.
  useEffect(() => {
    if (!threadRef.current) return;
    threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messagesQuery.data]);

  const handleSelect = (id: string | number) => () => {
    setActiveId(id);
    // Reset the per-conversation guard so the next visit to this conversation
    // re-marks it read (e.g. after more messages arrived in the meantime).
    markedReadRef.current.delete(String(id));
  };

  const handleStartConversation = async (otherUserId: string | number) => {
    try {
      const c = await startConversation.mutateAsync(otherUserId);
      setActiveId(c.id);
    } catch {
      // Query invalidation will refresh the list; selection is best-effort.
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = composer.trim();
    if (activeId === null) return;

    if (selectedFile) {
      setComposer('');
      setSelectedFile(null);
      try {
        await sendAttachment.mutateAsync({ conversationId: activeId, content, file: selectedFile });
      } catch {
        setComposer(content);
      }
      return;
    }

    if (!content) return;
    setComposer('');
    try {
      await sendMessage.mutateAsync({ conversationId: activeId, content });
    } catch {
      // On failure, restore the composer so the user can retry.
      setComposer(content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        alert('El archivo excede el limite de 4MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const meId = user?.id != null ? String(user.id) : null;
  const showSkeleton = conversationsQuery.isLoading || conversationsQuery.isPending;
  const isSending = sendMessage.isPending || sendAttachment.isPending;

  return (
    <div
      className={cn(
        'flex h-[700px] overflow-hidden rounded-xl border border-border-subtle bg-card shadow-elev-xs',
        className,
      )}
    >
      {/* Conversation list */}
      <aside className="flex w-72 flex-col border-r border-border-subtle">
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Conversaciones</h2>
          {conversations.length > 0 && (
            <span className="rounded-full bg-primary-muted px-2 py-0.5 text-xs font-medium text-primary-muted-foreground">
              {conversations.length}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {showSkeleton ? (
            <div className="flex items-center justify-center p-6">
              <Spinner size="md" label="Cargando conversaciones" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted-foreground">
              Aun no tienes conversaciones.
            </p>
          ) : (
            <ul className="divide-y divide-border-subtle">
              {conversations.map((c) => {
                const isActive = String(c.id) === String(activeId);
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={handleSelect(c.id)}
                      aria-current={isActive ? 'true' : undefined}
                      className={cn(
                        'flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition-colors',
                        isActive ? 'bg-primary-muted/40' : 'hover:bg-surface',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} src={c.avatar} />
                        <div className="flex w-full flex-col gap-0.5 truncate">
                          <div className="flex w-full items-center justify-between gap-2">
                            <span
                              className={cn(
                                'truncate text-sm',
                                isActive ? 'font-semibold text-primary' : 'font-medium text-foreground',
                              )}
                            >
                              {c.name}
                            </span>
                            {c.unread > 0 && (
                              <StatusBadge
                                type="contract"
                                status="activo"
                                label={String(c.unread)}
                                size="sm"
                                variant="dot"
                              />
                            )}
                          </div>
                          {c.lastMessage && (
                            <span className="line-clamp-1 text-xs text-muted-foreground">
                              {c.lastMessage}
                            </span>
                          )}
                          {c.timestamp && (
                            <span className="text-[11px] text-muted-foreground">
                              {formatDay(c.timestamp)}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {availableContacts.length > 0 && (
          <div className="border-t border-border-subtle p-3">
            <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Iniciar conversación
            </p>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {availableContacts.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => handleStartConversation(contact.id)}
                  disabled={startConversation.isPending}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-foreground transition-colors hover:bg-surface disabled:opacity-50"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-muted text-xs font-semibold text-primary-muted-foreground">
                    {contact.name
                      .split(' ')
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{contact.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Active thread */}
      <section className="flex flex-1 flex-col">
        {activeId === null ? (
          <EmptyState
            icon={MessageSquare}
            title="Selecciona una conversación"
            description="Elige una conversación de la lista para ver los mensajes."
            className="m-auto"
            iconSize="lg"
          />
        ) : (
          <>
            <header className="flex items-center justify-between border-b border-border-subtle px-5 py-3">
              <div className="min-w-0 flex items-center gap-3">
                <Avatar name={activeConversation?.name ?? 'Conversación'} src={activeConversation?.avatar} />
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {activeConversation?.name ?? 'Conversación'}
                  </h3>
                  {activeConversation?.timestamp && (
                    <p className="text-xs text-muted-foreground">
                      Última actividad: {formatDay(activeConversation.timestamp)}
                    </p>
                  )}
                </div>

              </div>
            </header>

            <div
              ref={threadRef}
              className="flex-1 space-y-3 overflow-y-auto bg-background/40 p-5"
            >
              {messagesQuery.isLoading || messagesQuery.isPending ? (
                <div className="flex h-full items-center justify-center">
                  <Spinner size="md" label="Cargando mensajes" />
                </div>
              ) : (messagesQuery.data ?? []).length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  Sé el primero en escribir.
                </p>
              ) : (
                (messagesQuery.data ?? []).map((m) => {
                  const mine = meId !== null && String(m.sender) === 'me';
                  const isImage = m.attachmentType?.startsWith('image/');
                  return (
                    <div
                      key={m.id}
                      className={cn('flex', mine ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        className={cn(
                          'max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-elev-xs',
                          mine
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card text-foreground ring-1 ring-inset ring-border-subtle',
                        )}
                      >
                        {isImage && m.attachmentUrl && (
                          <div className="mb-2">
                            <img
                              src={m.attachmentUrl}
                              alt={m.attachmentName || 'Adjunto'}
                              className="max-h-48 max-w-full rounded-lg object-contain"
                              loading="lazy"
                            />
                          </div>
                        )}
                        {m.attachmentUrl && !isImage && (
                          <a
                            href={m.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'mb-1 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors',
                              mine
                                ? 'border-primary-foreground/30 bg-primary-foreground/10 hover:bg-primary-foreground/20'
                                : 'border-border-subtle bg-surface hover:bg-background',
                            )}
                          >
                            <Paperclip className="h-3.5 w-3.5 shrink-0" />
                            <span className="min-w-0 flex-1 truncate">{m.attachmentName}</span>
                            {m.attachmentSize && (
                              <span className="shrink-0 text-[10px] opacity-70">{formatFileSize(m.attachmentSize)}</span>
                            )}
                          </a>
                        )}
                        {m.content && m.content.length > 0 && (
                          <p className="whitespace-pre-wrap break-words">{m.content}</p>
                        )}
                        <p
                          className={cn(
                            'mt-1 text-right text-[10px]',
                            mine ? 'text-primary-foreground/80' : 'text-muted-foreground',
                          )}
                        >
                          {formatTime(m.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form
              onSubmit={handleSend}
              className="flex flex-col gap-2 border-t border-border-subtle p-3"
            >
              {selectedFile && (
                <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5 text-xs text-foreground">
                  <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate">{selectedFile.name}</span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{formatFileSize(selectedFile.size)}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground"
                    aria-label="Quitar archivo"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              <div className="flex items-end gap-2">
                <label htmlFor="message-composer" className="sr-only">
                  Mensaje
                </label>
                <textarea
                  id="message-composer"
                  ref={composerRef}
                  value={composer}
                  onChange={(e) => setComposer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Escribe un mensaje..."
                  aria-label="Mensaje"
                  className="min-h-[40px] flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf,text/plain"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Adjuntar archivo"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  disabled={(!composer.trim() && !selectedFile) || isSending}
                  aria-label="Enviar mensaje"
                >
                  {isSending ? (
                    <Spinner size="sm" label="Enviando" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
