import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DropZoneProps {
  category: {
    id: string;
    title: string;
    description: string;
  };
  onDrop: (category: string) => void;
  isActive?: boolean;
}

export default function DropZone({ category, onDrop, isActive = false }: DropZoneProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(category.id);
  };

  return (
    <motion.div
      layout
      className="h-full min-h-[200px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Card className={`h-full border-2 border-dashed transition-all duration-200 ${
        isActive 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      }`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-center">{category.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground text-center">
            {category.description}
          </p>
          <div className="mt-4 text-center">
            <span className="text-xs text-muted-foreground">
              Drop cards here
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}