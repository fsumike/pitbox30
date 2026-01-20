import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Loader2, ChevronLeft, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import EmojiPicker from './EmojiPicker';
import GifPicker from './GifPicker';
import { useMessages } from '../hooks/useMessages';

interface ChatWindowProps {
  recipientId: string;
  onClose: () => void;
  isMinimized?: boolean;
  onMinimize?: () => void;
}

function ChatWindow({ recipientId, onClose, isMinimized = false, onMinimize }: ChatWindowProps) {
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState<Profile | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  const {
    messages,
    loading,
    sending,
    hasMore,
    sendMessage,
    loadMoreMessages,
    markAsRead
  } = useMessages({
    recipientId,
    userId: user?.id || '',
    pageSize: 50
  });

  useEffect(() => {
    loadRecipientProfile();
    checkNotificationPermission();
  }, [recipientId]);

  useEffect(() => {
    if (isNearBottomRef.current) {
      scrollToBottom();
    }
    markAsRead();
  }, [messages, markAsRead]);

  useEffect(() => {
    if (!isMinimized) {
      markAsRead();
    }
  }, [isMinimized, markAsRead]);

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  };

  const loadRecipientProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', recipientId)
        .maybeSingle();

      if (data) {
        setRecipient(data);
      }
    } catch (err) {
      console.error('Error loading recipient profile:', err);
    }
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    isNearBottomRef.current = distanceFromBottom < 100;
    setShowScrollButton(distanceFromBottom > 300);

    if (scrollTop < 100 && hasMore && !loading) {
      loadMoreMessages();
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user || !newMessage.trim() || sending) return;

    try {
      await sendMessage(newMessage);
      setNewMessage('');
      messageInputRef.current?.focus();
      setTimeout(() => scrollToBottom(), 100);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleGifSelect = async (gifUrl: string) => {
    if (!user || sending) return;

    try {
      await sendMessage(gifUrl);
      setTimeout(() => scrollToBottom(), 100);
    } catch (err) {
      console.error('Error sending GIF:', err);
    }
  };

  const isGifUrl = (text: string) => {
    return text.match(/\.(gif|giphy\.com)/i) || text.includes('media.giphy.com');
  };

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
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
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center overflow-hidden">
            {recipient?.avatar_url ? (
              <img
                src={recipient.avatar_url}
                alt={recipient.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-amber-700 dark:text-amber-400">
                {recipient?.username?.[0]?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{recipient?.username || 'Chat'}</span>
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
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center overflow-hidden">
            {recipient?.avatar_url ? (
              <img
                src={recipient.avatar_url}
                alt={recipient.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-amber-700 dark:text-amber-400">
                {recipient?.username?.[0]?.toUpperCase() || '?'}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{recipient?.username || 'Loading...'}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {recipient?.full_name || recipient?.username}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4 relative"
      >
        {hasMore && (
          <div className="flex justify-center py-2">
            <button
              onClick={loadMoreMessages}
              disabled={loading}
              className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Load older messages'}
            </button>
          </div>
        )}

        {loading && messages.length === 0 ? (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-amber-600 dark:text-amber-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400 py-4">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isOptimistic = message.id.startsWith('optimistic_');
            return (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] ${
                    message.sender_id === user?.id
                      ? 'bg-amber-600 dark:bg-amber-700 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  } rounded-lg ${isGifUrl(message.content) ? 'p-1' : 'px-4 py-2'} ${isOptimistic ? 'opacity-60' : ''}`}
                >
                  {isGifUrl(message.content) ? (
                    <img
                      src={message.content}
                      alt="GIF"
                      className="rounded-lg max-w-full max-h-64 object-contain"
                    />
                  ) : (
                    <p className="break-words">{message.content}</p>
                  )}
                  <p className={`text-xs opacity-75 mt-1 flex items-center gap-1 ${isGifUrl(message.content) ? 'px-2 pb-1' : ''}`}>
                    {formatTime(message.created_at)}
                    {isOptimistic && (
                      <Loader2 className="w-3 h-3 animate-spin inline-block" />
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />

        {showScrollButton && (
          <button
            onClick={() => scrollToBottom()}
            className="fixed bottom-24 right-8 bg-amber-600 dark:bg-amber-700 text-white p-2 rounded-full shadow-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors"
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 items-center">
          <input
            ref={messageInputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 focus:border-transparent"
          />
          <EmojiPicker
            onEmojiSelect={(emoji) => setNewMessage(prev => prev + emoji)}
            buttonClassName="bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            theme="auto"
          />
          <GifPicker
            onGifSelect={handleGifSelect}
            buttonClassName="bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-2 bg-amber-600 dark:bg-amber-700 text-white rounded-lg hover:bg-amber-700 dark:hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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