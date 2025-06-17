import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WorkflowEnhancerPage() {
  const handleOpenTool = () => {
    window.open("https://ai-workflow-enhancer.replit.app/", "_blank");
  };

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

            <Button
              onClick={handleOpenTool}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Tool
            </Button>
          </div>

          <div className="mt-4">
            <h1 className="text-2xl font-bold text-foreground">
              AI Workflow Enhancer
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Interactive workflow redesign tool - Enhance your processes with
              AI
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-semibold text-foreground">
              AI Workflow Enhancement Tool
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Use this interactive tool to analyze and enhance your workflows
              with AI integration points.
            </p>
          </div>

          <div className="relative p-12 text-center">
            <div className="max-w-lg mx-auto">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <ExternalLink className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  AI Workflow Enhancer
                </h3>
                <p className="text-muted-foreground mb-6">
                  Interactive tool for analyzing and enhancing your workflows
                  with AI integration points.
                </p>
              </div>

              <Button
                onClick={handleOpenTool}
                size="lg"
                className="flex items-center gap-3 mx-auto px-8 py-3 text-lg"
              >
                <ExternalLink className="h-5 w-5" />
                Launch Workflow Tool
              </Button>

              <p className="text-sm text-muted-foreground mt-4">
                Opens in a new tab for the best experience
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Exercise Instructions
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>
              1. Use the tool above to input your workflow from the sandwich
              exercise
            </p>
            <p>2. Identify potential AI integration points in your process</p>
            <p>3. Explore enhancement suggestions provided by the tool</p>
            <p>4. Document your insights for discussion with your table</p>
          </div>
        </div>
      </div>
    </div>
  );
}
