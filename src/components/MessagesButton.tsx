import React, { useState, useEffect } from 'react';
import { MessageSquare, X, User, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { supabase } from '../lib/supabase';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  id: string;
  other_user_id: string;
  username: string;
  avatar_url: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export default function MessagesButton() {
  const [showConversations, setShowConversations] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const { user } = useAuth();
  const { startChat } = useChat();

  useEffect(() => {
    if (user && showConversations) {
      loadConversations();
    }
  }, [user, showConversations]);

  useEffect(() => {
    if (user) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUnreadCount = async () => {
    if (!user) return;

    try {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('read', false);

      setUnreadTotal(count || 0);
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  };

  const loadConversations = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data: messages } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          content,
          created_at,
          read,
          sender:profiles!messages_sender_id_fkey(id, username, avatar_url),
          receiver:profiles!messages_receiver_id_fkey(id, username, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (!messages) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const conversationMap = new Map<string, Conversation>();

      messages.forEach((msg: any) => {
        const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        const otherUser = msg.sender_id === user.id ? msg.receiver : msg.sender;

        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            id: otherUserId,
            other_user_id: otherUserId,
            username: otherUser?.username || 'Unknown User',
            avatar_url: otherUser?.avatar_url || null,
            last_message: msg.content,
            last_message_time: msg.created_at,
            unread_count: 0
          });
        }

        if (msg.receiver_id === user.id && !msg.read) {
          const conv = conversationMap.get(otherUserId)!;
          conv.unread_count++;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (err) {
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = (recipientId: string) => {
    startChat(recipientId);
    setShowConversations(false);
  };

  if (!user) return null;

  return (
    <>
      <button
        onClick={() => setShowConversations(true)}
        className="relative flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md"
        title="Messages"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="hidden sm:inline font-medium">Messages</span>
        {unreadTotal > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadTotal > 9 ? '9+' : unreadTotal}
          </span>
        )}
      </button>

      {showConversations && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mt-20 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-brand-gold" />
                <h2 className="text-lg font-bold">Messages</h2>
                {unreadTotal > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                    {unreadTotal}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowConversations(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Start a conversation by messaging someone from their profile
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => handleStartChat(conv.other_user_id)}
                      className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative flex-shrink-0">
                          {conv.avatar_url ? (
                            <img
                              src={conv.avatar_url}
                              alt={conv.username}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold to-amber-600 flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                          )}
                          {conv.unread_count > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-semibold truncate ${conv.unread_count > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                              {conv.username}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Clock className="w-3 h-3" />
                              <span>{formatDistanceToNow(new Date(conv.last_message_time), { addSuffix: true })}</span>
                            </div>
                          </div>
                          <p className={`text-sm truncate ${conv.unread_count > 0 ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            {conv.last_message}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
