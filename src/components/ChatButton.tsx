import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ChatButtonProps {
  recipientId: string;
  onStartChat: (recipientId: string) => void;
  className?: string;
}

function ChatButton({ recipientId, onStartChat, className = '' }: ChatButtonProps) {
  const { user } = useAuth();

  if (!user || user.id === recipientId) return null;

  return (
    <button
      onClick={() => onStartChat(recipientId)}
      className={`flex items-center gap-2 px-4 py-2 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors ${className}`}
    >
      <MessageSquare className="w-5 h-5" />
      <span>Message</span>
    </button>
  );
}

export default ChatButton;