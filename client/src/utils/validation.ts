import { UseCase } from '../data/useCases';

export interface ValidationResult {
  isCorrect: boolean;
  message: string;
}

export function validateCategory(useCase: UseCase, userCategory: string): ValidationResult {
  const isCorrect = userCategory === useCase.correctCategory;
  
  return {
    isCorrect,
    message: isCorrect 
      ? `Correct! ${useCase.rationale}`
      : `Not quite. ${useCase.rationale}`
  };
}

export function validateInputOutput(input: string, output: string): ValidationResult {
  const hasInput = input.trim().length > 0;
  const hasOutput = output.trim().length > 0;
  
  if (!hasInput && !hasOutput) {
    return {
      isCorrect: false,
      message: "Please provide both input and output descriptions."
    };
  }
  
  if (!hasInput) {
    return {
      isCorrect: false,
      message: "Please describe what kind of input this system uses."
    };
  }
  
  if (!hasOutput) {
    return {
      isCorrect: false,
      message: "Please describe what kind of output this system produces."
    };
  }
  
  return {
    isCorrect: true,
    message: "Great! You've identified the key inputs and outputs."
  };
}

export function getOverallProgress(useCases: UseCase[]): {
  categorized: number;
  analyzed: number;
  total: number;
  percentage: number;
} {
  const categorized = useCases.filter(uc => uc.userCategory).length;
  const analyzed = useCases.filter(uc => uc.userInput && uc.userOutput).length;
  const total = useCases.length;
  
  return {
    categorized,
    analyzed,
    total,
    percentage: Math.round(((categorized + analyzed) / (total * 2)) * 100)
  };
}