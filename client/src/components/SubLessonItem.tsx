import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, BookOpen } from "lucide-react";
import { useCourseProgress, type SubLesson } from "../contexts/CourseProgressContext";
import ExerciseForm from "./ExerciseForm";
import { useState } from "react";

interface SubLessonItemProps {
  subLesson: SubLesson;
  lessonId: number;
}

export default function SubLessonItem({ subLesson, lessonId }: SubLessonItemProps) {
  const { updateSubLessonStatus } = useCourseProgress();
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckedChange = (checked: boolean) => {
    updateSubLessonStatus(lessonId, subLesson.id, checked);
  };

  const hasExercises = subLesson.exercises && subLesson.exercises.length > 0;

  return (
    <div className="border rounded-lg">
      <div className="flex items-center space-x-3 p-3 hover:bg-accent/30 rounded-lg cursor-pointer transition-colors duration-200">
        <Checkbox
          id={subLesson.id}
          checked={subLesson.completed}
          onCheckedChange={handleCheckedChange}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
        <Label
          htmlFor={subLesson.id}
          className="text-sm text-foreground cursor-pointer flex-1"
        >
          {subLesson.title}
        </Label>
        
        {hasExercises && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <BookOpen size={14} />
              <span>Exercises</span>
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
              />
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </div>

      {hasExercises && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="px-3 pb-3">
            <div className="mt-3 space-y-4 border-t pt-4">
              {subLesson.exercises?.map((exercise) => (
                <ExerciseForm
                  key={exercise.id}
                  exercise={exercise}
                  lessonId={lessonId}
                  subLessonId={subLesson.id}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
