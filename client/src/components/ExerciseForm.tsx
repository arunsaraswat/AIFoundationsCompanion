import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useCourseProgress, type Exercise } from "../contexts/CourseProgressContext";

interface ExerciseFormProps {
  exercise: Exercise;
  lessonId: number;
  subLessonId: string;
}

export default function ExerciseForm({ exercise, lessonId, subLessonId }: ExerciseFormProps) {
  const { updateExerciseAnswer, updateFollowUpAnswer, updateStepAnswer } = useCourseProgress();

  const handleAnswerChange = (value: string) => {
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
        // Special handling for interactive Model Match-Up exercise
        if (exercise.id === "2.1.2") {
          return (
            <div className="mt-2 space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                  This exercise has been converted to an interactive drag-and-drop experience!
                </p>
                <Link href="/model-matchup">
                  <Button className="w-full">
                    <ExternalLink size={16} className="mr-2" />
                    Launch Interactive Exercise
                  </Button>
                </Link>
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Notes from the interactive exercise (optional):
                </Label>
                <Textarea
                  value={exercise.answer as string || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  placeholder="Record any insights or notes from completing the interactive exercise..."
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>
          );
        }
        
        return (
          <Input
            value={exercise.answer as string || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter your answer..."
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
            onValueChange={handleAnswerChange}
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

      case 'radio-with-text':
        return (
          <div className="mt-2 space-y-4">
            <RadioGroup
              value={exercise.answer as string || ''}
              onValueChange={handleAnswerChange}
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
                <p className="text-xs text-muted-foreground mb-3">
                  {exercise.followUpDescription}
                </p>
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
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    {step.description}
                  </p>
                )}
                {step.type === 'textarea' ? (
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
      
      default:
        return null;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">{exercise.label}</CardTitle>
        {exercise.description && (
          <CardDescription className="text-sm leading-relaxed">
            {exercise.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {renderFormField()}
      </CardContent>
    </Card>
  );
}