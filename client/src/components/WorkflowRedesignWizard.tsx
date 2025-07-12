import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useCourseProgress } from "@/contexts/CourseProgressContext";
import { WorkflowMappingStep } from "./workflow-steps/WorkflowMappingStep";
import { PainPointStep } from "./workflow-steps/PainPointStep";
import { StepBreakdownStep } from "./workflow-steps/StepBreakdownStep";
import { EnhancementPlanStep } from "./workflow-steps/EnhancementPlanStep";
import { BusinessCaseStep } from "./workflow-steps/BusinessCaseStep";

interface WorkflowRedesignWizardProps {
  lessonId?: string;
  subLessonId?: string;
}

export interface WorkflowWizardData {
  currentWorkflow: {
    name: string;
    description: string;
    frequency: {
      number: number;
      period: 'day' | 'week' | 'month' | 'quarter' | 'year';
    };
    steps: Array<{
      id: string;
      name: string;
      description: string;
      toolSystem: string;
      dataInfo: string;
      privacyLevel: 'internal' | 'sensitive' | 'confidential' | 'public';
      timeValue: number;
      timeUnit: 'minutes' | 'hours' | 'days';
    }>;
    painPoints: string;
  };
  painPointAnalysis: {
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
  stepBreakdown: {
    inputs: Array<{ id: string; name: string; type: string }>;
    subSteps: Array<{
      id: string;
      description: string;
      toolsSystem: string;
      aiApproach: ("prompt" | "rag" | "agentic" | "none")[];
      timeSavings: number;
      humanInvolvement: "full" | "partial" | "review";
      roleDescription: string;
    }>;
    outputs: Array<{ id: string; name: string }>;
  };
  enhancementPlan: {
    plan: string;
    constraints: string;
    focusQuickWins: boolean;
  };
  businessCase: {
    summary: string;
    businessNeed: string;
    currentProcess: string;
    proposedSolution: string;
    timeSaved: string;
    costReduction: string;
    qualityImprovements: string;
    strategicValue: string;
    securityConsiderations: string;
    implementationSupport: string;
    timelineNeeds: string;
    workflowContext: string;
    implementation: {
      phase1: string;
      phase2: string;
      phase3: string;
    };
  };
}

const initialWizardData: WorkflowWizardData = {
  currentWorkflow: {
    name: "",
    description: "",
    frequency: {
      number: 1,
      period: 'month',
    },
    steps: [],
    painPoints: "",
  },
  painPointAnalysis: {
    selectedStep: "",
    painDetails: "",
    timeWasted: {
      value: 1,
      unit: 'hours',
    },
    frequency: {
      value: 1,
      unit: 'monthly',
    },
    aiApproach: "",
    stepPainTypes: {},
  },
  stepBreakdown: {
    inputs: [],
    subSteps: [],
    outputs: [],
  },
  enhancementPlan: {
    plan: "",
    constraints: "",
    focusQuickWins: false,
  },
  businessCase: {
    summary: "",
    businessNeed: "",
    currentProcess: "",
    proposedSolution: "",
    timeSaved: "",
    costReduction: "",
    qualityImprovements: "",
    strategicValue: "",
    securityConsiderations: "",
    implementationSupport: "",
    timelineNeeds: "",
    workflowContext: "",
    implementation: {
      phase1: "",
      phase2: "",
      phase3: "",
    },
  },
};

export function WorkflowRedesignWizard({ lessonId = "4", subLessonId = "1" }: WorkflowRedesignWizardProps) {
  const [activeTab, setActiveTab] = useState("step1");
  const [wizardData, setWizardData] = useState<WorkflowWizardData>(initialWizardData);
  const [stepCompletion, setStepCompletion] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
  });

  const courseProgressContext = useCourseProgress();
  const [, setLocation] = useLocation();
  const localStorageKey = `workflowRedesign_${lessonId}_${subLessonId}`;

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(localStorageKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const loadedData = parsed.wizardData || initialWizardData;
        
        // Ensure stepPainTypes exists for backward compatibility
        if (loadedData.painPointAnalysis && !loadedData.painPointAnalysis.stepPainTypes) {
          loadedData.painPointAnalysis.stepPainTypes = {};
        }
        
        // Migrate old string-based timeWasted and frequency to new object structure
        if (loadedData.painPointAnalysis) {
          if (typeof loadedData.painPointAnalysis.timeWasted === 'string') {
            loadedData.painPointAnalysis.timeWasted = {
              value: 1,
              unit: 'hours',
            };
          }
          if (typeof loadedData.painPointAnalysis.frequency === 'string') {
            loadedData.painPointAnalysis.frequency = {
              value: 1,
              unit: 'monthly',
            };
          }
        }
        
        setWizardData(loadedData);
        setStepCompletion(parsed.stepCompletion || {
          step1: false,
          step2: false,
          step3: false,
          step4: false,
          step5: false,
        });
      } catch (error) {
        console.error("Error loading saved wizard data:", error);
      }
    }
  }, [localStorageKey]);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({ wizardData, stepCompletion })
    );
  }, [wizardData, stepCompletion, localStorageKey]);

  const updateStepData = (step: keyof WorkflowWizardData, data: any) => {
    setWizardData((prev) => ({
      ...prev,
      [step]: data,
    }));
  };

  const markStepComplete = (step: keyof typeof stepCompletion) => {
    setStepCompletion((prev) => ({
      ...prev,
      [step]: true,
    }));
    
    // Update course progress if all steps are complete
    if (step === "step5" && courseProgressContext) {
      courseProgressContext.updateExerciseAnswer(parseInt(lessonId), subLessonId, "exercise-22", "completed");
    }
  };

  const isStepAccessible = (step: string): boolean => {
    const stepOrder = ["step1", "step2", "step3", "step4", "step5"];
    const currentIndex = stepOrder.indexOf(step);
    
    if (currentIndex === 0) return true;
    
    const previousStep = stepOrder[currentIndex - 1] as keyof typeof stepCompletion;
    return stepCompletion[previousStep];
  };

  const tabTriggers = [
    { id: "step1", label: "1. Current Workflow", icon: stepCompletion.step1 ? CheckCircle2 : Circle },
    { id: "step2", label: "2. Pain Point Analysis", icon: stepCompletion.step2 ? CheckCircle2 : Circle },
    { id: "step3", label: "3. Step Breakdown", icon: stepCompletion.step3 ? CheckCircle2 : Circle },
    { id: "step4", label: "4. Enhancement Plan", icon: stepCompletion.step4 ? CheckCircle2 : Circle },
    { id: "step5", label: "5. Business Case", icon: stepCompletion.step5 ? CheckCircle2 : Circle },
  ];

  const handleBackToLesson = () => {
    setLocation(`/lesson/${lessonId}/${subLessonId}`);
  };

  return (
    <>
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToLesson}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lesson
        </Button>
      </div>
      
      <Card className="w-full max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle>AI Workflow Enhancement Tool</CardTitle>
          <CardDescription>
            Transform your workflow with AI integration. Follow these steps to identify opportunities and create an implementation plan.
          </CardDescription>
        </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {tabTriggers.map((trigger) => {
              const Icon = trigger.icon;
              const isAccessible = isStepAccessible(trigger.id);
              const isCompleted = stepCompletion[trigger.id as keyof typeof stepCompletion];
              return (
                <TabsTrigger
                  key={trigger.id}
                  value={trigger.id}
                  disabled={!isAccessible}
                  className={`flex items-center gap-2 text-xs ${
                    isCompleted 
                      ? 'data-[state=active]:bg-green-100 data-[state=active]:text-green-800 data-[state=inactive]:bg-green-50 data-[state=inactive]:text-green-700 data-[state=inactive]:border-green-200' 
                      : ''
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isCompleted ? 'text-green-600' : ''}`} />
                  <span className="hidden md:inline">{trigger.label}</span>
                  <span className="md:hidden">{trigger.label.split(". ")[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="step1">
            <WorkflowMappingStep
              data={wizardData.currentWorkflow}
              onUpdate={(data) => updateStepData("currentWorkflow", data)}
              onComplete={() => {
                markStepComplete("step1");
                setActiveTab("step2");
              }}
            />
          </TabsContent>

          <TabsContent value="step2">
            <PainPointStep
              workflowSteps={wizardData.currentWorkflow.steps}
              data={wizardData.painPointAnalysis}
              onUpdate={(data) => updateStepData("painPointAnalysis", data)}
              onComplete={() => {
                markStepComplete("step2");
                setActiveTab("step3");
              }}
              onBack={() => setActiveTab("step1")}
            />
          </TabsContent>

          <TabsContent value="step3">
            <StepBreakdownStep
              selectedStep={wizardData.currentWorkflow.steps.find(
                (s) => s.id === wizardData.painPointAnalysis.selectedStep
              )}
              data={wizardData.stepBreakdown}
              onUpdate={(data) => updateStepData("stepBreakdown", data)}
              onComplete={() => {
                markStepComplete("step3");
                setActiveTab("step4");
              }}
              onBack={() => setActiveTab("step2")}
            />
          </TabsContent>

          <TabsContent value="step4">
            <EnhancementPlanStep
              wizardData={wizardData}
              data={wizardData.enhancementPlan}
              onUpdate={(data) => updateStepData("enhancementPlan", data)}
              onComplete={() => {
                markStepComplete("step4");
                setActiveTab("step5");
              }}
              onBack={() => setActiveTab("step3")}
            />
          </TabsContent>

          <TabsContent value="step5">
            <BusinessCaseStep
              wizardData={wizardData}
              data={wizardData.businessCase}
              onUpdate={(data) => updateStepData("businessCase", data)}
              onComplete={() => markStepComplete("step5")}
              onBack={() => setActiveTab("step4")}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    </>
  );
}