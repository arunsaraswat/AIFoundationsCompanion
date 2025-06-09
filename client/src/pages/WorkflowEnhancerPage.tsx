import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkflowEnhancerPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <a href="/lesson/4">
                  <ArrowLeft className="mr-2" size={16} />
                  Back to Lesson
                </a>
              </Button>
            </div>
          </div>
          
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-foreground">
              Exercise 22: AI Workflow Enhancer
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Interactive workflow redesign tool - Enhance your processes with AI
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-semibold text-foreground">AI Workflow Enhancement Tool</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Use this interactive tool to analyze and enhance your workflows with AI integration points.
            </p>
          </div>
          
          <div className="relative">
            <iframe
              src="https://ai-workflow-enhancer.replit.app/"
              className="w-full h-[800px] border-0"
              title="AI Workflow Enhancer Tool"
              allow="fullscreen"
              loading="lazy"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Exercise Instructions
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>1. Use the tool above to input your workflow from the sandwich exercise</p>
            <p>2. Identify potential AI integration points in your process</p>
            <p>3. Explore enhancement suggestions provided by the tool</p>
            <p>4. Document your insights for discussion with your table</p>
          </div>
        </div>
      </div>
    </div>
  );
}