import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCourseProgress } from "../contexts/CourseProgressContext";
import { Copy } from "lucide-react";

interface RagStep1Props {
  lessonId: number;
  subLessonId: string;
  exerciseId: string;
  stepId: string;
}

interface AIResponseState {
  aiResponse: string;
  isLoadingAI: boolean;
}

export default function RagStep1({ lessonId, subLessonId, exerciseId, stepId }: RagStep1Props) {
  const { updateStepAnswer } = useCourseProgress();
  
  // Predefined prompt for RAG testing
  const ragPrompt = "What is the parental leave policy at The Venue Network?";

  const [userObservations, setUserObservations] = useState(() => {
    // Load saved observations
    const saved = localStorage.getItem(`ragStep1_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
    return saved || "";
  });

  const [aiState, setAIState] = useState<AIResponseState>(() => {
    // Try to load saved AI response
    const saved = localStorage.getItem(`ragStep1AI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
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
      const storageKey = `ragStep1_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`;
      const saved = localStorage.getItem(storageKey);
      
      if (!saved) {
        // Data was cleared, reset component
        setUserObservations("");
        setAIState({ aiResponse: "", isLoadingAI: false });
        // Also clear AI response localStorage
        localStorage.removeItem(`ragStep1AI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [lessonId, subLessonId, exerciseId, stepId]);

  const fetchAIResponse = async () => {
    setAIState(prev => ({ ...prev, isLoadingAI: true }));
    
    try {
      const response = await fetch('/api/openrouter-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: ragPrompt
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
      localStorage.setItem(`ragStep1AI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`, JSON.stringify(newAIState));
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setAIState({ 
        aiResponse: "Error: Could not get AI response",
        isLoadingAI: false 
      });
    }
  };

  const copyPromptToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(ragPrompt);
    } catch (err) {
      console.error('Failed to copy prompt: ', err);
    }
  };

  // Save observations and update course progress
  useEffect(() => {
    localStorage.setItem(`ragStep1_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`, userObservations);
    updateStepAnswer(lessonId, subLessonId, exerciseId, stepId, userObservations);
  }, [userObservations, lessonId, subLessonId, exerciseId, stepId, updateStepAnswer]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step 1: Ask GPT (without RAG)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Test Prompt:</Label>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-sm mt-2">
              "{ragPrompt}"
            </div>
          </div>

          <div className="space-y-2">
            {!aiState.aiResponse && !aiState.isLoadingAI && (
              <div className="flex gap-2">
                <Button 
                  onClick={fetchAIResponse}
                  className="flex-1"
                >
                  Send Prompt to AI Model
                </Button>
                <Button
                  onClick={copyPromptToClipboard}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </div>
            )}
            
            {aiState.isLoadingAI && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Getting AI response...</p>
              </div>
            )}
            
            {aiState.aiResponse && !aiState.isLoadingAI && (
              <div>
                <div className="flex gap-2 mb-4">
                  <Button 
                    onClick={fetchAIResponse}
                    variant="outline"
                    className="flex-1"
                  >
                    Get Another AI Response
                  </Button>
                  <Button
                    onClick={copyPromptToClipboard}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </Button>
                </div>
                
                <div className="bg-amber-900 text-amber-100 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                  <div className="text-amber-400 mb-2">&gt; AI MODEL OUTPUT (WITHOUT RAG)</div>
                  {aiState.aiResponse}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Observations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="observations">
              Observe the output: Does it confidently guess? Is it vague, overly generic, or inaccurate?
            </Label>
            <Textarea
              id="observations"
              value={userObservations}
              onChange={(e) => setUserObservations(e.target.value)}
              placeholder="Record your observations about the AI's response without RAG..."
              className="min-h-32"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}