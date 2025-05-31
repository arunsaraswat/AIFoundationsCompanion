import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useCourseProgress, type Lesson } from "../contexts/CourseProgressContext";
import SubLessonItem from "./SubLessonItem";

interface LessonAccordionProps {
  lesson: Lesson;
}

export default function LessonAccordion({ lesson }: LessonAccordionProps) {
  const { getLessonProgress } = useCourseProgress();
  const progress = getLessonProgress(lesson.id);
  
  const getStatusIcon = () => {
    if (progress.isCompleted) {
      return (
        <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
          <Check className="text-emerald-600 dark:text-emerald-400" size={14} />
        </div>
      );
    } else if (progress.completed > 0) {
      return (
        <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
          <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full" />
        </div>
      );
    } else {
      return (
        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full" />
        </div>
      );
    }
  };

  return (
    <Card className="shadow-sm transition-colors duration-300">
      <div className="px-6 py-4">
        <div className="flex items-center space-x-4 mb-4">
          {getStatusIcon()}
          <div className="text-left">
            <h3 className="text-lg font-medium text-foreground">
              Lesson {lesson.id}: {lesson.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {progress.completed} of {progress.total} sub-lessons completed
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          {lesson.subLessons.map((subLesson) => (
            <SubLessonItem
              key={subLesson.id}
              subLesson={subLesson}
              lessonId={lesson.id}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
