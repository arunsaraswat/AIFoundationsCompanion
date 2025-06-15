import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCourseProgress } from "@/contexts/CourseProgressContext";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ModelComparisonProps {
  lessonId: number;
  subLessonId: string;
  exerciseId: string;
  stepId: string;
}

interface AIResponseState {
  aiResponse: string;
  isLoadingAI: boolean;
}

export default function ModelComparison({ lessonId, subLessonId, exerciseId, stepId }: ModelComparisonProps) {
  const { lessons, updateStepAnswer } = useCourseProgress();
  const [llamaState, setLlamaState] = useState<AIResponseState>({
    aiResponse: "",
    isLoadingAI: false,
  });
  const [gemmaState, setGemmaState] = useState<AIResponseState>({
    aiResponse: "",
    isLoadingAI: false,
  });

  // Get the RISE prompt from step 3 (stored in localStorage by RisePrompt component)
  const getRisePrompt = (): string => {
    // The RisePrompt component stores the AI response in localStorage
    const risePromptKey = `risePromptAI_${lessonId}_${subLessonId}_${exerciseId}_step-2b`;
    const saved = localStorage.getItem(risePromptKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.aiResponse || "";
      } catch {
        // Fall back to empty string
      }
    }
    return "";
  };

  const runLlamaModel = async () => {
    const risePrompt = getRisePrompt();
    if (!risePrompt.trim()) {
      alert("Please complete Step 3 first to generate a RISE prompt.");
      return;
    }

    setLlamaState(prev => ({ ...prev, isLoadingAI: true }));

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: risePrompt
            }
          ],
          model: 'meta-llama/llama-4-maverick:free'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "No response received";
      
      setLlamaState({
        aiResponse,
        isLoadingAI: false,
      });

      // Save the response
      updateStepAnswer(lessonId, subLessonId, exerciseId, stepId, aiResponse);
    } catch (error) {
      console.error('Error calling AI:', error);
      setLlamaState(prev => ({
        ...prev,
        isLoadingAI: false,
      }));
      alert('Error getting AI response. Please try again.');
    }
  };

  const runGemmaModel = async () => {
    const risePrompt = getRisePrompt();
    if (!risePrompt.trim()) {
      alert("Please complete Step 3 first to generate a RISE prompt.");
      return;
    }

    setGemmaState(prev => ({ ...prev, isLoadingAI: true }));

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: risePrompt
            }
          ],
          model: 'google/gemma-3-12b-it:free'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "No response received";
      
      setGemmaState({
        aiResponse,
        isLoadingAI: false,
      });

      // Save the response
      updateStepAnswer(lessonId, subLessonId, exerciseId, stepId, aiResponse);
    } catch (error) {
      console.error('Error calling AI:', error);
      setGemmaState(prev => ({
        ...prev,
        isLoadingAI: false,
      }));
      alert('Error getting AI response. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Meta: Llama 4 Maverick</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runLlamaModel}
              disabled={llamaState.isLoadingAI}
              className="w-full"
            >
              {llamaState.isLoadingAI ? "Running..." : "Run on Meta: Llama 4 Maverick"}
            </Button>
            
            {llamaState.aiResponse && (
              <div className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm max-h-96 overflow-y-auto">
                <div className="text-slate-400 mb-2">&gt; META LLAMA OUTPUT</div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {llamaState.aiResponse}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Google: Gemma 3 12B</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runGemmaModel}
              disabled={gemmaState.isLoadingAI}
              className="w-full"
            >
              {gemmaState.isLoadingAI ? "Running..." : "Run on Google: Gemma 3 12B"}
            </Button>
            
            {gemmaState.aiResponse && (
              <div className="bg-blue-900 text-blue-100 p-4 rounded-lg text-sm max-h-96 overflow-y-auto">
                <div className="text-blue-400 mb-2">&gt; GOOGLE GEMMA OUTPUT</div>
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {gemmaState.aiResponse}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {(llamaState.aiResponse || gemmaState.aiResponse) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Model Comparison Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Compare the responses from both models above. Look for differences in:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li>Response style and tone</li>
              <li>Level of detail and specificity</li>
              <li>Structure and organization</li>
              <li>Accuracy and relevance to your prompt</li>
              <li>Creative vs. analytical approach</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}