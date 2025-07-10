import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AgentDesignStep1 from "@/components/AgentDesignStep1";
import AgentDesignStep2 from "@/components/AgentDesignStep2";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AgentDesignPageProps {
  lessonId?: number;
  subLessonId?: string;
}

export default function AgentDesignPage({ lessonId, subLessonId }: AgentDesignPageProps = {}) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with back button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => {
            // If we have lesson context, navigate back to specific sub-lesson
            if (lessonId && subLessonId) {
              window.location.href = `/lesson/${lessonId}/${subLessonId}`;
            } else if (lessonId) {
              window.location.href = `/lesson/${lessonId}`;
            } else {
              window.history.back();
            }
          }}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lesson
        </Button>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Exercise 15: Design Your Agent Assistant
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Multi-step activity: Build a Human + 1 Agent Workflow (16-18 min)
        </p>

        {/* Step Navigation */}
        <div className="flex gap-4 mb-8">
          <Card 
            className={`cursor-pointer transition-colors ${
              currentStep === 1 ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setCurrentStep(1)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Badge variant={currentStep === 1 ? "default" : "secondary"}>Step 1</Badge>
                <CardTitle className="text-base">Build Workflow</CardTitle>
              </div>
              <CardDescription className="text-sm">
                Design a human + AI agent workflow
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className={`cursor-pointer transition-colors ${
              currentStep === 2 ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setCurrentStep(2)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Badge variant={currentStep === 2 ? "default" : "secondary"}>Step 2</Badge>
                <CardTitle className="text-base">Scale to Multi-Agent</CardTitle>
              </div>
              <CardDescription className="text-sm">
                Explore multi-agent workflow scaling
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[600px]">
        {currentStep === 1 && (
          <AgentDesignStep1
            lessonId={lessonId || 2}
            subLessonId={subLessonId || "2.6"}
            exerciseId="exercise-15"
            stepId="step-1"
          />
        )}
        
        {currentStep === 2 && (
          <AgentDesignStep2
            lessonId={lessonId || 2}
            subLessonId={subLessonId || "2.6"}
            exerciseId="exercise-15"
            stepId="step-2"
          />
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(1)}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous Step
        </Button>
        
        <div className="text-sm text-muted-foreground">
          Step {currentStep} of 2
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(2)}
          disabled={currentStep === 2}
        >
          Next Step
          <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
        </Button>
      </div>
    </div>
  );
}