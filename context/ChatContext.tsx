
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  handleExternalQuery: (query: string) => void;
  externalQuery: string | null;
  clearExternalQuery: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [externalQuery, setExternalQuery] = useState<string | null>(null);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen(prev => !prev);
  
  const handleExternalQuery = (query: string) => {
    setExternalQuery(query);
    setIsOpen(true);
  };

  const clearExternalQuery = () => setExternalQuery(null);

  return (
    <ChatContext.Provider value={{ isOpen, openChat, closeChat, toggleChat, handleExternalQuery, externalQuery, clearExternalQuery }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
