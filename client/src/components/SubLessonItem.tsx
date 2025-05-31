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
    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center space-x-3 p-3 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 rounded-lg transition-colors duration-200">
          <Checkbox
            id={subLesson.id}
            checked={subLesson.completed}
            onCheckedChange={handleCheckedChange}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <CollapsibleTrigger className="flex-1 text-left">
            <Label
              htmlFor={subLesson.id}
              className="text-sm text-foreground font-bold cursor-pointer"
            >
              {subLesson.title}
            </Label>
          </CollapsibleTrigger>
          
          {hasExercises && (
            <CollapsibleTrigger className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <BookOpen size={14} />
              <span>Exercises</span>
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
              />
            </CollapsibleTrigger>
          )}
        </div>

        {hasExercises && (
          <CollapsibleContent className="px-3 pb-3">
            <div className="mt-3 space-y-4 border-t border-blue-200 dark:border-blue-800 pt-4">
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
        )}
      </Collapsible>
    </div>
  );
}
