import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, RotateCcw } from 'lucide-react';
import { UseCase } from '../data/useCases';
import { validateCategory, validateInputOutput } from '../utils/validation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DragDropCardProps {
  useCase: UseCase;
  onUpdate: (updates: Partial<UseCase>) => void;
  isDragging?: boolean;
}

export default function DragDropCard({ useCase, onUpdate, isDragging = false }: DragDropCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [inputValue, setInputValue] = useState(useCase.userInput || '');
  const [outputValue, setOutputValue] = useState(useCase.userOutput || '');

  const handleCategoryValidation = () => {
    if (!useCase.userCategory) return;
    
    const validation = validateCategory(useCase, useCase.userCategory);
    setShowValidation(true);
    
    if (validation.isCorrect) {
      setTimeout(() => {
        setIsFlipped(true);
        setShowValidation(false);
      }, 2000);
    }
  };

  const handleRetry = () => {
    onUpdate({ userCategory: undefined });
    setShowValidation(false);
    setIsFlipped(false);
  };

  const handleInputOutputSave = () => {
    const validation = validateInputOutput(inputValue, outputValue);
    if (validation.isCorrect) {
      onUpdate({ userInput: inputValue, userOutput: outputValue });
    }
  };

  const validation = useCase.userCategory ? validateCategory(useCase, useCase.userCategory) : null;

  // Show validation state
  if (showValidation && validation) {
    return (
      <motion.div
        layout
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="w-full"
      >
        <Card className={`border-2 ${validation.isCorrect ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {validation.isCorrect ? (
                <Check className="text-green-600 dark:text-green-400 mt-1 flex-shrink-0" size={20} />
              ) : (
                <X className="text-red-600 dark:text-red-400 mt-1 flex-shrink-0" size={20} />
              )}
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-2">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground">{validation.message}</p>
                {!validation.isCorrect && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetry}
                    className="mt-3"
                  >
                    <RotateCcw size={14} className="mr-2" />
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Show input/output form (flipped state)
  if (isFlipped) {
    return (
      <motion.div
        layout
        initial={{ rotateY: 180 }}
        animate={{ rotateY: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-4">
            <h3 className="font-medium text-foreground mb-4">{useCase.title}</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium flex items-center space-x-2">
                  <span>📸</span>
                  <span>Input:</span>
                </Label>
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={useCase.inputPlaceholder}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium flex items-center space-x-2">
                  <span>🧠</span>
                  <span>Output:</span>
                </Label>
                <Input
                  value={outputValue}
                  onChange={(e) => setOutputValue(e.target.value)}
                  placeholder={useCase.outputPlaceholder}
                  className="mt-1"
                />
              </div>
              
              <Button
                onClick={handleInputOutputSave}
                disabled={!inputValue.trim() || !outputValue.trim()}
                className="w-full"
                size="sm"
              >
                Save Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Show draggable card (initial state)
  return (
    <motion.div
      layout
      drag={!useCase.userCategory}
      dragSnapToOrigin={!useCase.userCategory}
      whileDrag={{ scale: 1.05, zIndex: 50 }}
      className={`w-full cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
      onDragEnd={() => {
        if (useCase.userCategory) {
          handleCategoryValidation();
        }
      }}
    >
      <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
        <CardContent className="p-4">
          <h3 className="font-medium text-foreground text-center">{useCase.title}</h3>
          {useCase.userCategory && (
            <div className="mt-2 text-xs text-center text-muted-foreground">
              Categorized as: {useCase.userCategory}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}