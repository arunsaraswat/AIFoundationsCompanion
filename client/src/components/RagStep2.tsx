import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCourseProgress } from "../contexts/CourseProgressContext";
import { Copy } from "lucide-react";

interface RagStep2Props {
  lessonId: number;
  subLessonId: string;
  exerciseId: string;
  stepId: string;
}

interface Source {
  type: string;
  text: string;
  filename?: string;
  quote?: string;
  file_id?: string;
  start_index?: number;
  end_index?: number;
}

interface AIResponseState {
  aiResponse: string;
  sources: Source[];
  isLoadingAI: boolean;
}

export default function RagStep2({ lessonId, subLessonId, exerciseId, stepId }: RagStep2Props) {
  const { updateStepAnswer } = useCourseProgress();
  
  // Same prompt as Step 1
  const ragPrompt = "What is the parental leave policy at The Venue Network?";
  const assistantId = "asst_A5CRKUTUy8hJwQiiI9Liufgm";

  const [userObservations, setUserObservations] = useState(() => {
    // Load saved observations
    const saved = localStorage.getItem(`ragStep2_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
    return saved || "";
  });

  const [aiState, setAIState] = useState<AIResponseState>(() => {
    // Try to load saved AI response
    const saved = localStorage.getItem(`ragStep2AI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back to empty state
      }
    }
    return {
      aiResponse: "",
      sources: [],
      isLoadingAI: false
    };
  });

  // Listen for storage changes to reset component when data is cleared
  useEffect(() => {
    const handleStorageChange = () => {
      const storageKey = `ragStep2_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`;
      const saved = localStorage.getItem(storageKey);
      
      if (!saved) {
        // Data was cleared, reset component
        setUserObservations("");
        setAIState({ aiResponse: "", sources: [], isLoadingAI: false });
        // Also clear AI response localStorage
        localStorage.removeItem(`ragStep2AI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [lessonId, subLessonId, exerciseId, stepId]);

  const fetchRAGResponse = async () => {
    setAIState(prev => ({ ...prev, isLoadingAI: true }));
    
    try {
      const response = await fetch('/api/openai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: ragPrompt,
          assistantId: assistantId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get RAG response');
      }

      const data = await response.json();
      const newAIState = { 
        aiResponse: data.completion,
        sources: data.sources || [],
        isLoadingAI: false 
      };
      setAIState(newAIState);
      // Save AI response to localStorage
      localStorage.setItem(`ragStep2AI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`, JSON.stringify(newAIState));
    } catch (error) {
      console.error('Error fetching RAG response:', error);
      setAIState({ 
        aiResponse: "Error: Could not get RAG response. Please ensure the OpenAI API key is configured.",
        sources: [],
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
    localStorage.setItem(`ragStep2_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`, userObservations);
    updateStepAnswer(lessonId, subLessonId, exerciseId, stepId, userObservations);
  }, [userObservations, lessonId, subLessonId, exerciseId, stepId, updateStepAnswer]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Step 2: Ask the same question in a RAG-enabled environment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Same Test Prompt (with RAG):</Label>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-sm mt-2">
              "{ragPrompt}"
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This will be sent to a custom OpenAI assistant with access to The Venue Network employee handbook.
            </p>
          </div>

          <div className="space-y-2">
            {!aiState.aiResponse && !aiState.isLoadingAI && (
              <div className="flex gap-2">
                <Button 
                  onClick={fetchRAGResponse}
                  className="flex-1"
                >
                  Send Prompt to RAG-Enabled Assistant
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
                <p className="text-sm text-gray-600 mt-2">Getting RAG-enabled response...</p>
              </div>
            )}
            
            {aiState.aiResponse && !aiState.isLoadingAI && (
              <div>
                <div className="flex gap-2 mb-4">
                  <Button 
                    onClick={fetchRAGResponse}
                    variant="outline"
                    className="flex-1"
                  >
                    Get Another RAG Response
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
                  <div className="text-amber-400 mb-2">&gt; AI MODEL OUTPUT (WITH RAG)</div>
                  {aiState.aiResponse}
                </div>
                
                {aiState.sources && aiState.sources.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">📚 Sources Referenced:</h4>
                    <div className="space-y-2">
                      {aiState.sources.map((source, index) => (
                        <div key={index} className="text-sm text-blue-800 dark:text-blue-200 border-l-2 border-blue-300 dark:border-blue-700 pl-3">
                          {source.type === "file_citation" && (
                            <div>
                              <div className="font-medium">{source.filename}</div>
                              {source.quote && (
                                <div className="text-xs italic mt-1 text-blue-600 dark:text-blue-300">
                                  "{source.quote}"
                                </div>
                              )}
                              <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                                Citation: {source.text}
                              </div>
                            </div>
                          )}
                          {source.type === "file_path" && (
                            <div>
                              <div className="font-medium">File: {source.text}</div>
                              <div className="text-xs text-blue-500 dark:text-blue-400">
                                ID: {source.file_id}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
              Compare this RAG-enabled response with Step 1. What differences do you notice?
            </Label>
            <Textarea
              id="observations"
              value={userObservations}
              onChange={(e) => setUserObservations(e.target.value)}
              placeholder="Record your observations about the RAG-enabled response..."
              className="min-h-32"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}