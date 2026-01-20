import React, { useState, useEffect } from 'react';
import {
  MessageSquare, User, Clock, ArrowLeft, Search, Loader2, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { useConversations } from '../hooks/useConversations';
import { formatDistanceToNow } from 'date-fns';

function Messages() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startChat } = useChat();
  const { conversations, loading } = useConversations(user?.id || '');
  const [searchTerm, setSearchTerm] = useState('');

  const unreadTotal = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const handleStartChat = (recipientId: string) => {
    startChat(recipientId);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-panel p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <img
            src="/android-icon-192-192.png"
            alt="PIT-BOX.COM"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">Messages</h1>
              {unreadTotal > 0 && (
                <span className="bg-red-500 text-white text-sm rounded-full px-3 py-1 font-bold">
                  {unreadTotal} unread
                </span>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Stay connected with your racing network
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-brand-gold focus:bg-white dark:focus:bg-gray-700 transition-all"
          />
        </div>
      </div>

      <div className="glass-panel p-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              {searchTerm ? 'No conversations match your search' : 'No messages yet'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Start a conversation by messaging someone from their profile
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleStartChat(conv.id)}
                className="w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="relative flex-shrink-0">
                    {conv.otherUser.avatar_url ? (
                      <img
                        src={conv.otherUser.avatar_url}
                        alt={conv.otherUser.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                    {conv.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold truncate ${conv.unreadCount > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                        {conv.otherUser.username}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                    <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-medium text-gray-800 dark:text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
