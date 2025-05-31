import { useCourseProgress } from "../contexts/CourseProgressContext";
import ProgressBar from "../components/ProgressBar";
import LessonAccordion from "../components/LessonAccordion";

export default function CourseProgress() {
  const { lessons, getOverallProgress } = useCourseProgress();
  const overallProgress = getOverallProgress();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <ProgressBar {...overallProgress} />
      
      <div className="space-y-0">
        {lessons.map((lesson, index) => (
          <div key={lesson.id}>
            <LessonAccordion lesson={lesson} />
            {index < lessons.length - 1 && (
              <hr className="border-t border-gray-200 dark:border-gray-700" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
