import React, { createContext, useContext, useState, useEffect } from 'react';
import { UseCase, useCases as initialUseCases } from '../data/useCases';

interface ExerciseContextType {
  useCases: UseCase[];
  updateUseCase: (id: string, updates: Partial<UseCase>) => void;
  resetExercise: () => void;
  saveProgress: () => void;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

const STORAGE_KEY = 'model-matchup-progress';

export function ExerciseProvider({ children }: { children: React.ReactNode }) {
  const [useCases, setUseCases] = useState<UseCase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((saved: UseCase) => {
          const original = initialUseCases.find(uc => uc.id === saved.id);
          return { ...original, ...saved };
        });
      }
    } catch (error) {
      console.warn('Failed to load exercise progress:', error);
    }
    return initialUseCases;
  });

  const updateUseCase = (id: string, updates: Partial<UseCase>) => {
    setUseCases(prev => 
      prev.map(uc => 
        uc.id === id ? { ...uc, ...updates } : uc
      )
    );
  };

  const resetExercise = () => {
    setUseCases(initialUseCases);
    localStorage.removeItem(STORAGE_KEY);
  };

  const saveProgress = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(useCases));
    } catch (error) {
      console.warn('Failed to save exercise progress:', error);
    }
  };

  useEffect(() => {
    saveProgress();
  }, [useCases]);

  return (
    <ExerciseContext.Provider value={{
      useCases,
      updateUseCase,
      resetExercise,
      saveProgress
    }}>
      {children}
    </ExerciseContext.Provider>
  );
}

export function useExercise() {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercise must be used within ExerciseProvider');
  }
  return context;
}