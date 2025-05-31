import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCourseProgress, type SubLesson } from "../contexts/CourseProgressContext";

interface SubLessonItemProps {
  subLesson: SubLesson;
  lessonId: number;
}

export default function SubLessonItem({ subLesson, lessonId }: SubLessonItemProps) {
  const { updateSubLessonStatus } = useCourseProgress();

  const handleCheckedChange = (checked: boolean) => {
    updateSubLessonStatus(lessonId, subLesson.id, checked);
  };

  return (
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
    </div>
  );
}
