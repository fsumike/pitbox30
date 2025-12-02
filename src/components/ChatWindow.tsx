import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Loader2, ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Message, Profile } from '../types';

interface ChatWindowProps {
  recipientId: string;
  onClose: () => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
}

function ChatWindow({ recipientId, onClose, isMinimized = false, onMinimize }: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [recipient, setRecipient] = useState<Profile | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMessages();
    loadRecipientProfile();
    subscribeToMessages();
    checkNotificationPermission();
  }, [recipientId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const showNotification = (message: Message) => {
    if (!('Notification' in window) || notificationPermission !== 'granted' || document.visibilityState === 'visible') {
      return;
    }

    const notification = new Notification('New Message from ' + (recipient?.username || 'Someone'), {
      body: message.content,
      icon: '/android-icon-192-192.png',
      badge: '/android-icon-96-96.png',
      tag: 'chat-message',
      vibrate: [200, 100, 200],
      requireInteraction: false
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
      if (onMinimize && isMinimized) {
        onMinimize();
      }
    };

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);
  };

  const loadRecipientProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', recipientId)
        .single();
      
      if (data) {
        setRecipient(data);
      }
    } catch (err) {
      console.error('Error loading recipient profile:', err);
    }
  };

  const loadMessages = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            username,
            avatar_url
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${recipientId},receiver_id.eq.${recipientId}`)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    if (!user) return;

    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${recipientId},receiver_id=eq.${user.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          showNotification(newMessage);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !newMessage.trim()) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: recipientId,
          content: newMessage.trim()
        });

      if (error) throw error;
      setNewMessage('');
      messageInputRef.current?.focus();
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={onMinimize}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center overflow-hidden">
            {recipient?.avatar_url ? (
              <img
                src={recipient.avatar_url}
                alt={recipient.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-brand-gold">
                {recipient?.username?.[0]?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <span className="font-medium">{recipient?.username || 'Chat'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col max-h-[600px]">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMinimize}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-brand-gold/10 flex items-center justify-center overflow-hidden">
            {recipient?.avatar_url ? (
              <img
                src={recipient.avatar_url}
                alt={recipient.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-brand-gold">
                {recipient?.username?.[0]?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold">{recipient?.username || 'Loading...'}</p>
            <p className="text-xs text-gray-500">
              {recipient?.full_name || recipient?.username}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-brand-gold" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[75%] ${
                  message.sender_id === user?.id
                    ? 'bg-brand-gold text-white'
                    : 'bg-gray-100 dark:bg-gray-700'
                } rounded-lg px-4 py-2`}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-75 mt-1">
                  {formatTime(message.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            ref={messageInputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-gold"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors disabled:opacity-50"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatWindow;