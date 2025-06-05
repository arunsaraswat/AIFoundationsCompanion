import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourseProgress } from "../contexts/CourseProgressContext";

interface PromptAnatomyProps {
  lessonId: number;
  subLessonId: string;
  exerciseId: string;
  stepId: string;
}

interface AnatomyFields {
  role: string;
  whoInvolved: string;
  challenge: string;
  whereHappening: string;
  whenHappening: string;
  whyMatters: string;
  outputFormat: string;
}

export default function PromptAnatomy({ lessonId, subLessonId, exerciseId, stepId }: PromptAnatomyProps) {
  const { updateStepAnswer } = useCourseProgress();
  const [fields, setFields] = useState<AnatomyFields>(() => {
    // Try to load saved data
    const saved = localStorage.getItem(`promptAnatomy_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back to empty state
      }
    }
    return {
      role: "",
      whoInvolved: "",
      challenge: "",
      whereHappening: "",
      whenHappening: "",
      whyMatters: "",
      outputFormat: ""
    };
  });

  const [showFormattedPrompt, setShowFormattedPrompt] = useState(false);

  // Listen for storage changes to reset component when data is cleared
  useEffect(() => {
    const handleStorageChange = () => {
      const storageKey = `promptAnatomy_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`;
      const saved = localStorage.getItem(storageKey);
      
      if (!saved) {
        // Data was cleared, reset component
        setFields({
          role: "",
          whoInvolved: "",
          challenge: "",
          whereHappening: "",
          whenHappening: "",
          whyMatters: "",
          outputFormat: ""
        });
        setShowFormattedPrompt(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [lessonId, subLessonId, exerciseId, stepId]);

  const updateField = (field: keyof AnatomyFields, value: string) => {
    const newFields = { ...fields, [field]: value };
    setFields(newFields);
    // Save to localStorage
    localStorage.setItem(`promptAnatomy_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`, JSON.stringify(newFields));
  };

  const handleDone = () => {
    const formattedPrompt = `Role: ${fields.role}
Who is involved: ${fields.whoInvolved}
Challenge/Decision: ${fields.challenge}
Where: ${fields.whereHappening}
When: ${fields.whenHappening}
Why it matters: ${fields.whyMatters}
Output format: ${fields.outputFormat}`;

    updateStepAnswer(lessonId, subLessonId, exerciseId, stepId, formattedPrompt);
    setShowFormattedPrompt(true);
  };

  const isComplete = Object.values(fields).every(field => field.trim() !== "");

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="role">Role: [your role]</Label>
          <Input
            id="role"
            value={fields.role}
            onChange={(e) => updateField("role", e.target.value)}
            placeholder="e.g., Product Manager, Teacher, etc."
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="whoInvolved">Who is involved?</Label>
          <Input
            id="whoInvolved"
            value={fields.whoInvolved}
            onChange={(e) => updateField("whoInvolved", e.target.value)}
            placeholder="e.g., team members, stakeholders, customers"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="challenge">What is the challenge or decision?</Label>
          <Input
            id="challenge"
            value={fields.challenge}
            onChange={(e) => updateField("challenge", e.target.value)}
            placeholder="Describe the specific decision or problem"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="whereHappening">Where is it happening (team, system, etc.)?</Label>
          <Input
            id="whereHappening"
            value={fields.whereHappening}
            onChange={(e) => updateField("whereHappening", e.target.value)}
            placeholder="e.g., marketing team, customer service department"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="whenHappening">When is this happening or when is a decision needed?</Label>
          <Input
            id="whenHappening"
            value={fields.whenHappening}
            onChange={(e) => updateField("whenHappening", e.target.value)}
            placeholder="e.g., by end of week, next quarter planning"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="whyMatters">Why does this matter (what's at stake)?</Label>
          <Input
            id="whyMatters"
            value={fields.whyMatters}
            onChange={(e) => updateField("whyMatters", e.target.value)}
            placeholder="e.g., budget impact, team morale, customer satisfaction"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="outputFormat">Preferred output format</Label>
          <Input
            id="outputFormat"
            value={fields.outputFormat}
            onChange={(e) => updateField("outputFormat", e.target.value)}
            placeholder="e.g., pros/cons, table, ranked options, recommendation"
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
          Done - Show Context
        </Button>
      </div>

      {showFormattedPrompt && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Your Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm whitespace-pre-line max-h-96 overflow-y-auto">
              <strong>Role:</strong> {fields.role}
              {"\n"}<strong>Who is involved:</strong> {fields.whoInvolved}
              {"\n"}<strong>Challenge/Decision:</strong> {fields.challenge}
              {"\n"}<strong>Where:</strong> {fields.whereHappening}
              {"\n"}<strong>When:</strong> {fields.whenHappening}
              {"\n"}<strong>Why it matters:</strong> {fields.whyMatters}
              {"\n"}<strong>Output format:</strong> {fields.outputFormat}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}