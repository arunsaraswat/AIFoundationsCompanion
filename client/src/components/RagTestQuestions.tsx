import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCourseProgress } from "../contexts/CourseProgressContext";

interface RagTestQuestionsProps {
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

export default function RagTestQuestions({ lessonId, subLessonId, exerciseId, stepId }: RagTestQuestionsProps) {
  const { updateStepAnswer } = useCourseProgress();
  
  const assistantId = "asst_A5CRKUTUy8hJwQiiI9Liufgm";

  const [userObservations, setUserObservations] = useState(() => {
    // Load saved observations
    const saved = localStorage.getItem(`ragTestQuestions_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
    return saved || "";
  });

  const [customQuestion, setCustomQuestion] = useState("");

  const [aiState, setAIState] = useState<AIResponseState>(() => {
    // Try to load saved AI response
    const saved = localStorage.getItem(`ragTestQuestionsAI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
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
      const storageKey = `ragTestQuestions_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`;
      const saved = localStorage.getItem(storageKey);
      
      if (!saved) {
        // Data was cleared, reset component
        setUserObservations("");
        setCustomQuestion("");
        setAIState({ aiResponse: "", sources: [], isLoadingAI: false });
        // Also clear AI response localStorage
        localStorage.removeItem(`ragTestQuestionsAI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [lessonId, subLessonId, exerciseId, stepId]);

  const sendCustomQuestion = async () => {
    if (!customQuestion.trim()) return;
    
    setAIState(prev => ({ ...prev, isLoadingAI: true }));
    
    try {
      const response = await fetch('/api/openai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: customQuestion,
          assistantId: assistantId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get assistant response');
      }

      const data = await response.json();
      const newAIState = { 
        aiResponse: data.completion,
        sources: data.sources || [],
        isLoadingAI: false 
      };
      setAIState(newAIState);
      // Save AI response to localStorage
      localStorage.setItem(`ragTestQuestionsAI_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`, JSON.stringify(newAIState));
    } catch (error) {
      console.error('Error fetching assistant response:', error);
      setAIState({ 
        aiResponse: "Error: Could not get assistant response. Please ensure the OpenAI API key is configured.",
        sources: [],
        isLoadingAI: false 
      });
    }
  };

  // Save observations and update course progress
  useEffect(() => {
    localStorage.setItem(`ragTestQuestions_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`, userObservations);
    updateStepAnswer(lessonId, subLessonId, exerciseId, stepId, userObservations);
  }, [userObservations, lessonId, subLessonId, exerciseId, stepId, updateStepAnswer]);

  const predefinedQuestions = [
    "What benefits does The Venue Network provide after 90 days of employment?",
    "How much PTO can be carried over at the end of the fiscal year?", 
    "What is the bereavement leave policy for a domestic partner's child?",
    "What are the rules around ending employment with unused PTO?",
    "Under what conditions will COBRA benefits be offered to former employees?"
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Test Questions from the Handbook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            These questions are designed to test how well a vanilla model performs without access to specific company data versus a RAG-enabled assistant with the employee handbook.
          </p>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Pre-defined Test Questions:</Label>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-sm space-y-1">
              {predefinedQuestions.map((question, index) => (
                <div key={index} className="text-gray-700 dark:text-gray-300">
                  • {question}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t pt-4">
            <Label className="text-sm font-medium">Ask Your Own Question:</Label>
            <div className="space-y-2">
              <Input
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="Enter your question about The Venue Network policies..."
                className="w-full"
              />
              <Button 
                onClick={sendCustomQuestion}
                disabled={aiState.isLoadingAI || !customQuestion.trim()}
                className="w-full"
              >
                {aiState.isLoadingAI ? "Getting Answer..." : "Ask RAG-Enabled Assistant"}
              </Button>
            </div>
            
            {aiState.isLoadingAI && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Getting answer from handbook...</p>
              </div>
            )}
            
            {aiState.aiResponse && !aiState.isLoadingAI && (
              <div>
                <div className="bg-amber-900 text-amber-100 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                  <div className="text-amber-400 mb-2">&gt; HANDBOOK ASSISTANT RESPONSE</div>
                  <div className="text-amber-200 text-xs mb-2">Question: {customQuestion}</div>
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
                
                <Button 
                  onClick={() => {
                    setAIState({ aiResponse: "", sources: [], isLoadingAI: false });
                    setCustomQuestion("");
                  }}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Clear and Ask Another Question
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Test Results & Observations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="observations">
              Record your findings from testing these handbook questions. How well does the RAG-enabled assistant perform compared to a vanilla model?
            </Label>
            <Textarea
              id="observations"
              value={userObservations}
              onChange={(e) => setUserObservations(e.target.value)}
              placeholder="Document your test results and observations..."
              className="min-h-32"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}