import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function WorkflowEnhancerPage() {
  const [iframeKey, setIframeKey] = useState(0);

  const handleReload = () => {
    setIframeKey(prev => prev + 1);
  };

  const getIframeSrc = () => {
    return `https://ai-workflow-enhancer.replit.app/?t=${iframeKey}`;
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
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RotateCcw className="mr-2" size={16} />
                  Reload Tool
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reload Workflow Tool?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reload the workflow enhancement tool and reset it to its original state. 
                    All current progress and data in the tool will be lost and cannot be recovered.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReload} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Reload Tool
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
              key={iframeKey}
              src={getIframeSrc()}
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