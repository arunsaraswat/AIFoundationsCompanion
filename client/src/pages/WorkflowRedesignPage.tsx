import { useParams } from "wouter";
import { WorkflowRedesignWizard } from "@/components/WorkflowRedesignWizard";

export default function WorkflowRedesignPage() {
  const { lessonId, subLessonId } = useParams();

  return (
    <div className="container mx-auto py-8">
      <WorkflowRedesignWizard lessonId={lessonId} subLessonId={subLessonId} />
    </div>
  );
}