import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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

interface AIResponseState {
  aiResponse: string;
  isLoadingAI: boolean;
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
  const [aiState, setAIState] = useState<AIResponseState>({
    aiResponse: "",
    isLoadingAI: false
  });

  // Listen for storage changes to reset component when data is cleared
  useEffect(() => {
    const handleStorageChange = () => {
      const storageKey = `quickDecisionPrompt_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`;
      const saved = localStorage.getItem(storageKey);
      
      if (!saved) {
        // Data was cleared, reset component
        setFields({ role: "", issue: "" });
        setShowFormattedPrompt(false);
        setAIState({ aiResponse: "", isLoadingAI: false });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [lessonId, subLessonId, exerciseId, stepId]);

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

  const fetchAIResponse = async () => {
    const prompt = `I'm a ${fields.role}. I need to make a decision about ${fields.issue}. What are 3 options I should consider, and what are the trade-offs of each from my point of view?`;
    
    setAIState(prev => ({ ...prev, isLoadingAI: true }));
    
    try {
      const response = await fetch('/api/openrouter-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      setAIState({ 
        aiResponse: data.completion,
        isLoadingAI: false 
      });
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setAIState({ 
        aiResponse: "Error: Could not get AI response",
        isLoadingAI: false 
      });
    }
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

      {showFormattedPrompt && (
        <div className="space-y-4">
          <Separator />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Model Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  onClick={fetchAIResponse}
                  variant="outline"
                  className="w-full"
                  disabled={aiState.isLoadingAI}
                >
                  {aiState.isLoadingAI ? "Getting AI Response..." : aiState.aiResponse ? "Get Another AI Response" : "Get AI Response"}
                </Button>
                
                {aiState.isLoadingAI && (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-muted-foreground">Processing...</span>
                  </div>
                )}
                
                {aiState.aiResponse && (
                  <div className="bg-amber-950 text-amber-300 rounded-lg border border-amber-700 font-mono text-sm max-h-80 overflow-hidden">
                    <div className="p-4 pb-2">
                      <div className="text-amber-400 text-xs mb-2 font-bold tracking-wider">
                        &gt; AI MODEL OUTPUT
                      </div>
                    </div>
                    <div className="px-4 pb-4 max-h-64 overflow-y-auto">
                      <div className="whitespace-pre-wrap leading-relaxed">
                        {aiState.aiResponse}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}