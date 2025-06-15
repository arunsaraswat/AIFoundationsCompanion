import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useCourseProgress } from "../contexts/CourseProgressContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  
  // Predefined GPT prompt text
  const gptPromptText = "Using the information below, generate a clear and effective prompt using the RISE format. Don't lose any important context. The output should have 4 labeled sections: Role, Input, Steps, and Expectation.";

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

  const [riseExecutionState, setRiseExecutionState] = useState<AIResponseState>(() => {
    // Try to load saved RISE execution response
    const saved = localStorage.getItem(`riseExecutionAI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
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
      const storageKey = `risePromptCheckbox_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`;
      const saved = localStorage.getItem(storageKey);
      
      if (!saved) {
        // Data was cleared, reset component
        setShowFullPrompt(false);
        setAIState({ aiResponse: "", isLoadingAI: false });
        setRiseExecutionState({ aiResponse: "", isLoadingAI: false });
        // Also clear AI response localStorage
        localStorage.removeItem(`risePromptAI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
        localStorage.removeItem(`riseExecutionAI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [lessonId, subLessonId, exerciseId, stepId]);

  // Get context from Step 2a
  const getContextFromStep2a = () => {
    const contextKey = `promptAnatomy_${lessonId}_${subLessonId}_${exerciseId}_step-2a`;
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



  // Save checkbox state to localStorage
  useEffect(() => {
    localStorage.setItem(`risePromptCheckbox_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`, showFullPrompt.toString());
  }, [showFullPrompt, lessonId, subLessonId, exerciseId, stepId]);

  const isComplete = true; // Always complete since we have predefined text
  const context = getContextFromStep2a();
  const fullPrompt = context ? `${gptPromptText}\n\n---\n\n${context}` : `${gptPromptText}\n\n--- (No context from Step 2a found)`;

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

  const executeRisePrompt = async () => {
    if (!aiState.aiResponse) {
      return; // Need a generated RISE prompt first
    }
    
    setRiseExecutionState(prev => ({ ...prev, isLoadingAI: true }));
    
    try {
      const response = await fetch('/api/openrouter-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: aiState.aiResponse
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to execute RISE prompt');
      }

      const data = await response.json();
      const newRiseState = { 
        aiResponse: data.completion,
        isLoadingAI: false 
      };
      setRiseExecutionState(newRiseState);
      // Save RISE execution response to localStorage
      localStorage.setItem(`riseExecutionAI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`, JSON.stringify(newRiseState));
    } catch (error) {
      console.error('Error executing RISE prompt:', error);
      setRiseExecutionState({ 
        aiResponse: "Error: Could not execute RISE prompt",
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
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="show-full-prompt"
          checked={showFullPrompt}
          onCheckedChange={(checked) => setShowFullPrompt(!!checked)}
        />
        <Label htmlFor="show-full-prompt" className="text-sm font-medium cursor-pointer">
          Show Full Prompt
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
                  
                  <div className="bg-amber-900 text-amber-100 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                    <div className="text-amber-400 mb-2">&gt; AI MODEL OUTPUT</div>
                    <div className="prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {aiState.aiResponse}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Execute Generated RISE Prompt Section */}
          {aiState.aiResponse && !aiState.isLoadingAI && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Execute Generated RISE Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                {!riseExecutionState.aiResponse && !riseExecutionState.isLoadingAI && (
                  <Button 
                    onClick={executeRisePrompt}
                    className="w-full"
                    variant="secondary"
                  >
                    Send RISE Prompt to AI Model
                  </Button>
                )}
                
                {riseExecutionState.isLoadingAI && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Executing RISE prompt...</p>
                  </div>
                )}
                
                {riseExecutionState.aiResponse && !riseExecutionState.isLoadingAI && (
                  <div>
                    <Button 
                      onClick={executeRisePrompt}
                      variant="outline"
                      className="w-full mb-4"
                    >
                      Execute RISE Prompt Again
                    </Button>
                    
                    <div className="bg-amber-900 text-amber-100 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
                      <div className="text-amber-400 mb-2">&gt; RISE PROMPT EXECUTION OUTPUT</div>
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {riseExecutionState.aiResponse}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}