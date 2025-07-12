import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Info, Trash2, Copy, CheckCircle2, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  toolSystem: string;
  dataInfo: string;
  privacyLevel: 'internal' | 'sensitive' | 'confidential' | 'public';
  timeValue: number;
  timeUnit: 'minutes' | 'hours' | 'days';
}

interface WorkflowMappingStepProps {
  data: {
    name: string;
    description: string;
    frequency: {
      number: number;
      period: 'day' | 'week' | 'month' | 'quarter' | 'year';
    };
    steps: WorkflowStep[];
    painPoints: string;
  };
  onUpdate: (data: any) => void;
  onComplete: () => void;
}

export function WorkflowMappingStep({ data, onUpdate, onComplete }: WorkflowMappingStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [editablePrompt, setEditablePrompt] = useState("");

  const addStep = () => {
    if (data.steps.length >= 5) return; // Max 5 steps
    
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: "",
      description: "",
      toolSystem: "",
      dataInfo: "",
      privacyLevel: 'internal',
      timeValue: 30,
      timeUnit: 'minutes',
    };
    onUpdate({
      ...data,
      steps: [...data.steps, newStep],
    });
  };

  const removeStep = (id: string) => {
    onUpdate({
      ...data,
      steps: data.steps.filter((step) => step.id !== id),
    });
  };

  const updateStep = (id: string, field: keyof WorkflowStep, value: string | number) => {
    onUpdate({
      ...data,
      steps: data.steps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      ),
    });
  };

  const updateFrequency = (field: 'number' | 'period', value: number | string) => {
    onUpdate({
      ...data,
      frequency: {
        ...data.frequency,
        [field]: value,
      },
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) {
      newErrors.name = "Workflow name is required";
    }

    if (data.frequency.number <= 0) {
      newErrors.frequency = "Frequency must be greater than 0";
    }

    if (data.steps.length === 0) {
      newErrors.steps = "At least one workflow step is required";
    } else {
      data.steps.forEach((step, index) => {
        if (!step.name.trim()) {
          newErrors[`step-${step.id}-name`] = `Step ${index + 1} name is required`;
        }
        if (!step.description.trim()) {
          newErrors[`step-${step.id}-description`] = `Step ${index + 1} description is required`;
        }
        if (step.timeValue <= 0) {
          newErrors[`step-${step.id}-time`] = `Step ${index + 1} time must be greater than 0`;
        }
      });
    }

    if (!data.painPoints.trim()) {
      newErrors.painPoints = "Please describe the pain points in this workflow";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = () => {
    if (validate()) {
      onComplete();
    }
  };

  const generateHelperPrompt = () => {
    const frequencyText = `${data.frequency.number} per ${data.frequency.period.charAt(0).toUpperCase() + data.frequency.period.slice(1)}`;
    
    const prompt = `You are an expert business process analyst. Your core function is to analyze a user-described workflow and deconstruct it into a sequence of 5 detailed, structured steps. For the workflow provided below, you will generate a list of the 5 most logical steps to complete it.

Workflow Details to Analyze:

Workflow Name: ${data.name || '[Workflow Name]'}

Brief Description: ${data.description || '[Brief Description]'}

Frequency: ${frequencyText}

Based on the information above, generate a response that breaks the workflow down into exactly 5 distinct steps. For each step, provide the details precisely in the following format. Do not add any introductory or concluding text outside of the step definitions.

Step 1:

Step Name: [A short, action-oriented name for the step]

Step Description: [A one-sentence description of the task]

Tool/System: [The primary software or system used]

Data/Information: [The key data or information needed/generated]

Privacy Level: [Choose one: PUBLIC, INTERNAL, SENSITIVE, CONFIDENTIAL]

Time: [A number followed by "minutes", "hours", or "days"]

Step 2:

Step Name: [Name for Step 2]

Step Description: [Description for Step 2]

Tool/System: [Tool for Step 2]

Data/Information: [Data for Step 2]

Privacy Level: [Choose one: PUBLIC, INTERNAL, SENSITIVE, CONFIDENTIAL]

Time: [Time for Step 2]

Step 3:

Step Name: [Name for Step 3]

Step Description: [Description for Step 3]

Tool/System: [Tool for Step 3]

Data/Information: [Data for Step 3]

Privacy Level: [Choose one: PUBLIC, INTERNAL, SENSITIVE, CONFIDENTIAL]

Time: [Time for Step 3]

Step 4:

Step Name: [Name for Step 4]

Step Description: [Description for Step 4]

Tool/System: [Tool for Step 4]

Data/Information: [Data for Step 4]

Privacy Level: [Choose one: PUBLIC, INTERNAL, SENSITIVE, CONFIDENTIAL]

Time: [Time for Step 4]

Step 5:

Step Name: [Name for Step 5]

Step Description: [Description for Step 5]

Tool/System: [Tool for Step 5]

Data/Information: [Data for Step 5]

Privacy Level: [Choose one: PUBLIC, INTERNAL, SENSITIVE, CONFIDENTIAL]

Time: [Time for Step 5]

Guidelines for Field Values
Privacy Level: Categorize the data's sensitivity.

CONFIDENTIAL: For highly restricted data intended for executives or containing strategic secrets.

SENSITIVE: For data limited to specific teams or roles, like departmental performance or personnel information.

INTERNAL: For general company-wide information.

PUBLIC: For any information intended for external release.

Time: Provide a realistic time estimate using a number followed by the appropriate unit (minutes, hours, or days). Examples: "30 minutes", "2 hours", "1 day".`;

    return prompt;
  };

  const copyHelperPrompt = async () => {
    await navigator.clipboard.writeText(editablePrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const openPromptDialog = () => {
    const prompt = generateHelperPrompt();
    setEditablePrompt(prompt);
    setShowPromptDialog(true);
  };

  const InfoTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info className="h-4 w-4 text-muted-foreground ml-1" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Map Your Current Workflow</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Start by describing your current workflow process. Be specific about each step and the time it takes.
        </p>
      </div>

      {/* 1.1 Workflow Details */}
      <Card style={{ backgroundColor: '#f9f9f7' }}>
        <CardHeader>
          <CardTitle className="text-base">1.1 Workflow Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="workflow-name" className="flex items-center text-sm font-medium">
                Workflow Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="workflow-name"
                placeholder="Create a market research report"
                value={data.name}
                onChange={(e) => onUpdate({ ...data, name: e.target.value })}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workflow-description" className="text-sm font-medium">Brief Description</Label>
              <Textarea
                id="workflow-description"
                placeholder="Create a market research report."
                value={data.description}
                onChange={(e) => onUpdate({ ...data, description: e.target.value })}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium">
              How often do you perform this workflow? <span className="text-red-500 ml-1">*</span>
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                min="1"
                value={data.frequency.number}
                onChange={(e) => updateFrequency('number', parseInt(e.target.value) || 1)}
                className={`w-24 ${errors.frequency ? "border-red-500" : ""}`}
              />
              <Select
                value={data.frequency.period}
                onValueChange={(value) => updateFrequency('period', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">per Day</SelectItem>
                  <SelectItem value="week">per Week</SelectItem>
                  <SelectItem value="month">per Month</SelectItem>
                  <SelectItem value="quarter">per Quarter</SelectItem>
                  <SelectItem value="year">per Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.frequency && (
              <p className="text-sm text-red-500 mt-1">{errors.frequency}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 1.2 Break It Down Into Steps */}
      <Card style={{ backgroundColor: '#f9f9f7' }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">1.2 Break It Down Into Steps (Max 5)</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openPromptDialog}
                className="flex items-center gap-1 bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300"
              >
                <Eye className="h-4 w-4" />
                View Helper Prompt
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStep}
                disabled={data.steps.length >= 5}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Step
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {errors.steps && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errors.steps}</AlertDescription>
            </Alert>
          )}

          {data.steps.length === 0 ? (
            <Card className="border-dashed border-2">
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  No steps added yet. Click "Add Step" to start mapping your workflow.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.steps.map((step, index) => (
                <Card key={step.id} className="bg-green-50 border-green-200 relative">
                  <CardContent className="p-5 space-y-4">
                    {/* Step Header */}
                    <div className="flex items-center justify-between">
                      <Badge variant="default" className="bg-blue-600">
                        {index + 1}
                      </Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(step.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Step Name */}
                    <div className="space-y-1">
                      <Label className="flex items-center text-xs font-medium">
                        Step Name
                        <InfoTooltip content="Brief name for this step" />
                      </Label>
                      <Input
                        placeholder="Define Objectives"
                        value={step.name}
                        onChange={(e) => updateStep(step.id, "name", e.target.value)}
                        className={`text-sm ${errors[`step-${step.id}-name`] ? "border-red-500" : ""}`}
                      />
                      {errors[`step-${step.id}-name`] && (
                        <p className="text-xs text-red-500 mt-1">{errors[`step-${step.id}-name`]}</p>
                      )}
                    </div>

                    {/* Step Description */}
                    <div className="space-y-1">
                      <Label className="flex items-center text-xs font-medium">
                        Step Description
                        <InfoTooltip content="Detailed description of what happens in this step" />
                      </Label>
                      <Textarea
                        placeholder="Define project objectives and scope"
                        value={step.description}
                        onChange={(e) => updateStep(step.id, "description", e.target.value)}
                        className={`text-sm resize-none ${errors[`step-${step.id}-description`] ? "border-red-500" : ""}`}
                        rows={2}
                      />
                      {errors[`step-${step.id}-description`] && (
                        <p className="text-xs text-red-500 mt-1">{errors[`step-${step.id}-description`]}</p>
                      )}
                    </div>

                    {/* Tool/System */}
                    <div className="space-y-1">
                      <Label className="flex items-center text-xs font-medium">
                        Tool/System
                        <InfoTooltip content="What tools or systems do you use for this step?" />
                      </Label>
                      <Input
                        placeholder="Meeting Software"
                        value={step.toolSystem}
                        onChange={(e) => updateStep(step.id, "toolSystem", e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    {/* Data/Information */}
                    <div className="space-y-1">
                      <Label className="flex items-center text-xs font-medium">
                        Data/Information
                        <InfoTooltip content="What data or information is processed in this step?" />
                      </Label>
                      <Textarea
                        placeholder="Sales records, transaction details, and department reports"
                        value={step.dataInfo}
                        onChange={(e) => updateStep(step.id, "dataInfo", e.target.value)}
                        className="text-sm resize-none"
                        rows={2}
                      />
                    </div>

                    {/* Privacy Level */}
                    <div className="space-y-1">
                      <Label className="flex items-center text-xs font-medium">
                        Privacy Level
                        <InfoTooltip content="Data sensitivity level for this step" />
                      </Label>
                      <Select
                        value={step.privacyLevel}
                        onValueChange={(value) => updateStep(step.id, "privacyLevel", value)}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">INTERNAL</SelectItem>
                          <SelectItem value="sensitive">SENSITIVE</SelectItem>
                          <SelectItem value="confidential">CONFIDENTIAL</SelectItem>
                          <SelectItem value="public">PUBLIC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Time */}
                    <div className="space-y-1">
                      <Label className="flex items-center text-xs font-medium">
                        Time
                        <InfoTooltip content="How long does this step typically take?" />
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          placeholder="30"
                          value={step.timeValue || ""}
                          onChange={(e) => updateStep(step.id, "timeValue", parseInt(e.target.value) || 0)}
                          className={`text-sm w-20 ${errors[`step-${step.id}-time`] ? "border-red-500" : ""}`}
                        />
                        <Select
                          value={step.timeUnit}
                          onValueChange={(value) => updateStep(step.id, "timeUnit", value)}
                        >
                          <SelectTrigger className="text-sm w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {errors[`step-${step.id}-time`] && (
                        <p className="text-xs text-red-500">{errors[`step-${step.id}-time`]}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pain Points */}
      <div>
        <Label htmlFor="pain-points" className="text-base font-medium">
          What are the biggest pain points in this workflow?
        </Label>
        <Textarea
          id="pain-points"
          placeholder="Describe what makes this process frustrating, time-consuming, or error-prone..."
          value={data.painPoints}
          onChange={(e) => onUpdate({ ...data, painPoints: e.target.value })}
          className={`mt-2 ${errors.painPoints ? "border-red-500" : ""}`}
          rows={4}
        />
        {errors.painPoints && (
          <p className="text-sm text-red-500 mt-1">{errors.painPoints}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleComplete}>Continue to Pain Point Analysis</Button>
      </div>

      {/* Helper Prompt Dialog */}
      <Dialog open={showPromptDialog} onOpenChange={setShowPromptDialog}>
        <DialogContent className="max-w-[900px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Helper Prompt</DialogTitle>
            <DialogDescription>
              Review and edit the helper prompt before copying it to your clipboard.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-4 py-4">
            <Textarea
              value={editablePrompt}
              onChange={(e) => setEditablePrompt(e.target.value)}
              className="flex-1 font-mono text-sm resize-none min-h-[500px]"
              placeholder="Helper prompt will appear here..."
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