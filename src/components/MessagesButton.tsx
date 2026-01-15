import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useConversations } from '../hooks/useConversations';

interface MessagesButtonProps {
  className?: string;
}

function MessagesButton({ className = '' }: MessagesButtonProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { conversations } = useConversations(user?.id || '');

  const unreadTotal = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  if (!user) return null;

  return (
    <button
      onClick={() => navigate('/messages')}
      className={`relative flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md ${className}`}
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
  );
}

export default MessagesButton;
