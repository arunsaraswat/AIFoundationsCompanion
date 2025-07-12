import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, RefreshCw, Sparkles, Info } from "lucide-react";
import type { WorkflowWizardData } from "../WorkflowRedesignWizard";

interface EnhancementPlanStepProps {
  wizardData: WorkflowWizardData;
  data: {
    plan: string;
    constraints: string;
    focusQuickWins: boolean;
  };
  onUpdate: (data: any) => void;
  onComplete: () => void;
  onBack?: () => void;
}

export function EnhancementPlanStep({ wizardData, data, onUpdate, onComplete, onBack }: EnhancementPlanStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Auto-generate plan on first load if not already generated
  useEffect(() => {
    if (!data.plan && !isGenerating) {
      generatePlan();
    }
  }, []);

  const generatePlan = async () => {
    setIsGenerating(true);
    setError("");

    try {
      const selectedStep = wizardData.currentWorkflow.steps.find(
        (s) => s.id === wizardData.painPointAnalysis.selectedStep
      );

      const prompt = `Create a detailed AI enhancement plan for this workflow step:

**Current Step:** ${selectedStep?.name}: ${selectedStep?.description}
**Time Estimate:** ${selectedStep?.timeValue} ${selectedStep?.timeUnit}
**Pain Point:** ${wizardData.painPointAnalysis.painDetails}
**Time Wasted:** ${wizardData.painPointAnalysis.timeWasted}
**Frequency:** ${wizardData.painPointAnalysis.frequency}
**Selected AI Approach:** ${wizardData.painPointAnalysis.aiApproach}

**Step Breakdown:**
- Inputs: ${wizardData.stepBreakdown.inputs.map((i) => `${i.name} (${i.type})`).join(", ")}
- Sub-steps:
${wizardData.stepBreakdown.subSteps
  .map(
    (s, idx) =>
      `  ${idx + 1}. ${s.description} - AI: ${s.aiApproach}, Time savings: ${s.timeSavings}%, Human involvement: ${s.humanInvolvement}`
  )
  .join("\n")}
- Outputs: ${wizardData.stepBreakdown.outputs.map((o) => o.name).join(", ")}

${data.constraints ? `**Additional Constraints:** ${data.constraints}` : ""}
${data.focusQuickWins ? "**Priority:** Focus on quick wins and immediate implementations" : ""}

Please provide:
1. **Overview** - Summary of the AI enhancement approach
2. **Detailed Implementation Plan** - How each sub-step will be enhanced with AI
3. **Required Tools & Integrations** - Specific AI tools, APIs, or platforms needed
4. **Implementation Complexity** - Technical requirements and timeline
5. **Expected Benefits** - Quantified improvements in time, accuracy, and efficiency
6. **Risk Mitigation** - Potential challenges and how to address them

Format the response in clear markdown with headers and bullet points.`;

      const response = await fetch("/api/ai/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate plan");
      }

      const result = await response.json();
      onUpdate({ ...data, plan: result.response });
    } catch (err) {
      setError("Failed to generate enhancement plan. Please try again.");
      console.error("Error generating plan:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    if (!data.plan.trim()) {
      setError("Please generate an enhancement plan before continuing");
      return;
    }
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">AI Enhancement Plan</h3>
        <p className="text-sm text-muted-foreground">
          Based on your workflow analysis, here's a comprehensive plan to enhance your process with AI.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="constraints">Additional Constraints or Requirements (Optional)</Label>
          <Textarea
            id="constraints"
            placeholder="e.g., Must integrate with existing CRM, Budget limit of $X, No cloud storage allowed..."
            value={data.constraints}
            onChange={(e) => onUpdate({ ...data, constraints: e.target.value })}
            rows={3}
            className="mt-2"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="quick-wins">Focus on Quick Wins</Label>
            <p className="text-sm text-muted-foreground">
              Prioritize implementations that can be done quickly
            </p>
          </div>
          <Switch
            id="quick-wins"
            checked={data.focusQuickWins}
            onCheckedChange={(checked) => onUpdate({ ...data, focusQuickWins: checked })}
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={generatePlan}
            disabled={isGenerating}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating Plan...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Regenerate Plan
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data.plan && (
        <Card style={{ backgroundColor: '#f9f9f7' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your AI Enhancement Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm leading-relaxed">
              {data.plan.split('\n').map((line, index) => {
                const trimmedLine = line.trim();
                
                // Skip empty lines
                if (!trimmedLine) return null;
                
                // Handle headers (##)
                if (trimmedLine.startsWith('## ')) {
                  return (
                    <h3 key={index} className="text-base font-semibold text-gray-900 mt-6 mb-3 first:mt-0">
                      {trimmedLine.replace('## ', '')}
                    </h3>
                  );
                }
                
                // Handle headers (#)
                if (trimmedLine.startsWith('# ')) {
                  return (
                    <h2 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3 first:mt-0">
                      {trimmedLine.replace('# ', '')}
                    </h2>
                  );
                }
                
                // Handle numbered lists (1., 2., etc.)
                if (/^\d+\.\s/.test(trimmedLine)) {
                  const number = trimmedLine.match(/^\d+\./)?.[0] || '';
                  const content = trimmedLine.replace(/^\d+\.\s/, '');
                  return (
                    <div key={index} className="flex gap-3 mb-2">
                      <span className="font-medium text-primary min-w-[1.5rem]">
                        {number}
                      </span>
                      <span 
                        className="flex-1"
                        dangerouslySetInnerHTML={{
                          __html: content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }}
                      />
                    </div>
                  );
                }
                
                // Handle bullet points (-)
                if (trimmedLine.startsWith('- ')) {
                  return (
                    <div key={index} className="flex gap-3 mb-1 ml-4">
                      <span className="text-primary min-w-[1rem] mt-1">•</span>
                      <span 
                        className="flex-1"
                        dangerouslySetInnerHTML={{
                          __html: trimmedLine.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }}
                      />
                    </div>
                  );
                }
                
                // Handle regular paragraphs
                return (
                  <p 
                    key={index} 
                    className="text-gray-700 mb-3"
                    dangerouslySetInnerHTML={{
                      __html: trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {isGenerating && (
        <Card className="border-dashed" style={{ backgroundColor: '#f9f9f7' }}>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Analyzing your workflow and generating AI enhancement plan...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This plan is a starting point. You can refine it by adding constraints or regenerating with different priorities.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleComplete} disabled={!data.plan || isGenerating}>
          Continue to Business Case
        </Button>
      </div>
    </div>
  );
}