import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Info, Loader2, Sparkles, Eye, Copy, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PainPointStepProps {
  workflowSteps: Array<{ 
    id: string; 
    name: string; 
    description: string; 
    toolSystem: string;
    dataInfo: string;
    privacyLevel: 'internal' | 'sensitive' | 'confidential' | 'public';
    timeValue: number;
    timeUnit: 'minutes' | 'hours' | 'days';
  }>;
  data: {
    selectedStep: string;
    painDetails: string;
    timeWasted: {
      value: number;
      unit: 'minutes' | 'hours' | 'days';
    };
    frequency: {
      value: number;
      unit: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    };
    aiApproach: "prompt" | "rag" | "agentic" | "";
    stepPainTypes: Record<string, {
      manualRepetitive: boolean;
      searchingInfo: boolean;
      decisionMaking: boolean;
    }>;
  };
  onUpdate: (data: any) => void;
  onComplete: () => void;
  onBack?: () => void;
}

const aiApproaches = [
  {
    value: "prompt",
    title: "Prompt-Only",
    description: "Simple automation using LLMs for text generation, summarization, or analysis",
    examples: ["Email drafting", "Content summarization", "Code documentation"],
  },
  {
    value: "rag",
    title: "RAG (Retrieval-Augmented Generation)",
    description: "Combines knowledge retrieval with AI generation for accurate, context-aware responses",
    examples: ["Document Q&A", "Knowledge base search", "Policy compliance checks"],
  },
  {
    value: "agentic",
    title: "Agentic",
    description: "Autonomous AI agents that can plan, execute multiple steps, and use tools",
    examples: ["Complex workflows", "Multi-step research", "System integrations"],
  },
];

export function PainPointStep({ workflowSteps, data, onUpdate, onComplete, onBack }: PainPointStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showHelperPromptDialog, setShowHelperPromptDialog] = useState(false);
  const [helperPromptContent, setHelperPromptContent] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.selectedStep) {
      newErrors.selectedStep = "Please select a workflow step";
    }
    if (!data.painDetails.trim()) {
      newErrors.painDetails = "Please describe why this step is painful";
    }
    if (!data.timeWasted || data.timeWasted.value <= 0) {
      newErrors.timeWasted = "Please estimate the time wasted";
    }
    if (!data.frequency || data.frequency.value <= 0) {
      newErrors.frequency = "Please select how often this occurs";
    }
    if (!data.aiApproach) {
      newErrors.aiApproach = "Please select an AI approach";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = () => {
    if (validate()) {
      onComplete();
    }
  };

  const updatePainType = (stepId: string, painType: 'manualRepetitive' | 'searchingInfo' | 'decisionMaking', checked: boolean) => {
    const currentStepPainTypes = (data.stepPainTypes && data.stepPainTypes[stepId]) || {
      manualRepetitive: false,
      searchingInfo: false,
      decisionMaking: false,
    };
    
    onUpdate({
      ...data,
      stepPainTypes: {
        ...(data.stepPainTypes || {}),
        [stepId]: {
          ...currentStepPainTypes,
          [painType]: checked,
        },
      },
    });
  };

  const openHelperPromptDialog = () => {
    const selectedStep = workflowSteps.find(step => step.id === data.selectedStep);
    const painTypesList = selectedStep ? Object.entries(data.stepPainTypes?.[selectedStep.id] || {})
      .filter(([_, checked]) => checked)
      .map(([painType, _]) => {
        switch(painType) {
          case 'manualRepetitive': return 'Manual/Repetitive Work';
          case 'searchingInfo': return 'Searching for Information';
          case 'decisionMaking': return 'Decision Making & Analysis';
          default: return painType;
        }
      })
      .join(', ') : '';

    const promptContent = `You are an expert AI Solutions Architect. Your primary role is to analyze a user's business process challenges and recommend the most effective initial AI approach to solve them. You will be provided with the full context of a business workflow, a detailed analysis of the most painful step within that workflow, and the specific nature of the user's pain.

Your task is to analyze this information and recommend one of three starting approaches: Prompt Only, RAG, or Agentic.

1. Overall Workflow Context
Workflow Name: [Please provide workflow name from previous step]

Workflow Description: [Please provide workflow description from previous step]

Workflow Frequency: [Please provide workflow frequency from previous step]

2. Full Workflow Plan
The user has broken their workflow into these 5 steps:

${workflowSteps.map((step, index) => 
  `Step ${index + 1}: ${step.name || '[Step Name]'}: ${step.description || '[Step Description]'} (Est. Time: ${step.timeValue || '[Time]'} ${step.timeUnit || '[Unit]'})`
).join('\n\n')}

3. Analysis of the Most Painful Step
The user has identified the following step as the most painful part of their workflow:

Selected Painful Step: ${selectedStep?.name || '[Selected Step Name]'}

Step Description: ${selectedStep?.description || '[Selected Step Description]'}

Identified Pain Types: ${painTypesList || '[Pain types not selected]'}

User's Explanation of Pain: "${data.painDetails || '[User has not provided explanation]'}"

Impact of Pain:

Time Wasted: ${data.timeWasted?.value || '[Not specified]'} ${data.timeWasted?.unit || '[Unit not specified]'}

Frequency of Occurrence: ${data.frequency?.value || '[Not specified]'} ${data.frequency?.unit || '[Unit not specified]'}

4. Your Task: Recommend an Initial AI Approach
Based on all the information above, recommend the best initial AI approach to address the user's specific pain point. Your recommendation will guide the first development effort to provide immediate value.

First, consider the definitions of the available approaches:

Prompt Only: A direct instruction to an LLM. It is best for self-contained tasks like summarization, reformatting, brainstorming, or generation based only on the context provided within the prompt itself. It does not require external, real-time data or tools.

RAG (Retrieval-Augmented Generation): This approach combines a prompt with a retrieval system. It is best for tasks that require generating content based on a specific, proprietary, or large body of information (e.g., answering questions about internal company documents, searching a knowledge base, or analyzing specific data files that are provided to the system).

Agentic: This approach uses an LLM to plan and execute a series of actions, often involving the use of external tools (e.g., APIs, code interpreters, web browsers). It is best for complex tasks that require interaction with other systems, performing actions in the real world, or multi-step problem-solving that cannot be completed by generation alone.

Provide your recommendation in the following, precise format.

Recommended Approach: [Prompt Only, RAG, or Agentic]

Reasoning: [Provide a detailed justification for your choice. Explain why this approach is the most suitable starting point to solve the user's specific problem, referencing the identified pain types, the step's description, and the user's explanation. Briefly explain why the other two approaches are less suitable as a starting point for this specific problem.]`;
    
    setHelperPromptContent(promptContent);
    setShowHelperPromptDialog(true);
  };

  const copyHelperPrompt = async () => {
    await navigator.clipboard.writeText(helperPromptContent);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };


  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Identify Your Biggest Pain Point</h3>
        <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-r-md">
          <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
            <span className="text-orange-600">💡</span>
            Pain Types That AI Can Address
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Rate each step using these evidence-based pain indicators
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
              <div>
                <strong>Manual/Repetitive Work.</strong> Copy/paste operations, data entry, formatting. Writing similar content repeatedly
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
              <div>
                <strong>Searching for Information.</strong> Looking up policies, procedures, or historical data. Research across multiple systems
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
              <div>
                <strong>Decision Making & Analysis.</strong> Comparing options with multiple criteria. Pattern recognition across large datasets. Routine judgment calls with clear parameters
              </div>
            </li>
          </ul>
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-sm font-medium text-blue-800 mb-2">
              <strong>Tip: The three pain types line up nicely with AI enhancements..</strong>
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Manual / Repetitive → Chat-style assistants that draft, fill, or summarize so people stop copy-pasting.</li>
              <li>• Searching for Info → RAG (Retrieval-Augmented Generation) that lets a bot pull the right answer from your files and policies.</li>
              <li>• Decision-Making & Analysis → Agent workflows that can compare options, apply rules, and trigger next steps.</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            It isn't a rigid one-to-one rule, but spotting which pains dominate a step is a quick way to shortlist the AI technique—or blend of techniques—that will pay off fastest.
          </p>
          <p className="text-sm italic text-center mt-4 text-gray-600">
            "Steps with the most checked boxes are your highest-impact AI opportunities"
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-4 block">Pain Type Analysis</Label>
          <p className="text-sm text-muted-foreground mb-4">
            Select all pain types present in each step, then choose which step is most painful overall.
          </p>
          
          <div className="border rounded-lg overflow-hidden" style={{ backgroundColor: '#f9f9f7' }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-900 w-2/5">Workflow Step</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center w-1/6">Manual/<br />Repetitive Work</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center w-1/6">Searching for<br />Information</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center w-1/6">Decision Making<br />& Analysis</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center w-1/12">Select Most<br />Painful</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflowSteps.map((step, index) => {
                  const stepPainTypes = (data.stepPainTypes && data.stepPainTypes[step.id]) || {
                    manualRepetitive: false,
                    searchingInfo: false,
                    decisionMaking: false,
                  };
                  const isSelected = data.selectedStep === step.id;
                  
                  return (
                    <TableRow 
                      key={step.id}
                      className={`cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => onUpdate({ ...data, selectedStep: step.id })}
                    >
                      <TableCell className="align-top py-4">
                        <div className="space-y-1">
                          <p className="font-medium text-sm">Step {index + 1}: {step.name}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                          <p className="text-xs text-muted-foreground italic">
                            Time: {step.timeValue} {step.timeUnit}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center align-middle py-4">
                        <div 
                          className="flex justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            id={`${step.id}-manual`}
                            checked={stepPainTypes.manualRepetitive}
                            onCheckedChange={(checked) => 
                              updatePainType(step.id, 'manualRepetitive', checked as boolean)
                            }
                          />
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center align-middle py-4">
                        <div 
                          className="flex justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            id={`${step.id}-search`}
                            checked={stepPainTypes.searchingInfo}
                            onCheckedChange={(checked) => 
                              updatePainType(step.id, 'searchingInfo', checked as boolean)
                            }
                          />
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center align-middle py-4">
                        <div 
                          className="flex justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            id={`${step.id}-decision`}
                            checked={stepPainTypes.decisionMaking}
                            onCheckedChange={(checked) => 
                              updatePainType(step.id, 'decisionMaking', checked as boolean)
                            }
                          />
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-center align-middle py-4">
                        <div className="flex justify-center">
                          <RadioGroup
                            value={data.selectedStep}
                            onValueChange={(value) => onUpdate({ ...data, selectedStep: value })}
                          >
                            <RadioGroupItem value={step.id} />
                          </RadioGroup>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {errors.selectedStep && (
            <p className="text-sm text-red-500 mt-2">{errors.selectedStep}</p>
          )}
        </div>

        {data.selectedStep && (
          <>
            <div>
              <Label htmlFor="pain-details">Why is this step painful?</Label>
              <Textarea
                id="pain-details"
                placeholder="Describe what makes this step frustrating, time-consuming, or error-prone..."
                value={data.painDetails}
                onChange={(e) => onUpdate({ ...data, painDetails: e.target.value })}
                className={errors.painDetails ? "border-red-500" : ""}
                rows={4}
              />
              {errors.painDetails && (
                <p className="text-sm text-red-500 mt-1">{errors.painDetails}</p>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time-wasted">Time wasted during this step</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        id="time-wasted"
                        type="number"
                        min="1"
                        value={data.timeWasted?.value || ""}
                        onChange={(e) => onUpdate({ 
                          ...data, 
                          timeWasted: { 
                            ...data.timeWasted, 
                            value: parseInt(e.target.value) || 1 
                          } 
                        })}
                        className={`w-24 ${errors.timeWasted ? "border-red-500" : ""}`}
                        placeholder="1"
                      />
                      <Select
                        value={data.timeWasted?.unit || 'hours'}
                        onValueChange={(value) => onUpdate({ 
                          ...data, 
                          timeWasted: { 
                            ...data.timeWasted, 
                            value: data.timeWasted?.value || 1,
                            unit: value as 'minutes' | 'hours' | 'days'
                          } 
                        })}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minutes">minutes</SelectItem>
                          <SelectItem value="hours">hours</SelectItem>
                          <SelectItem value="days">days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.timeWasted && (
                      <p className="text-sm text-red-500 mt-1">{errors.timeWasted}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="frequency">How often does this occur?</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        id="frequency"
                        type="number"
                        min="1"
                        value={data.frequency?.value || ""}
                        onChange={(e) => onUpdate({ 
                          ...data, 
                          frequency: { 
                            ...data.frequency, 
                            value: parseInt(e.target.value) || 1 
                          } 
                        })}
                        className={`w-24 ${errors.frequency ? "border-red-500" : ""}`}
                        placeholder="1"
                      />
                      <Select
                        value={data.frequency?.unit || 'monthly'}
                        onValueChange={(value) => onUpdate({ 
                          ...data, 
                          frequency: { 
                            ...data.frequency, 
                            value: data.frequency?.value || 1,
                            unit: value as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
                          } 
                        })}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">daily</SelectItem>
                          <SelectItem value="weekly">weekly</SelectItem>
                          <SelectItem value="monthly">monthly</SelectItem>
                          <SelectItem value="quarterly">quarterly</SelectItem>
                          <SelectItem value="yearly">yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.frequency && (
                      <p className="text-sm text-red-500 mt-1">{errors.frequency}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={openHelperPromptDialog}
                  className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300"
                >
                  <Eye className="h-4 w-4" />
                  View Helper Prompt
                </Button>
              </div>
            </div>

            {/* Separator */}
            <Separator className="my-6" />

            <div>
              <div className="mb-4">
                <Label>Select AI Approach</Label>
              </div>

              <RadioGroup
                value={data.aiApproach}
                onValueChange={(value) => onUpdate({ ...data, aiApproach: value as any })}
                className="space-y-3"
              >
                {aiApproaches.map((approach) => (
                  <Card
                    key={approach.value}
                    className={data.aiApproach === approach.value ? "border-primary" : ""}
                    style={{ backgroundColor: '#f9f9f7' }}
                  >
                    <CardHeader className="pb-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <RadioGroupItem value={approach.value} className="mt-1" />
                        <div className="flex-1">
                          <CardTitle className="text-base">{approach.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {approach.description}
                          </CardDescription>
                        </div>
                      </label>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        <strong>Examples:</strong> {approach.examples.join(", ")}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
              {errors.aiApproach && (
                <p className="text-sm text-red-500 mt-1">{errors.aiApproach}</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleComplete}>Continue to Step Breakdown</Button>
      </div>

      {/* Helper Prompt Dialog */}
      <Dialog open={showHelperPromptDialog} onOpenChange={setShowHelperPromptDialog}>
        <DialogContent className="max-w-[900px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>AI Approach Selection Helper Prompt</DialogTitle>
            <DialogDescription>
              Use this helper prompt to guide your AI approach selection. You can edit the content and copy it to your clipboard.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-4 py-4">
            <Textarea
              value={helperPromptContent}
              onChange={(e) => setHelperPromptContent(e.target.value)}
              className="flex-1 font-mono text-sm resize-none min-h-[500px]"
              placeholder="Helper prompt content will appear here..."
            />
            <div className="flex justify-end">
              <Button
                onClick={copyHelperPrompt}
                className={`flex items-center gap-2 ${copiedPrompt ? 'bg-green-600 hover:bg-green-700' : ''}`}
              >
                {copiedPrompt ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Copied to Clipboard
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}