import { useState } from "react";
import { useCourseProgress, type Lesson } from "../contexts/CourseProgressContext";
import ExerciseForm from "../components/ExerciseForm";
import { Check, Clock, ChevronDown, ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";

interface LessonPageProps {
  lessonId: number;
}

export default function LessonPage({ lessonId }: LessonPageProps) {
  const { lessons, getLessonProgress, updateSubLessonStatus } = useCourseProgress();
  const lesson = lessons.find(l => l.id === lessonId);
  const [openSubLessons, setOpenSubLessons] = useState<string[]>([]);
  
  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Lesson Not Found</h1>
        <p className="text-muted-foreground">The requested lesson could not be found.</p>
      </div>
    );
  }

  const progress = getLessonProgress(lesson.id);

  const toggleSubLesson = (subLessonId: string) => {
    setOpenSubLessons(prev => 
      prev.includes(subLessonId) 
        ? prev.filter(id => id !== subLessonId)
        : [...prev, subLessonId]
    );
  };



  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Lesson {lesson.id}: {lesson.title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {progress.completed} of {progress.total} sub-lessons completed
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(progress.completed / progress.total) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {lesson.subLessons.map((subLesson) => {
          const isOpen = openSubLessons.includes(subLesson.id);
          
          return (
            <Collapsible 
              key={subLesson.id} 
              open={isOpen} 
              onOpenChange={() => toggleSubLesson(subLesson.id)}
            >
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Checkbox
                      checked={subLesson.completed}
                      onCheckedChange={(checked) => 
                        updateSubLessonStatus(lesson.id, subLesson.id, checked as boolean)
                      }
                      className="flex-shrink-0"
                    />
                    <CollapsibleTrigger className="flex items-center space-x-3 flex-1 text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors rounded px-2 py-1">
                      <h2 className="text-lg font-semibold text-foreground">
                        {subLesson.title}
                      </h2>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleTrigger className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors rounded">
                    {isOpen ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                </div>
                
                <CollapsibleContent>
                  {subLesson.exercises && subLesson.exercises.length > 0 && (
                    <div className="px-4 pb-4 space-y-4">
                      {subLesson.exercises.map((exercise) => (
                        <ExerciseForm
                          key={exercise.id}
                          exercise={exercise}
                          lessonId={lesson.id}
                          subLessonId={subLesson.id}
                        />
                      ))}
                    </div>
                  )}
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
}