import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourseProgress, type Exercise } from "../contexts/CourseProgressContext";
import { FileText, ExternalLink } from "lucide-react";

import TokenPrediction from "./TokenPrediction";
import PromptAnatomy from "./PromptAnatomy";
import QuickDecisionPrompt from "./QuickDecisionPrompt";
import RisePrompt from "./RisePrompt";
import RagStep1 from "./RagStep1";
import RagStep2 from "./RagStep2";
import RagTestQuestions from "./RagTestQuestions";
import AgentDesignStep1 from "./AgentDesignStep1";
import AgentDesignStep2 from "./AgentDesignStep2";
import ModelComparison from "./ModelComparison";
import TransformationPrompt from "./TransformationPrompt";

interface ExerciseFormProps {
  exercise: Exercise;
  lessonId: number;
  subLessonId: string;
}

export default function ExerciseForm({ exercise, lessonId, subLessonId }: ExerciseFormProps) {
  const { updateExerciseAnswer, updateFollowUpAnswer, updateStepAnswer } = useCourseProgress();

  const handleAnswerChange = (value: string | string[]) => {
    updateExerciseAnswer(lessonId, subLessonId, exercise.id, value);
  };

  const handleFollowUpAnswerChange = (value: string) => {
    updateFollowUpAnswer(lessonId, subLessonId, exercise.id, value);
  };

  const handleStepAnswerChange = (stepId: string, value: string) => {
    updateStepAnswer(lessonId, subLessonId, exercise.id, stepId, value);
  };

  const renderFormField = () => {
    switch (exercise.type) {
      case 'text':
        const textPlaceholder = exercise.id === 'discussion-5' 
          ? "Enter your response..."
          : "Enter your answer...";
        return (
          <Input
            value={exercise.answer as string || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder={textPlaceholder}
            className="mt-2"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={exercise.answer as string || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter your response..."
            className="mt-2 min-h-[100px]"
            rows={4}
          />
        );
      
      case 'radio':
        return (
          <RadioGroup
            value={exercise.answer as string || ''}
            onValueChange={(value) => handleAnswerChange(value)}
            className="mt-2 space-y-3"
          >
            {exercise.options?.map((option, index) => (
              <div key={index} className="flex items-start space-x-2">
                <RadioGroupItem value={option} id={`${exercise.id}-${index}`} className="mt-1" />
                <Label 
                  htmlFor={`${exercise.id}-${index}`} 
                  className="text-sm leading-relaxed cursor-pointer flex-1"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        const handleCheckboxChange = (option: string, checked: boolean) => {
          const currentAnswers = Array.isArray(exercise.answer) ? exercise.answer : [];
          if (checked) {
            if (!currentAnswers.includes(option)) {
              handleAnswerChange([...currentAnswers, option]);
            }
          } else {
            handleAnswerChange(currentAnswers.filter(item => item !== option));
          }
        };

        return (
          <div className="mt-2 space-y-3">
            {exercise.options?.map((option, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Checkbox
                  id={`${exercise.id}-${index}`}
                  checked={Array.isArray(exercise.answer) && exercise.answer.includes(option)}
                  onCheckedChange={(checked) => handleCheckboxChange(option, !!checked)}
                  className="mt-1"
                />
                <Label 
                  htmlFor={`${exercise.id}-${index}`} 
                  className="text-sm leading-relaxed cursor-pointer flex-1"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'radio-with-text':
        return (
          <div className="mt-2 space-y-4">
            <RadioGroup
              value={exercise.answer as string || ''}
              onValueChange={(value) => handleAnswerChange(value)}
              className="space-y-3"
            >
              {exercise.options?.map((option, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <RadioGroupItem value={option} id={`${exercise.id}-${index}`} className="mt-1" />
                  <Label 
                    htmlFor={`${exercise.id}-${index}`} 
                    className="text-sm leading-relaxed cursor-pointer flex-1"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Label className="text-sm font-medium text-foreground mb-2 block">
                {exercise.followUpLabel || "Follow-up:"}
              </Label>
              {exercise.followUpDescription && (
                <p 
                  className="text-xs text-muted-foreground mb-3"
                  dangerouslySetInnerHTML={{ __html: exercise.followUpDescription }}
                />
              )}
              <Textarea
                value={exercise.followUpAnswer || ''}
                onChange={(e) => handleFollowUpAnswerChange(e.target.value)}
                placeholder="Share your thoughts and examples..."
                className="min-h-[100px]"
                rows={4}
              />
            </div>
          </div>
        );

      case 'multi-step':
        return (
          <div className="mt-2 space-y-4">
            {exercise.steps?.map((step, index) => (
              <div key={step.id} className="border-l-4 border-blue-200 dark:border-blue-700 pl-4 py-2">
                <h4 className="font-medium text-sm text-foreground mb-2">{step.label}</h4>
                {step.description && (
                  <p 
                    className="text-xs text-muted-foreground mb-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: step.description }}
                  />
                )}
                {/* Special handling for Step 1 quick decision prompt */}
                {step.id === 'step-1' && exercise.id === 'exercise-11' ? (
                  <QuickDecisionPrompt 
                    lessonId={lessonId}
                    subLessonId={subLessonId}
                    exerciseId={exercise.id}
                    stepId={step.id}
                  />
                ) : /* Special handling for Step 2a anatomy component */
                step.id === 'step-2a' && exercise.id === 'exercise-11' ? (
                  <PromptAnatomy 
                    lessonId={lessonId}
                    subLessonId={subLessonId}
                    exerciseId={exercise.id}
                    stepId={step.id}
                  />
                ) : /* Special handling for Step 2b RISE prompt component */
                step.id === 'step-2b' && exercise.id === 'exercise-11' ? (
                  <RisePrompt 
                    lessonId={lessonId}
                    subLessonId={subLessonId}
                    exerciseId={exercise.id}
                    stepId={step.id}
                  />
                ) : /* Special handling for Step 3 model comparison */
                step.id === 'step-3' && exercise.id === 'exercise-11' ? (
                  <ModelComparison 
                    lessonId={lessonId}
                    subLessonId={subLessonId}
                    exerciseId={exercise.id}
                    stepId={step.id}
                  />
                ) : /* Special handling for Exercise 13 Step 1 RAG testing */
                step.id === 'step-1' && exercise.id === 'exercise-13' ? (
                  <RagStep1 
                    lessonId={lessonId}
                    subLessonId={subLessonId}
                    exerciseId={exercise.id}
                    stepId={step.id}
                  />
                ) : /* Special handling for Exercise 13 Step 2 RAG comparison */
                step.id === 'step-2' && exercise.id === 'exercise-13' ? (
                  <RagStep2 
                    lessonId={lessonId}
                    subLessonId={subLessonId}
                    exerciseId={exercise.id}
                    stepId={step.id}
                  />
                ) : /* Special handling for Exercise 13 Test Questions */
                step.id === 'test-questions' && exercise.id === 'exercise-13' ? (
                  <RagTestQuestions 
                    lessonId={lessonId}
                    subLessonId={subLessonId}
                    exerciseId={exercise.id}
                    stepId={step.id}
                  />
                ) : step.type === 'multi-step' ? (
                  <div className="ml-4 space-y-3">
                    {step.steps?.map((subStep) => (
                      <div key={subStep.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-3 py-1">
                        <Label className="text-xs font-medium text-foreground mb-1 block">{subStep.label}</Label>
                        {subStep.type === 'link' ? (
                          <div className="p-2 border border-primary/20 rounded bg-primary/5">
                            <a 
                              href={subStep.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90 transition-colors"
                            >
                              <FileText className="h-3 w-3" />
                              {subStep.label}
                            </a>
                          </div>
                        ) : (
                          <Input
                            value={subStep.answer as string || ''}
                            onChange={(e) => handleStepAnswerChange(subStep.id, e.target.value)}
                            placeholder="Enter your answer..."
                            className="text-xs"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : step.type === 'link' ? (
                  <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                    <a 
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                      {step.label}
                    </a>
                  </div>
                ) : step.type === 'textarea' ? (
                  <Textarea
                    value={step.answer as string || ''}
                    onChange={(e) => handleStepAnswerChange(step.id, e.target.value)}
                    placeholder="Enter your response..."
                    className="min-h-[80px]"
                    rows={3}
                  />
                ) : (
                  <Input
                    value={step.answer as string || ''}
                    onChange={(e) => handleStepAnswerChange(step.id, e.target.value)}
                    placeholder="Enter your answer..."
                  />
                )}
              </div>
            ))}
          </div>
        );
      
      case 'component':
        if (exercise.component === 'TokenPrediction') {
          return <TokenPrediction />;
        }
        if (exercise.component === 'TransformationPrompt') {
          return <TransformationPrompt 
            lessonId={lessonId} 
            subLessonId={subLessonId} 
            exerciseId={exercise.id} 
            stepId="" 
          />;
        }
        return null;

      case 'link':
        // Check if it's a PDF file
        const isPDF = exercise.link?.endsWith('.pdf');
        return (
          <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
            <a 
              href={exercise.link}
              target={isPDF ? "_blank" : "_self"}
              rel={isPDF ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              {isPDF ? <FileText className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
              {isPDF ? exercise.label : "Start Exercise"}
            </a>
          </div>
        );

      default:
        return null;
    }
  };

  // For component types, render without Card wrapper
  if (exercise.type === 'component') {
    return renderFormField();
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">{exercise.label}</CardTitle>
        {exercise.description && (
          <CardDescription 
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: exercise.description }}
          />
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {renderFormField()}
      </CardContent>
    </Card>
  );
}