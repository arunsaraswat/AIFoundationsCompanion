import { useState, useEffect, useRef } from "react";
import { useCourseProgress, type Lesson } from "../contexts/CourseProgressContext";
import { useLocation } from "wouter";
import ExerciseForm from "../components/ExerciseForm";
import { usePdfViewer } from "../contexts/PdfViewerContext";
import { Check, Clock, ChevronDown, ChevronRight, FileText } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface LessonPageProps {
  lessonId: number;
  subLessonId?: string;
}

export default function LessonPage({ lessonId, subLessonId }: LessonPageProps) {
  const { lessons, isLoading, getLessonProgress, updateSubLessonStatus } = useCourseProgress();
  const lesson = lessons.find(l => l.id === lessonId);
  const [openSubLessons, setOpenSubLessons] = useState<string[]>([]);
  const { openPdf } = usePdfViewer();
  const [, setLocation] = useLocation();
  const hasExpandedSubLesson = useRef(false);
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Loading...</h1>
        <p className="text-muted-foreground">Please wait while the lesson loads.</p>
      </div>
    );
  }
  
  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Lesson Not Found</h1>
        <p className="text-muted-foreground">The requested lesson could not be found.</p>
      </div>
    );
  }

  const progress = getLessonProgress(lesson.id);

  // Reset expansion flag when subLessonId changes
  useEffect(() => {
    hasExpandedSubLesson.current = false;
  }, [subLessonId]);

  // Auto-expand sub-lesson if specified in URL
  useEffect(() => {
    if (subLessonId && lesson && !hasExpandedSubLesson.current) {
      // Check if the sub-lesson exists in this lesson
      const subLessonExists = lesson.subLessons.some(sl => sl.id === subLessonId);
      if (subLessonExists) {
        setOpenSubLessons(prev => [...prev, subLessonId]);
        hasExpandedSubLesson.current = true;
      }
    }
  }, [subLessonId, lesson]);

  const toggleSubLesson = (subLessonId: string) => {
    const isCurrentlyOpen = openSubLessons.includes(subLessonId);
    
    if (isCurrentlyOpen) {
      // Closing - remove from openSubLessons and update URL to remove subLessonId
      setOpenSubLessons(prev => prev.filter(id => id !== subLessonId));
      setLocation(`/lesson/${lessonId}`);
    } else {
      // Opening - add to openSubLessons and update URL to include subLessonId
      setOpenSubLessons(prev => [...prev, subLessonId]);
      setLocation(`/lesson/${lessonId}/${subLessonId}`);
    }
  };



  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Lesson {lesson.id}: {lesson.title}
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          {progress.completed} of {progress.total} sub-lessons completed
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(progress.completed / progress.total) * 100}%` }}
          />
        </div>
        
        {/* View Lesson Content Button for Lesson 1, 2, and 3 */}
        {(lesson.id === 1 || lesson.id === 2 || lesson.id === 3) && (
          <div className="mt-6">
            <Button 
              onClick={() => openPdf(`Lesson ${lesson.id}: ${lesson.title}`, `/assets/lesson${lesson.id}.pdf`)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FileText className="h-4 w-4" />
              View Lesson Content
            </Button>
          </div>
        )}
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
                <div className="p-3 md:p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <Checkbox
                      checked={subLesson.completed}
                      onCheckedChange={(checked) => 
                        updateSubLessonStatus(lesson.id, subLesson.id, checked as boolean)
                      }
                      className="flex-shrink-0"
                    />
                    <CollapsibleTrigger className="flex items-center space-x-3 flex-1 text-left hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors rounded px-2 py-1 min-w-0">
                      <h2 className="text-base md:text-lg font-semibold text-foreground break-words">
                        {subLesson.title}
                      </h2>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleTrigger className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors rounded flex-shrink-0 ml-2">
                    {isOpen ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </CollapsibleTrigger>
                </div>
                
                <CollapsibleContent>
                  {subLesson.exercises && subLesson.exercises.length > 0 && (
                    <div className="px-3 md:px-4 pb-3 md:pb-4 space-y-4">
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