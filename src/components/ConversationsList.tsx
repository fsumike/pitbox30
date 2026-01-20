import React from 'react';
import { MessageCircle, Loader2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useConversations } from '../hooks/useConversations';
import { useChat } from '../contexts/ChatContext';
import { formatDistanceToNow } from 'date-fns';

interface ConversationsListProps {
  onClose: () => void;
}

function ConversationsList({ onClose }: ConversationsListProps) {
  const { user } = useAuth();
  const { conversations, loading } = useConversations(user?.id || '');
  const { startChat } = useChat();

  const handleStartChat = (userId: string) => {
    startChat(userId);
    onClose();
  };

  const formatLastMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-brand-gold" />
            Messages
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm mt-1">Start chatting with other users!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleStartChat(conversation.id)}
                  className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left flex items-center gap-3"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center overflow-hidden">
                      {conversation.otherUser.avatar_url ? (
                        <img
                          src={conversation.otherUser.avatar_url}
                          alt={conversation.otherUser.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-brand-gold">
                          {conversation.otherUser.username?.[0]?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold truncate">
                        {conversation.otherUser.username}
                      </p>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {formatLastMessageTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        conversation.unreadCount > 0
                          ? 'font-semibold text-gray-900 dark:text-white'
                          : 'text-gray-500'
                      }`}
                    >
                      {conversation.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConversationsList;
