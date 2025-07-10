import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatHelperContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: Message[];
  addMessage: (role: 'user' | 'assistant', content: string) => void;
  clearMessages: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  sendMessage: (content: string) => Promise<void>;
}

const ChatHelperContext = createContext<ChatHelperContextType | undefined>(undefined);

export const useChatHelper = () => {
  const context = useContext(ChatHelperContext);
  if (!context) {
    throw new Error('useChatHelper must be used within a ChatHelperProvider');
  }
  return context;
};

interface ChatHelperProviderProps {
  children: ReactNode;
}

export const ChatHelperProvider: React.FC<ChatHelperProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chatHelperMessages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch {
        return [];
      }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatHelperMessages', JSON.stringify(messages));
  }, [messages]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatHelperMessages');
  };

  const sendMessage = async (content: string) => {
    // Add user message
    addMessage('user', content);
    setIsLoading(true);

    try {
      // Prepare messages for API (include conversation history)
      const apiMessages = [
        {
          role: 'system',
          content: 'You are a helpful AI assistant for the AI Native Foundations course. Provide clear, concise, and practical advice related to AI, machine learning, prompt engineering, and the course content.'
        },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content
        }
      ];

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
          model: 'openai/gpt-4o-mini'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      
      // Add AI response
      addMessage('assistant', aiResponse);
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatHelperContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        addMessage,
        clearMessages,
        isLoading,
        setIsLoading,
        sendMessage
      }}
    >
      {children}
    </ChatHelperContext.Provider>
  );
};