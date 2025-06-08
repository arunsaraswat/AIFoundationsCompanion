import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCourseProgress } from "@/contexts/CourseProgressContext";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Lightbulb, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AgentDesignStep1Props {
  lessonId: number;
  subLessonId: string;
  exerciseId: string;
  stepId: string;
}

interface AgentDesignFields {
  taskOrWorkflow: string;
  goal: string;
  yourPart: string;
  agentPart: string;
  systemsInfo: string;
  successLooks: string;
  improvement: string;
}

interface AIResponseState {
  aiResponse: string;
  isLoadingAI: boolean;
}

export default function AgentDesignStep1({ lessonId, subLessonId, exerciseId, stepId }: AgentDesignStep1Props) {
  const { updateStepAnswer } = useCourseProgress();
  const [fields, setFields] = useState<AgentDesignFields>({
    taskOrWorkflow: "",
    goal: "",
    yourPart: "",
    agentPart: "",
    systemsInfo: "",
    successLooks: "",
    improvement: ""
  });

  const [aiState, setAiState] = useState<AIResponseState>({
    aiResponse: "",
    isLoadingAI: false
  });

  const [isCompleted, setIsCompleted] = useState(false);

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`agentDesignStep1_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`);
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
    localStorage.setItem(`agentDesignStep1_${lessonId}_${subLessonId}_${exerciseId}_${stepId}`, JSON.stringify(dataToSave));
  }, [fields, aiState, isCompleted, lessonId, subLessonId, exerciseId, stepId]);

  const handleFieldChange = (field: keyof AgentDesignFields, value: string) => {
    setFields(prev => ({ ...prev, [field]: value }));
  };

  const handleAIQuery = async () => {
    if (!fields.taskOrWorkflow.trim()) return;

    setAiState(prev => ({ ...prev, isLoadingAI: true }));

    try {
      const prompt = `I want to design an AI assistant that helps me with ${fields.taskOrWorkflow}. I'll provide details, and I want you to help define the agent's job, inputs, tools, and output.

Please provide specific guidance on:
1. What the agent's role should be
2. What inputs the agent would need
3. What tools or systems it should access
4. What the expected output format should be
5. How to measure success

Make your suggestions practical and actionable for this specific workflow.`;

      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: "agent design workflow"
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
    const summary = `Task: ${fields.taskOrWorkflow}\nGoal: ${fields.goal}\nYour part: ${fields.yourPart}\nAgent part: ${fields.agentPart}`;
    updateStepAnswer(lessonId, subLessonId, exerciseId, stepId, summary);
    setIsCompleted(true);
  };

  const allFieldsFilled = Object.values(fields).every(field => field.trim() !== "");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">
          Step 1: Build a Human + 1 Agent Workflow
        </h2>
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                <strong>Instructions:</strong> Choose a real task or workflow you own (e.g., onboarding a client, 
                summarizing weekly reports, handling incident alerts).
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Prompt GPT using this starter: "I want to design an AI assistant that helps me with [describe task]. 
                I'll provide details, and I want you to help define the agent's job, inputs, tools, and output."
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Task/Workflow Selection</CardTitle>
            <CardDescription>
              Describe the real task or workflow you want to design an AI assistant for
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., Onboarding new clients, Summarizing weekly team reports, Handling customer support incidents..."
              value={fields.taskOrWorkflow}
              onChange={(e) => handleFieldChange("taskOrWorkflow", e.target.value)}
              className="min-h-[80px]"
            />
            
            <div className="flex justify-end">
              <Button 
                onClick={handleAIQuery}
                disabled={!fields.taskOrWorkflow.trim() || aiState.isLoadingAI}
                variant="outline"
                className="min-w-[180px]"
              >
                {aiState.isLoadingAI ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting AI Suggestions...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Get AI Design Help
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {aiState.aiResponse && (
          <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-blue-800 dark:text-blue-200">
                <Bot className="mr-2 h-5 w-5" />
                AI Agent Design Suggestions
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Use these suggestions to help fill out the sections below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed prose prose-sm max-w-none prose-blue dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {aiState.aiResponse}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's the goal?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What are you trying to achieve with this workflow?"
                value={fields.goal}
                onChange={(e) => handleFieldChange("goal", e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What's your part vs. what the agent does?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="your-part">Your part:</Label>
                <Textarea
                  id="your-part"
                  placeholder="What will you handle personally?"
                  value={fields.yourPart}
                  onChange={(e) => handleFieldChange("yourPart", e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
              <div>
                <Label htmlFor="agent-part">Agent's part:</Label>
                <Textarea
                  id="agent-part"
                  placeholder="What will the AI assistant handle?"
                  value={fields.agentPart}
                  onChange={(e) => handleFieldChange("agentPart", e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What systems or info does the agent need?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What data sources, tools, or systems would the agent need access to?"
                value={fields.systemsInfo}
                onChange={(e) => handleFieldChange("systemsInfo", e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What does success look like?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="How would you know the agent is working effectively?"
                value={fields.successLooks}
                onChange={(e) => handleFieldChange("successLooks", e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Collaborative Refinement</CardTitle>
            <CardDescription>
              Ask: "What's one improvement this agent could make after each run?"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="What improvements or refinements could the agent make over time?"
              value={fields.improvement}
              onChange={(e) => handleFieldChange("improvement", e.target.value)}
              className="min-h-[80px]"
            />
          </CardContent>
        </Card>
      </div>

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
                Fill out all fields to complete this step
              </span>
            </>
          )}
        </div>
        
        <Button 
          onClick={handleComplete}
          disabled={!allFieldsFilled || isCompleted}
          className="min-w-[120px]"
        >
          {isCompleted ? "Completed" : "Complete Step"}
        </Button>
      </div>

      {allFieldsFilled && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Your Agent Design Summary</h3>
          <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
            <p><strong>Task:</strong> {fields.taskOrWorkflow}</p>
            <p><strong>Goal:</strong> {fields.goal}</p>
            <p><strong>Your role:</strong> {fields.yourPart}</p>
            <p><strong>Agent's role:</strong> {fields.agentPart}</p>
          </div>
        </div>
      )}
    </div>
  );
}