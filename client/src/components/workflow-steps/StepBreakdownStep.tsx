import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, X, FileText, Database, Brain, User, Eye, Copy, CheckCircle2, Check, Hash, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubStep {
  id: string;
  description: string;
  toolsSystem: string;
  aiApproach: ("prompt" | "rag" | "agentic" | "none")[];
  timeSavings: number;
  humanInvolvement: "full" | "partial" | "review";
  roleDescription: string;
}

interface StepBreakdownStepProps {
  selectedStep?: { 
    id: string; 
    name: string; 
    description: string; 
    toolSystem: string;
    dataInfo: string;
    privacyLevel: 'internal' | 'sensitive' | 'confidential' | 'public';
    timeValue: number;
    timeUnit: 'minutes' | 'hours' | 'days';
  };
  data: {
    inputs: Array<{ id: string; name: string; type: string }>;
    subSteps: SubStep[];
    outputs: Array<{ id: string; name: string }>;
  };
  onUpdate: (data: any) => void;
  onComplete: () => void;
  onBack?: () => void;
}

const inputTypes = [
  { value: "text", label: "Text Input", icon: FileText },
  { value: "file", label: "File/Document", icon: FileText },
  { value: "data", label: "Data/Database", icon: Database },
  { value: "decision", label: "Human Decision", icon: User },
];

const aiApproachOptions = [
  { value: "none", label: "No AI", color: "text-gray-500" },
  { value: "prompt", label: "Prompt-Only", color: "text-blue-600" },
  { value: "rag", label: "RAG", color: "text-green-600" },
  { value: "agentic", label: "Agentic", color: "text-purple-600" },
];


export function StepBreakdownStep({ selectedStep, data, onUpdate, onComplete, onBack }: StepBreakdownStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState<"breakdown" | "redesign">("breakdown");
  const [section1Complete, setSection1Complete] = useState(false);
  const [showHelperDialog, setShowHelperDialog] = useState(false);
  const [helperType, setHelperType] = useState<"aiApproach" | "timeSavings" | "humanInvolvement" | "stepBreakdown" | "redesignHelper">("aiApproach");
  const [helperContent, setHelperContent] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [currentSubStepId, setCurrentSubStepId] = useState<string>("");

  const addInput = () => {
    const newInput = {
      id: `input-${Date.now()}`,
      name: "",
      type: "text",
    };
    onUpdate({
      ...data,
      inputs: [...data.inputs, newInput],
    });
  };

  const removeInput = (id: string) => {
    onUpdate({
      ...data,
      inputs: data.inputs.filter((input) => input.id !== id),
    });
  };

  const updateInput = (id: string, field: string, value: string) => {
    onUpdate({
      ...data,
      inputs: data.inputs.map((input) =>
        input.id === id ? { ...input, [field]: value } : input
      ),
    });
  };

  const addSubStep = () => {
    const newSubStep: SubStep = {
      id: `substep-${Date.now()}`,
      description: "",
      toolsSystem: "",
      aiApproach: ["none"],
      timeSavings: 0,
      humanInvolvement: "full",
      roleDescription: "",
    };
    onUpdate({
      ...data,
      subSteps: [...data.subSteps, newSubStep],
    });
  };

  const removeSubStep = (id: string) => {
    onUpdate({
      ...data,
      subSteps: data.subSteps.filter((step) => step.id !== id),
    });
  };

  const updateSubStep = (id: string, field: keyof SubStep, value: any) => {
    onUpdate({
      ...data,
      subSteps: data.subSteps.map((step) =>
        step.id === id ? { ...step, [field]: value } : step
      ),
    });
  };

  const addOutput = () => {
    const newOutput = {
      id: `output-${Date.now()}`,
      name: "",
    };
    onUpdate({
      ...data,
      outputs: [...data.outputs, newOutput],
    });
  };

  const removeOutput = (id: string) => {
    onUpdate({
      ...data,
      outputs: data.outputs.filter((output) => output.id !== id),
    });
  };

  const updateOutput = (id: string, value: string) => {
    onUpdate({
      ...data,
      outputs: data.outputs.map((output) =>
        output.id === id ? { ...output, name: value } : output
      ),
    });
  };

  const validateSection1 = () => {
    const newErrors: Record<string, string> = {};

    if (data.inputs.length === 0) {
      newErrors.inputs = "At least one input is required";
    }

    if (data.subSteps.length === 0) {
      newErrors.subSteps = "At least one sub-step is required";
    }

    if (data.outputs.length === 0) {
      newErrors.outputs = "At least one output is required";
    }

    data.inputs.forEach((input) => {
      if (!input.name.trim()) {
        newErrors[`input-${input.id}`] = "Input name is required";
      }
    });

    data.subSteps.forEach((step, index) => {
      if (!step.description.trim()) {
        newErrors[`substep-${step.id}-desc`] = `Sub-step ${index + 1} description is required`;
      }
      if (!step.toolsSystem.trim()) {
        newErrors[`substep-${step.id}-tools`] = `Sub-step ${index + 1} tools/system is required`;
      }
    });

    data.outputs.forEach((output) => {
      if (!output.name.trim()) {
        newErrors[`output-${output.id}`] = "Output name is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSection2 = () => {
    const newErrors: Record<string, string> = {};

    data.subSteps.forEach((step, index) => {
      const hasAI = !step.aiApproach.includes("none") || step.aiApproach.length > 1;
      if (hasAI && step.timeSavings === 0) {
        newErrors[`substep-${step.id}-timesavings`] = `Please estimate time savings for sub-step ${index + 1}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSection1Complete = () => {
    if (validateSection1()) {
      setSection1Complete(true);
      setCurrentSection("redesign");
      setErrors({});
    }
  };

  const handleComplete = () => {
    if (validateSection2()) {
      onComplete();
    }
  };

  const copyHelperPrompt = async () => {
    await navigator.clipboard.writeText(helperContent);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const openHelperDialog = (type: "aiApproach" | "timeSavings" | "humanInvolvement" | "stepBreakdown" | "redesignHelper", subStepId: string) => {
    setHelperType(type);
    setCurrentSubStepId(subStepId);
    const subStep = data.subSteps.find(s => s.id === subStepId);
    if (!subStep && type !== "stepBreakdown" && type !== "redesignHelper") return;
    
    let content = "";
    
    switch(type) {
      case "stepBreakdown":
        content = `You are an expert business process analyst. Help the user break down their selected workflow step into detailed sub-steps, inputs, and outputs.

Selected Step: ${selectedStep?.name || '[Step Name]'} - ${selectedStep?.description || '[Step Description]'}

Your task is to help them identify:

INPUTS:
- What information, documents, or data is needed to start this step?
- Consider both digital files and human inputs/decisions
- Think about dependencies from previous steps

SUB-STEPS:
- Break this step into 2-5 logical sub-steps
- Each sub-step should be a distinct action or task
- Include what tools/systems are used for each sub-step
- Focus on the current "as-is" process, not AI improvements

OUTPUTS:
- What deliverables, documents, or results are produced?
- What gets passed to the next workflow step?
- Include both formal outputs and informal communications

Provide your analysis in this format:

RECOMMENDED INPUTS:
1. [Input name] - [Type: Text/File/Data/Decision]
2. [Input name] - [Type: Text/File/Data/Decision]

RECOMMENDED SUB-STEPS:
1. [Sub-step description] - Tools: [System/tool used]
2. [Sub-step description] - Tools: [System/tool used]
3. [Sub-step description] - Tools: [System/tool used]

RECOMMENDED OUTPUTS:
1. [Output name/description]
2. [Output name/description]`;
        break;
        
      case "redesignHelper":
        content = `You are an expert AI implementation strategist. Help the user design how AI will enhance each sub-step in their workflow.

Selected Step: ${selectedStep?.name || '[Step Name]'} - ${selectedStep?.description || '[Step Description]'}

Current Sub-steps to Redesign:
${data.subSteps.map((step, index) => `${index + 1}. ${step.description || '[Description needed]'} - Tools: ${step.toolsSystem || '[Tools needed]'}`).join('\n')}

For each sub-step, you'll need to configure:

🤖 AI APPROACH (Multi-select checkboxes):
- No AI: Keep fully manual if human judgment/creativity is essential
- Prompt-Only: For text generation, summarization, analysis, formatting tasks
- RAG (Retrieval): When you need to query documents, knowledge bases, or datasets
- Agentic: For complex multi-step processes, API integrations, or decision workflows
- COMBINE MULTIPLE: Select multiple approaches for comprehensive automation (e.g., RAG + Prompt-Only for document analysis with custom formatting)

📊 TIME SAVINGS (Number input with %):
Enter realistic percentage based on:
- 10-30%: Simple assistance (templates, suggestions, basic formatting)
- 30-50%: Moderate automation (document processing, data extraction, routine analysis)
- 50-80%: Significant automation (pattern recognition, bulk processing, decision support)
- 80-95%: High automation (routine tasks, standardized processes, data entry)
- Consider: Learning curve, setup time, error handling, and quality requirements

👥 HUMAN INVOLVEMENT (Dropdown selection):
- Full Control: Human performs task with AI providing suggestions and assistance
- Partial (AI assists): AI handles bulk work, human provides guidance and reviews decisions
- Review Only: AI works autonomously, human validates and approves final outputs

📝 AI & HUMAN ROLE DESCRIPTION (Text area):
Write a detailed explanation covering:
- Specific AI responsibilities vs. human responsibilities
- How AI and humans will collaborate and hand off work
- Quality control processes and review checkpoints
- Escalation procedures for edge cases or errors
- Success metrics and validation criteria

EXAMPLE RECOMMENDATIONS:

SUB-STEP 1: Data Collection and Validation
✅ AI Approaches: Prompt-Only + RAG (for validation rules lookup)
📊 Time Savings: 65% - AI handles data formatting and validation, significantly reducing manual effort
👥 Human Involvement: Partial (AI assists) - AI processes data, human reviews exceptions
📝 Role Description: "AI will automatically format incoming data and cross-reference validation rules from our knowledge base. Humans will review flagged exceptions, approve batch processing, and handle complex data conflicts that require business judgment."

SUB-STEP 2: Report Generation
✅ AI Approaches: Prompt-Only + Agentic (for multi-step report assembly)
📊 Time Savings: 75% - Automated report creation with minimal manual intervention
👥 Human Involvement: Review Only - AI generates complete reports for human approval
📝 Role Description: "AI will pull data from multiple sources, apply templates, generate insights, and create formatted reports. Humans will review final outputs for accuracy, approve publication, and handle stakeholder communications."

Provide specific recommendations for each of your sub-steps using this framework.`;
        break;
        
      case "aiApproach":
        content = `You are an expert AI Solutions Architect. Analyze the following sub-step and recommend the most appropriate AI approach.

Sub-step Description: ${subStep?.description || '[Sub-step description]'}
Tools/Systems Used: ${subStep?.toolsSystem || '[Tools/systems]'}

Available AI Approaches:
1. No AI - Keep this step fully manual
2. Prompt-Only - Direct instruction to an LLM for self-contained tasks
3. RAG - Combines prompt with retrieval from knowledge bases
4. Agentic - Multi-step execution with tool use and external integrations

Provide your recommendation in this format:
Recommended Approach: [Choose one]
Reasoning: [Explain why this approach is most suitable]`;
        break;
        
      case "timeSavings":
        content = `You are an efficiency expert. Estimate the realistic time savings for automating this sub-step.

Sub-step Description: ${subStep?.description || '[Sub-step description]'}
Current Tools/Systems: ${subStep?.toolsSystem || '[Tools/systems]'}
AI Approach Selected: ${subStep?.aiApproach || '[AI approach]'}

Consider:
- Initial learning curve
- Realistic automation potential
- Human oversight requirements
- Error reduction benefits

Provide your estimate:
Time Savings: [0-100%]
Justification: [Explain your reasoning]`;
        break;
        
      case "humanInvolvement":
        content = `You are a process automation expert. Determine the appropriate level of human involvement for this AI-enhanced sub-step.

Sub-step Description: ${subStep?.description || '[Sub-step description]'}
AI Approach: ${subStep?.aiApproach || '[AI approach]'}
Time Savings Target: ${subStep?.timeSavings || 0}%

Human Involvement Levels:
1. Full Control - Human performs task with AI assistance
2. Partial - AI performs task with human guidance
3. Review Only - AI performs autonomously, human reviews results

Recommendation:
Level: [Choose one]
Rationale: [Explain based on risk, complexity, and business requirements]`;
        break;
    }
    
    setHelperContent(content);
    setShowHelperDialog(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4">Break Down Your Selected Step</h3>
        {selectedStep && (
          <Alert className="mb-4">
            <AlertDescription>
              <strong>Selected Step:</strong> {selectedStep.name} - {selectedStep.description}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Section Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentSection === "breakdown" ? "bg-primary text-primary-foreground" : 
              section1Complete ? "bg-green-600 text-white" : "bg-gray-200"
            }`}>
              {section1Complete ? <Check className="h-4 w-4" /> : "1"}
            </div>
            <span className={`font-medium ${currentSection === "breakdown" ? "text-primary" : ""}`}>
              3.1 Step Breakdown
            </span>
          </div>
          
          <div className="h-px bg-gray-200 flex-1" />
          
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentSection === "redesign" ? "bg-primary text-primary-foreground" : "bg-gray-200"
            } ${!section1Complete ? "opacity-50" : ""}`}>
              2
            </div>
            <span className={`font-medium ${currentSection === "redesign" ? "text-primary" : ""} ${
              !section1Complete ? "opacity-50" : ""
            }`}>
              3.2 Redesign the Step
            </span>
          </div>
        </div>
      </div>

      {/* Section 3.1: Step Breakdown */}
      {currentSection === "breakdown" && (
        <>
          <div className="flex items-start justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Define the inputs, sub-steps, and outputs for this workflow step.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => openHelperDialog("stepBreakdown", "")}
              className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300 h-8"
            >
              <Eye className="h-3 w-3" />
              View Helper Prompt
            </Button>
          </div>

          {/* Inputs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Inputs Required</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addInput}
                className="flex items-center gap-1 h-8"
              >
                <Plus className="h-3 w-3" />
                Add Input
              </Button>
            </div>
            {errors.inputs && (
              <Alert variant="destructive" className="mb-3">
                <AlertDescription>{errors.inputs}</AlertDescription>
              </Alert>
            )}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-medium">Input Name</TableHead>
                    <TableHead className="font-medium w-[200px] hidden sm:table-cell">Type</TableHead>
                    <TableHead className="font-medium w-[60px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.inputs.map((input) => (
                    <TableRow key={input.id} className="hover:bg-gray-50/50 group">
                      <TableCell className="py-2">
                        <div className="space-y-2">
                          <Input
                            placeholder="e.g., Sales data, Customer list, Meeting notes"
                            value={input.name}
                            onChange={(e) => updateInput(input.id, "name", e.target.value)}
                            className={`border-0 bg-transparent p-2 focus:bg-white focus:border focus:border-primary focus:shadow-sm transition-all ${errors[`input-${input.id}`] ? "focus:border-red-500" : ""}`}
                          />
                          {/* Mobile type selector */}
                          <div className="sm:hidden">
                            <Select
                              value={input.type}
                              onValueChange={(value) => updateInput(input.id, "type", value)}
                            >
                              <SelectTrigger className="border-0 bg-gray-50 focus:bg-white focus:border focus:border-primary focus:shadow-sm transition-all hover:bg-gray-100 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {inputTypes.map((type) => {
                                  const Icon = type.icon;
                                  return (
                                    <SelectItem key={type.value} value={type.value}>
                                      <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        {type.label}
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                          {errors[`input-${input.id}`] && (
                            <p className="text-xs text-red-500 px-2">{errors[`input-${input.id}`]}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-2 hidden sm:table-cell">
                        <Select
                          value={input.type}
                          onValueChange={(value) => updateInput(input.id, "type", value)}
                        >
                          <SelectTrigger className="border-0 bg-transparent focus:bg-white focus:border focus:border-primary focus:shadow-sm transition-all hover:bg-gray-50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {inputTypes.map((type) => {
                              const Icon = type.icon;
                              return (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    {type.label}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="py-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeInput(input.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {data.inputs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                        No inputs added yet. Click "Add Input" to get started.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Sub-steps Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Sub-steps</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSubStep}
                className="flex items-center gap-1 h-8"
              >
                <Plus className="h-3 w-3" />
                Add Sub-step
              </Button>
            </div>
            {errors.subSteps && (
              <Alert variant="destructive" className="mb-3">
                <AlertDescription>{errors.subSteps}</AlertDescription>
              </Alert>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.subSteps.map((step, index) => (
                <div key={step.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50/50 hover:border-gray-300 group transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium">Sub-step {index + 1}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubStep(step.id)}
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
                      <Textarea
                        placeholder="Describe what happens in this sub-step..."
                        value={step.description}
                        onChange={(e) => updateSubStep(step.id, "description", e.target.value)}
                        className={`resize-none text-sm ${errors[`substep-${step.id}-desc`] ? "border-red-500" : ""}`}
                        rows={3}
                      />
                      {errors[`substep-${step.id}-desc`] && (
                        <p className="text-xs text-red-500 mt-1">{errors[`substep-${step.id}-desc`]}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground mb-1 block">Tools/Systems</Label>
                      <Textarea
                        placeholder="What tools or systems are used? (e.g., Excel, SharePoint, Email)"
                        value={step.toolsSystem}
                        onChange={(e) => updateSubStep(step.id, "toolsSystem", e.target.value)}
                        className={`resize-none text-sm ${errors[`substep-${step.id}-tools`] ? "border-red-500" : ""}`}
                        rows={2}
                      />
                      {errors[`substep-${step.id}-tools`] && (
                        <p className="text-xs text-red-500 mt-1">{errors[`substep-${step.id}-tools`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {data.subSteps.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground border-2 border-dashed border-gray-200 rounded-lg">
                  <Hash className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No sub-steps added yet. Click "Add Sub-step" to break down this workflow step.</p>
                </div>
              )}
            </div>
          </div>

          {/* Outputs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Expected Outputs</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOutput}
                className="flex items-center gap-1 h-8"
              >
                <Plus className="h-3 w-3" />
                Add Output
              </Button>
            </div>
            {errors.outputs && (
              <Alert variant="destructive" className="mb-3">
                <AlertDescription>{errors.outputs}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              {data.outputs.map((output) => (
                <div key={output.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50/50 group">
                  <Input
                    placeholder="Output name (e.g., Monthly report, Updated database)"
                    value={output.name}
                    onChange={(e) => updateOutput(output.id, e.target.value)}
                    className={`flex-1 ${errors[`output-${output.id}`] ? "border-red-500" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOutput(output.id)}
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  {errors[`output-${output.id}`] && (
                    <p className="text-sm text-red-500 mt-1">{errors[`output-${output.id}`]}</p>
                  )}
                </div>
              ))}
              
              {data.outputs.length === 0 && (
                <div className="text-center py-6 text-muted-foreground border-2 border-dashed border-gray-200 rounded-lg">
                  <p>No outputs added yet. Click "Add Output" to define expected results.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
              Back
            </Button>
            <Button onClick={handleSection1Complete} className="w-full sm:w-auto">Continue to Redesign</Button>
          </div>
        </>
      )}

      {/* Section 3.2: Redesign the Step */}
      {currentSection === "redesign" && (
        <>
          <div className="flex items-start justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Now let's design how AI will enhance each sub-step.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => openHelperDialog("redesignHelper", "")}
              className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300 h-8"
            >
              <Eye className="h-3 w-3" />
              View Helper Prompt
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.subSteps.map((step, index) => (
              <Card key={step.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                      {index + 1}
                    </div>
                    <CardTitle className="text-sm">Sub-step {index + 1}</CardTitle>
                  </div>
                  <CardDescription className="mt-2 text-xs">
                    <strong>Description:</strong> {step.description || "No description"}
                    <br />
                    <strong>Tools/Systems:</strong> {step.toolsSystem || "No tools specified"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {/* AI Approach - Multi-select checkboxes */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">AI Approach</Label>
                    <div className="space-y-2">
                      {aiApproachOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${step.id}-${option.value}`}
                            checked={step.aiApproach.includes(option.value as any)}
                            onCheckedChange={(checked) => {
                              let newApproaches = [...step.aiApproach];
                              if (checked) {
                                if (option.value === "none") {
                                  // If "No AI" is selected, clear all others
                                  newApproaches = ["none"];
                                } else {
                                  // Remove "No AI" if other options are selected
                                  newApproaches = newApproaches.filter(a => a !== "none");
                                  newApproaches.push(option.value as any);
                                }
                              } else {
                                newApproaches = newApproaches.filter(a => a !== option.value);
                                // If no approaches left, default to "No AI"
                                if (newApproaches.length === 0) {
                                  newApproaches = ["none"];
                                }
                              }
                              updateSubStep(step.id, "aiApproach", newApproaches);
                            }}
                          />
                          <Label
                            htmlFor={`${step.id}-${option.value}`}
                            className={`text-xs cursor-pointer ${option.color}`}
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Savings - Number input */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Time Savings</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={step.timeSavings}
                        onChange={(e) => updateSubStep(step.id, "timeSavings", parseInt(e.target.value) || 0)}
                        className="pr-8"
                        disabled={step.aiApproach.includes("none") && step.aiApproach.length === 1}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                        %
                      </span>
                    </div>
                    {errors[`substep-${step.id}-timesavings`] && (
                      <p className="text-xs text-red-500 mt-1">{errors[`substep-${step.id}-timesavings`]}</p>
                    )}
                  </div>

                  {/* Human Involvement - Dropdown */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Human Involvement</Label>
                    <Select
                      value={step.humanInvolvement}
                      onValueChange={(value) => updateSubStep(step.id, "humanInvolvement", value)}
                      disabled={step.aiApproach.includes("none") && step.aiApproach.length === 1}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Control</SelectItem>
                        <SelectItem value="partial">Partial (AI assists)</SelectItem>
                        <SelectItem value="review">Review Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* AI and Human Role Description */}
                  <div>
                    <div className="flex items-center gap-1 mb-2">
                      <Label className="text-sm font-medium">Describe AI and Human Role</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-xs">
                              Describe specifically what the AI will do vs. what humans will do, 
                              how they'll interact, and quality control processes.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Textarea
                      placeholder="Describe the specific roles and responsibilities of AI vs. humans in this sub-step..."
                      value={step.roleDescription}
                      onChange={(e) => updateSubStep(step.id, "roleDescription", e.target.value)}
                      className="resize-none text-xs"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                setCurrentSection("breakdown");
                setErrors({});
              }}
              className="w-full sm:w-auto"
            >
              Back to Step Breakdown
            </Button>
            <Button onClick={handleComplete} className="w-full sm:w-auto">Generate Enhancement Plan</Button>
          </div>
        </>
      )}

      {/* Helper Prompt Dialog */}
      <Dialog open={showHelperDialog} onOpenChange={setShowHelperDialog}>
        <DialogContent className="max-w-[900px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {helperType === "stepBreakdown" && "Step Breakdown Helper"}
              {helperType === "redesignHelper" && "AI Implementation Helper"}
              {helperType === "aiApproach" && "AI Approach Selection Helper"}
              {helperType === "timeSavings" && "Time Savings Estimation Helper"}
              {helperType === "humanInvolvement" && "Human Involvement Decision Helper"}
            </DialogTitle>
            <DialogDescription>
              Use this helper prompt to guide your decision. You can edit the content and copy it to your clipboard.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-4 py-4">
            <Textarea
              value={helperContent}
              onChange={(e) => setHelperContent(e.target.value)}
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