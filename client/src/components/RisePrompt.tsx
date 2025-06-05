import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useCourseProgress } from "../contexts/CourseProgressContext";

interface RisePromptProps {
  lessonId: number;
  subLessonId: string;
  exerciseId: string;
  stepId: string;
}

interface AIResponseState {
  aiResponse: string;
  isLoadingAI: boolean;
}

export default function RisePrompt({ lessonId, subLessonId, exerciseId, stepId }: RisePromptProps) {
  const { updateStepAnswer } = useCourseProgress();
  
  const [userPrompt, setUserPrompt] = useState(() => {
    // Try to load saved user prompt
    const saved = localStorage.getItem(`risePrompt_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
    return saved || "";
  });

  const [showFullPrompt, setShowFullPrompt] = useState(() => {
    // Load saved checkbox state
    const saved = localStorage.getItem(`risePromptCheckbox_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
    return saved === 'true';
  });

  const [aiState, setAIState] = useState<AIResponseState>(() => {
    // Try to load saved AI response
    const saved = localStorage.getItem(`risePromptAI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back to empty state
      }
    }
    return {
      aiResponse: "",
      isLoadingAI: false
    };
  });

  // Listen for storage changes to reset component when data is cleared
  useEffect(() => {
    const handleStorageChange = () => {
      const storageKey = `risePrompt_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`;
      const saved = localStorage.getItem(storageKey);
      
      if (!saved) {
        // Data was cleared, reset component
        setUserPrompt("");
        setShowFullPrompt(false);
        setAIState({ aiResponse: "", isLoadingAI: false });
        // Also clear AI response and checkbox localStorage
        localStorage.removeItem(`risePromptAI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
        localStorage.removeItem(`risePromptCheckbox_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [lessonId, subLessonId, exerciseId, stepId]);

  // Get context from Step 2a
  const getContextFromStep2a = () => {
    const contextKey = `promptAnatomy_${lessonId}_${subLessonId}_${exerciseId}_2a`;
    const saved = localStorage.getItem(contextKey);
    if (saved) {
      try {
        const fields = JSON.parse(saved);
        return `Role: ${fields.role}
Who is involved: ${fields.whoInvolved}
Challenge/Decision: ${fields.challenge}
Where: ${fields.whereHappening}
When: ${fields.whenHappening}
Why it matters: ${fields.whyMatters}
Output format: ${fields.outputFormat}`;
      } catch {
        return "";
      }
    }
    return "";
  };

  const updateUserPrompt = (value: string) => {
    setUserPrompt(value);
    // Save to localStorage
    localStorage.setItem(`risePrompt_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`, value);
  };

  // Save checkbox state to localStorage
  useEffect(() => {
    localStorage.setItem(`risePromptCheckbox_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`, showFullPrompt.toString());
  }, [showFullPrompt, lessonId, subLessonId, exerciseId, stepId]);

  const isComplete = userPrompt.trim() !== "";
  const context = getContextFromStep2a();
  const fullPrompt = context ? `${userPrompt}\n\n---\n\n${context}` : userPrompt;

  const fetchAIResponse = async () => {
    
    setAIState(prev => ({ ...prev, isLoadingAI: true }));
    
    try {
      const response = await fetch('/api/openrouter-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fullPrompt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const newAIState = { 
        aiResponse: data.completion,
        isLoadingAI: false 
      };
      setAIState(newAIState);
      // Save AI response to localStorage
      localStorage.setItem(`risePromptAI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`, JSON.stringify(newAIState));
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setAIState({ 
        aiResponse: "Error: Could not get AI response",
        isLoadingAI: false 
      });
    }
  };

  // Save the full prompt when checkbox is checked
  useEffect(() => {
    if (showFullPrompt && isComplete) {
      updateStepAnswer(lessonId, subLessonId, exerciseId, stepId, fullPrompt);
    }
  }, [showFullPrompt, isComplete, fullPrompt, lessonId, subLessonId, exerciseId, stepId, updateStepAnswer]);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="userPrompt">Enter your response...</Label>
        <Textarea
          id="userPrompt"
          value={userPrompt}
          onChange={(e) => updateUserPrompt(e.target.value)}
          placeholder="Using the information below, generate a clear and effective prompt using the RISE format. Don't lose any important context. The output should have 4 labeled sections: Role, Input, Steps, and Expectation."
          className="mt-1 min-h-32"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="show-full-prompt"
          checked={showFullPrompt}
          onCheckedChange={(checked) => setShowFullPrompt(!!checked)}
          disabled={!isComplete}
        />
        <Label htmlFor="show-full-prompt" className="text-sm font-medium cursor-pointer">
          Done - Show Full Prompt
        </Label>
      </div>

      {showFullPrompt && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Your Full RISE Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg text-sm whitespace-pre-line max-h-96 overflow-y-auto">
              {fullPrompt}
            </div>
          </CardContent>
        </Card>
      )}

      {showFullPrompt && (
        <div className="space-y-4">
          <Separator />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Model Response</CardTitle>
            </CardHeader>
            <CardContent>
              {!aiState.aiResponse && !aiState.isLoadingAI && (
                <Button 
                  onClick={fetchAIResponse}
                  className="w-full"
                >
                  Get AI Response
                </Button>
              )}
              
              {aiState.isLoadingAI && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Getting AI response...</p>
                </div>
              )}
              
              {aiState.aiResponse && !aiState.isLoadingAI && (
                <div>
                  <Button 
                    onClick={fetchAIResponse}
                    variant="outline"
                    className="w-full mb-4"
                  >
                    Get Another AI Response
                  </Button>
                  
                  <div className="bg-amber-900 text-amber-100 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                    <div className="text-amber-400 mb-2">&gt; AI MODEL OUTPUT</div>
                    {aiState.aiResponse}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}