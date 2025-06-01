import { useCourseProgress, type Lesson } from "../contexts/CourseProgressContext";
import ExerciseForm from "../components/ExerciseForm";
import { Check, Clock } from "lucide-react";

interface LessonPageProps {
  lessonId: number;
}

export default function LessonPage({ lessonId }: LessonPageProps) {
  const { lessons, getLessonProgress } = useCourseProgress();
  const lesson = lessons.find(l => l.id === lessonId);
  
  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Lesson Not Found</h1>
        <p className="text-muted-foreground">The requested lesson could not be found.</p>
      </div>
    );
  }

  const progress = getLessonProgress(lesson.id);

  const getSubLessonIcon = (subLessonId: string) => {
    const subLesson = lesson.subLessons.find(sl => sl.id === subLessonId);
    if (subLesson?.completed) {
      return (
        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
          <Check className="text-emerald-600 dark:text-emerald-400" size={12} />
        </div>
      );
    } else {
      return (
        <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <Clock className="text-gray-400 dark:text-gray-500" size={12} />
        </div>
      );
    }
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

      <div className="space-y-8">
        {lesson.subLessons.map((subLesson) => (
          <div key={subLesson.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-6">
            <div className="flex items-center space-x-3 mb-4">
              {getSubLessonIcon(subLesson.id)}
              <h2 className="text-xl font-semibold text-foreground">
                {subLesson.title}
              </h2>
            </div>
            
            {subLesson.exercises && subLesson.exercises.length > 0 && (
              <div className="ml-8 space-y-4">
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
          </div>
        ))}
      </div>
    </div>
  );
}