import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  completed: number;
  total: number;
  percentage: number;
}

export default function ProgressBar({ completed, total, percentage }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-foreground mb-4">Overall Progress</h2>
      
      <div className="space-y-2">
        <Progress value={percentage} className="h-3" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{completed} of {total} sub-lessons completed</span>
          <span>{percentage}%</span>
        </div>
      </div>
    </div>
  );
}
