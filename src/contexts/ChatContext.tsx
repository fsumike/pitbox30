import React, { createContext, useContext, useState, useCallback } from 'react';
import ChatWindow from '../components/ChatWindow';

interface ActiveChat {
  recipientId: string;
  isMinimized: boolean;
}

interface ChatContextType {
  activeChats: ActiveChat[];
  startChat: (recipientId: string) => void;
  closeChat: (recipientId: string) => void;
  minimizeChat: (recipientId: string) => void;
  maximizeChat: (recipientId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [activeChats, setActiveChats] = useState<ActiveChat[]>([]);

  const startChat = useCallback((recipientId: string) => {
    setActiveChats(prev => {
      // If chat already exists, maximize it
      const existingChat = prev.find(chat => chat.recipientId === recipientId);
      if (existingChat) {
        return prev.map(chat =>
          chat.recipientId === recipientId
            ? { ...chat, isMinimized: false }
            : chat
        );
      }
      
      // Otherwise, start a new chat
      return [...prev, { recipientId, isMinimized: false }];
    });
  }, []);

  const closeChat = useCallback((recipientId: string) => {
    setActiveChats(prev => prev.filter(chat => chat.recipientId !== recipientId));
  }, []);

  const minimizeChat = useCallback((recipientId: string) => {
    setActiveChats(prev =>
      prev.map(chat =>
        chat.recipientId === recipientId
          ? { ...chat, isMinimized: true }
          : chat
      )
    );
  }, []);

  const maximizeChat = useCallback((recipientId: string) => {
    setActiveChats(prev =>
      prev.map(chat =>
        chat.recipientId === recipientId
          ? { ...chat, isMinimized: false }
          : chat
      )
    );
  }, []);

  return (
    <ChatContext.Provider
      value={{
        activeChats,
        startChat,
        closeChat,
        minimizeChat,
        maximizeChat
      }}
    >
      {children}
      {/* Render active chat windows */}
      {activeChats.map(chat => (
        <ChatWindow
          key={chat.recipientId}
          recipientId={chat.recipientId}
          isMinimized={chat.isMinimized}
          onClose={() => closeChat(chat.recipientId)}
          onMinimize={() => 
            chat.isMinimized
              ? maximizeChat(chat.recipientId)
              : minimizeChat(chat.recipientId)
          }
        />
      ))}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}