import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatHelper } from './ChatHelperContext';

export const ChatHelperButton: React.FC = () => {
  const { setIsOpen } = useChatHelper();

  return (
    <Button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
      size="icon"
      title="Open AI Chat Helper"
    >
      <MessageSquare className="h-6 w-6" />
      <span className="sr-only">Open AI Chat Helper</span>
    </Button>
  );
};