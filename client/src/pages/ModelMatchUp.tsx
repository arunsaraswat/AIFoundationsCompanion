import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';
import { useExercise } from '../contexts/ExerciseContext';
import { categories } from '../data/useCases';
import { getOverallProgress } from '../utils/validation';
import DragDropCard from '../components/DragDropCard';
import DropZone from '../components/DropZone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ModelMatchUp() {
  const { useCases, updateUseCase, resetExercise } = useExercise();
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const progress = getOverallProgress(useCases);

  const unclassifiedCases = useCases.filter(uc => !uc.userCategory);
  const classifiedCases = useCases.filter(uc => uc.userCategory);

  const handleDrop = (category: string, useCaseId?: string) => {
    if (useCaseId) {
      updateUseCase(useCaseId, { userCategory: category });
    }
    setActiveDropZone(null);
  };

  const handleDragStart = (useCaseId: string) => {
    // Store the use case ID for drop handling
    const draggedCard = document.querySelector(`[data-usecase="${useCaseId}"]`);
    if (draggedCard) {
      draggedCard.setAttribute('data-dragging', 'true');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={16} className="mr-2" />
                Back to Course
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Exercise 5: Model Match-Up</h1>
              <p className="text-muted-foreground">Classify AI use cases and analyze their inputs/outputs</p>
            </div>
          </div>
          <Button variant="outline" onClick={resetExercise}>
            <RotateCcw size={16} className="mr-2" />
            Reset
          </Button>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Progress</CardTitle>
              <span className="text-sm text-muted-foreground">
                {progress.categorized + progress.analyzed} / {progress.total * 2} tasks completed
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress.percentage} className="mb-2" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Categorized:</span>
                <span className="ml-2 font-medium">{progress.categorized} / {progress.total}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Analyzed:</span>
                <span className="ml-2 font-medium">{progress.analyzed} / {progress.total}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Step 1: Unclassified Cards */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step 1: Drag to Classify</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Drag each use case to the appropriate category
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <AnimatePresence>
                    {unclassifiedCases.map((useCase) => (
                      <motion.div
                        key={useCase.id}
                        data-usecase={useCase.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        onDragStart={() => handleDragStart(useCase.id)}
                      >
                        <DragDropCard
                          useCase={useCase}
                          onUpdate={(updates) => updateUseCase(useCase.id, updates)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {unclassifiedCases.length === 0 && (
                    <div className="text-center py-8">
                      <CheckCircle className="mx-auto text-green-500 mb-2" size={48} />
                      <p className="text-sm text-muted-foreground">
                        All use cases classified!
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Step 1: Drop Zones */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Classification Categories</h2>
              <p className="text-sm text-muted-foreground">
                Drop the use case cards into the category that best describes the underlying technology
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {categories.map((category) => (
                <DropZone
                  key={category.id}
                  category={category}
                  onDrop={(cat) => {
                    const draggedElement = document.querySelector('[data-dragging="true"]');
                    if (draggedElement) {
                      const useCaseId = draggedElement.getAttribute('data-usecase');
                      if (useCaseId) {
                        handleDrop(cat, useCaseId);
                        draggedElement.removeAttribute('data-dragging');
                      }
                    }
                  }}
                  isActive={activeDropZone === category.id}
                />
              ))}
            </div>

            {/* Step 2: Classified Cards */}
            {classifiedCases.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Step 2: Input/Output Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {classifiedCases.map((useCase) => (
                      <motion.div
                        key={useCase.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                      >
                        <DragDropCard
                          useCase={useCase}
                          onUpdate={(updates) => updateUseCase(useCase.id, updates)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Completion Message */}
        {progress.percentage === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardContent className="p-6 text-center">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-2">
                  Exercise Complete!
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  You've successfully classified all use cases and analyzed their inputs and outputs.
                  Your progress has been saved automatically.
                </p>
                <Link href="/">
                  <Button className="mt-4">
                    Return to Course
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}