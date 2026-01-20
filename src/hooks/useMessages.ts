import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Message } from '../types';

interface UseMessagesOptions {
  recipientId: string;
  userId: string;
  pageSize?: number;
}

interface CachedConversation {
  messages: Message[];
  hasMore: boolean;
  timestamp: number;
}

const messageCache = new Map<string, CachedConversation>();
const CACHE_TTL = 5 * 60 * 1000;

export function useMessages({ recipientId, userId, pageSize = 50 }: UseMessagesOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [sending, setSending] = useState(false);
  const subscriptionRef = useRef<any>(null);
  const optimisticMessagesRef = useRef<Map<string, Message>>(new Map());

  const conversationId = [userId, recipientId].sort().join('_');

  const loadMessages = useCallback(async (beforeTimestamp?: string) => {
    try {
      const cacheKey = `${conversationId}_${beforeTimestamp || 'latest'}`;
      const cached = messageCache.get(cacheKey);

      if (cached && Date.now() - cached.timestamp < CACHE_TTL && !beforeTimestamp) {
        setMessages(cached.messages);
        setHasMore(cached.hasMore);
        setLoading(false);
        return;
      }

      let query = supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${userId})`)
        .order('created_at', { ascending: false })
        .limit(pageSize + 1);

      if (beforeTimestamp) {
        query = query.lt('created_at', beforeTimestamp);
      }

      const { data, error } = await query;

      if (error) throw error;

      const hasMoreResults = (data?.length || 0) > pageSize;
      const messagesData = hasMoreResults ? data!.slice(0, pageSize) : (data || []);

      const sortedMessages = messagesData.reverse();

      if (beforeTimestamp) {
        setMessages(prev => [...sortedMessages, ...prev]);
      } else {
        setMessages(sortedMessages);
        messageCache.set(cacheKey, {
          messages: sortedMessages,
          hasMore: hasMoreResults,
          timestamp: Date.now()
        });
      }

      setHasMore(hasMoreResults);
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, [conversationId, recipientId, userId, pageSize]);

  const loadMoreMessages = useCallback(() => {
    if (!hasMore || loading) return;

    const oldestMessage = messages[0];
    if (oldestMessage) {
      setLoading(true);
      loadMessages(oldestMessage.created_at);
    }
  }, [hasMore, loading, messages, loadMessages]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return null;

    const optimisticId = `optimistic_${Date.now()}`;
    const optimisticMessage: Message = {
      id: optimisticId,
      sender_id: userId,
      receiver_id: recipientId,
      content: content.trim(),
      created_at: new Date().toISOString()
    };

    optimisticMessagesRef.current.set(optimisticId, optimisticMessage);
    setMessages(prev => [...prev, optimisticMessage]);

    setSending(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: userId,
          receiver_id: recipientId,
          content: content.trim()
        })
        .select()
        .single();

      if (error) throw error;

      optimisticMessagesRef.current.delete(optimisticId);
      setMessages(prev =>
        prev.map(msg => msg.id === optimisticId ? data : msg)
      );

      messageCache.delete(`${conversationId}_latest`);

      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      optimisticMessagesRef.current.delete(optimisticId);
      setMessages(prev => prev.filter(msg => msg.id !== optimisticId));
      throw err;
    } finally {
      setSending(false);
    }
  }, [userId, recipientId, conversationId]);

  const markAsRead = useCallback(async () => {
    try {
      const unreadMessages = messages.filter(
        msg => msg.receiver_id === userId && msg.sender_id === recipientId
      );

      if (unreadMessages.length === 0) return;

      await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .in('id', unreadMessages.map(m => m.id))
        .eq('receiver_id', userId);
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  }, [messages, userId, recipientId]);

  useEffect(() => {
    loadMessages();

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
    }

    const channel = supabase.channel(`messages_${conversationId}`);

    channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${recipientId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.receiver_id === userId) {
            if (!optimisticMessagesRef.current.has(newMessage.id)) {
              setMessages(prev => {
                if (prev.some(m => m.id === newMessage.id)) return prev;
                return [...prev, newMessage];
              });
              messageCache.delete(`${conversationId}_latest`);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${userId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          if (newMessage.receiver_id === recipientId) {
            if (!optimisticMessagesRef.current.has(newMessage.id)) {
              setMessages(prev => {
                if (prev.some(m => m.id === newMessage.id)) return prev;
                return [...prev, newMessage];
              });
              messageCache.delete(`${conversationId}_latest`);
            }
          }
        }
      )
      .subscribe();

    subscriptionRef.current = channel;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [conversationId, recipientId, userId, loadMessages]);

  return {
    messages,
    loading,
    sending,
    hasMore,
    sendMessage,
    loadMoreMessages,
    markAsRead,
    refreshMessages: loadMessages
  };
}
