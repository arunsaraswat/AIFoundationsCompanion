import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCourseProgress } from "@/contexts/CourseProgressContext";
import { CheckCircle, AlertCircle, Bot, Users, ArrowRight, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AgentDesignStep2Props {
  lessonId: number;
  subLessonId: string;
  exerciseId: string;
  stepId: string;
}

interface ScalingFields {
  multiAgentEvolution: string;
  agentOrchestration: string;
  sketchDescription: string;
}

interface AIResponseState {
  aiResponse: string;
  isLoadingAI: boolean;
}

export default function AgentDesignStep2({ lessonId, subLessonId, exerciseId, stepId }: AgentDesignStep2Props) {
  const { updateStepAnswer } = useCourseProgress();
  const [fields, setFields] = useState<ScalingFields>({
    multiAgentEvolution: "",
    agentOrchestration: "",
    sketchDescription: ""
  });

  const [aiState, setAiState] = useState<AIResponseState>({
    aiResponse: "",
    isLoadingAI: false
  });

  const [isCompleted, setIsCompleted] = useState(false);

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`agentDesignStep2_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFields(parsedData.fields || {});
      setAiState(parsedData.aiState || { aiResponse: "", isLoadingAI: false });
      setIsCompleted(parsedData.isCompleted || false);
    }
  }, [lessonId, subLessonId, exerciseId, stepId]);

  // Save data to localStorage whenever fields or AI state change
  useEffect(() => {
    const dataToSave = { fields, aiState, isCompleted };
    localStorage.setItem(`agentDesignStep2_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`, JSON.stringify(dataToSave));
  }, [fields, aiState, isCompleted, lessonId, subLessonId, exerciseId, stepId]);

  const handleFieldChange = (field: keyof ScalingFields, value: string) => {
    setFields(prev => ({ ...prev, [field]: value }));
  };

  const handleAIQuery = async () => {
    if (!fields.multiAgentEvolution.trim()) return;

    setAiState(prev => ({ ...prev, isLoadingAI: true }));

    try {
      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Based on this single-agent workflow description: "${fields.multiAgentEvolution}"

Please help me imagine how this could evolve into a multi-agent system by addressing these questions:

1. How could this single-agent design evolve into a multi-agent workflow?
2. What other agents could take earlier or later steps?
3. What would each agent specialize in?
4. How would they coordinate and handoff work between each other?

Please provide specific, actionable suggestions for agent orchestration (e.g., planner → executor → reviewer) and be concrete about the roles and responsibilities of each agent.`,
          context: "multi-agent workflow design"
        })
      });

      if (!response.ok) throw new Error('Failed to get AI response');
      
      const data = await response.json();
      setAiState({
        aiResponse: data.response,
        isLoadingAI: false
      });
    } catch (error) {
      console.error('AI query error:', error);
      setAiState({
        aiResponse: "Unable to get AI suggestions. Please try again or continue with your own ideas.",
        isLoadingAI: false
      });
    }
  };

  const handleComplete = () => {
    const summary = `Multi-agent evolution: ${fields.multiAgentEvolution}\nOrchestration ideas: ${fields.agentOrchestration}\nSketch: ${fields.sketchDescription}`;
    updateStepAnswer(lessonId, subLessonId, exerciseId, stepId, summary);
    setIsCompleted(true);
  };

  const allFieldsFilled = Object.values(fields).every(field => field.trim() !== "");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Step 2: Prompt GPT to Imagine Scaling It
        </h2>
        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Users className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
            <div>
              <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                <strong>Goal:</strong> Explore how your single-agent design could evolve into a multi-agent workflow.
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Think about agent orchestration (e.g., planner → executor → reviewer) and how multiple agents 
                could collaborate on your workflow.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>Multi-Agent Evolution Question</span>
          </CardTitle>
          <CardDescription>
            Describe your single-agent workflow from Step 1, then we'll explore multi-agent possibilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="multi-agent-input">
              How could your single-agent design evolve into a multi-agent workflow? 
              What other agents could take earlier or later steps? What would each specialize in?
            </Label>
            <Textarea
              id="multi-agent-input"
              placeholder="Describe your current single-agent workflow and your initial thoughts on how it could be split into multiple specialized agents..."
              value={fields.multiAgentEvolution}
              onChange={(e) => handleFieldChange("multiAgentEvolution", e.target.value)}
              className="min-h-[120px] mt-2"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Fill in your thoughts above, then get AI suggestions
            </div>
            <Button 
              onClick={handleAIQuery}
              disabled={!fields.multiAgentEvolution.trim() || aiState.isLoadingAI}
              variant="outline"
              className="min-w-[140px]"
            >
              {aiState.isLoadingAI ? "Getting Ideas..." : "Get AI Suggestions"}
            </Button>
          </div>

          {aiState.aiResponse && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                AI Suggestions for Multi-Agent Design
              </h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 prose prose-sm max-w-none prose-blue dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {aiState.aiResponse}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ArrowRight className="h-5 w-5" />
            <span>Agent Orchestration Design</span>
          </CardTitle>
          <CardDescription>
            Use GPT to explore agent orchestration (e.g., planner → executor → reviewer)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="orchestration">
              Based on the AI suggestions or your own ideas, describe how multiple agents would coordinate:
            </Label>
            <Textarea
              id="orchestration"
              placeholder="e.g., Planner Agent identifies tasks → Executor Agent performs work → Reviewer Agent checks quality → Coordinator Agent manages handoffs..."
              value={fields.agentOrchestration}
              onChange={(e) => handleFieldChange("agentOrchestration", e.target.value)}
              className="min-h-[100px] mt-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optional: Visual Sketch</CardTitle>
          <CardDescription>
            Add to the sketch or describe it verbally to peers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Describe your multi-agent workflow visually - how would you sketch the flow between agents? What would the diagram look like?"
            value={fields.sketchDescription}
            onChange={(e) => handleFieldChange("sketchDescription", e.target.value)}
            className="min-h-[80px]"
          />
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-6">
        <div className="flex items-center space-x-2">
          {isCompleted ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Completed</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span className="text-sm text-muted-foreground">
                Complete the multi-agent evolution and orchestration fields
              </span>
            </>
          )}
        </div>
        
        <Button 
          onClick={handleComplete}
          disabled={!fields.multiAgentEvolution.trim() || !fields.agentOrchestration.trim() || isCompleted}
          className="min-w-[120px]"
        >
          {isCompleted ? "Completed" : "Complete Step"}
        </Button>
      </div>

      {fields.multiAgentEvolution && fields.agentOrchestration && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Your Multi-Agent Design</h3>
          <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
            <p><strong>Evolution concept:</strong> {fields.multiAgentEvolution.substring(0, 150)}...</p>
            <p><strong>Orchestration plan:</strong> {fields.agentOrchestration.substring(0, 150)}...</p>
            {fields.sketchDescription && (
              <p><strong>Visual description:</strong> {fields.sketchDescription.substring(0, 100)}...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}