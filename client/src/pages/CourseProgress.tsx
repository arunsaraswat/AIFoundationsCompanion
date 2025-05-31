import { useCourseProgress } from "../contexts/CourseProgressContext";
import ProgressBar from "../components/ProgressBar";
import LessonAccordion from "../components/LessonAccordion";

export default function CourseProgress() {
  const { lessons, getOverallProgress } = useCourseProgress();
  const overallProgress = getOverallProgress();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <ProgressBar {...overallProgress} />
      
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <LessonAccordion key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  );
}
