import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourseProgress } from "../contexts/CourseProgressContext";

interface QuickDecisionPromptProps {
  lessonId: number;
  subLessonId: string;
  exerciseId: string;
  stepId: string;
}

interface DecisionFields {
  role: string;
  issue: string;
}

export default function QuickDecisionPrompt({ lessonId, subLessonId, exerciseId, stepId }: QuickDecisionPromptProps) {
  const { updateStepAnswer } = useCourseProgress();
  const [fields, setFields] = useState<DecisionFields>(() => {
    // Try to load saved data
    const saved = localStorage.getItem(`quickDecisionPrompt_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back to empty state
      }
    }
    return {
      role: "",
      issue: ""
    };
  });

  const [showFormattedPrompt, setShowFormattedPrompt] = useState(false);

  const updateField = (field: keyof DecisionFields, value: string) => {
    const newFields = { ...fields, [field]: value };
    setFields(newFields);
    // Save to localStorage
    localStorage.setItem(`quickDecisionPrompt_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`, JSON.stringify(newFields));
  };

  const handleDone = () => {
    const formattedPrompt = `I'm a ${fields.role}. I need to make a decision about ${fields.issue}. What are 3 options I should consider, and what are the trade-offs of each from my point of view?`;

    updateStepAnswer(lessonId, subLessonId, exerciseId, stepId, formattedPrompt);
    setShowFormattedPrompt(true);
  };

  const isComplete = fields.role.trim() !== "" && fields.issue.trim() !== "";

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="role">Your role</Label>
          <Input
            id="role"
            value={fields.role}
            onChange={(e) => updateField("role", e.target.value)}
            placeholder="e.g., Product Manager, Teacher, Marketing Director"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="issue">Brief issue or decision</Label>
          <Input
            id="issue"
            value={fields.issue}
            onChange={(e) => updateField("issue", e.target.value)}
            placeholder="e.g., choosing a new software tool, budget allocation"
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={handleDone}
          disabled={!isComplete}
          className="w-full max-w-xs"
        >
          Done - Show Formatted Prompt
        </Button>
      </div>

      {showFormattedPrompt && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Your Quick Decision Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm">
              I'm a <strong>{fields.role}</strong>. I need to make a decision about <strong>{fields.issue}</strong>. What are 3 options I should consider, and what are the trade-offs of each from my point of view?
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}