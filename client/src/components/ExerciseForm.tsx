import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourseProgress, type Exercise } from "../contexts/CourseProgressContext";
import ModelMatchUp from "./ModelMatchUp";

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
      
      case 'component':
        if (exercise.component === 'ModelMatchUp') {
          return <ModelMatchUp />;
        }
        return null;

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