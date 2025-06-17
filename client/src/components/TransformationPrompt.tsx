import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TransformationPromptProps {
  lessonId: number;
  subLessonId: string;
  exerciseId: string;
  stepId: string;
}

export default function TransformationPrompt({ lessonId, subLessonId, exerciseId, stepId }: TransformationPromptProps) {
  const [realProblem, setRealProblem] = useState("");
  const [currentProcess, setCurrentProcess] = useState("");
  const [gptResponse, setGptResponse] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generatePrompt = () => {
    if (!realProblem.trim() || !currentProcess.trim()) {
      return "";
    }

    return `I need to solve this business problem: ${realProblem}. Currently we solve it by ${currentProcess}, but what if I ignored all constraints? Assume I have AI that can understand context, communicate, analyze patterns, and coordinate systems. Give me 3 completely different approaches that might make the current process unnecessary.`;
  };

  const copyToClipboard = async () => {
    const prompt = generatePrompt();
    if (!prompt) {
      toast({
        title: "Missing Information",
        description: "Please fill in both the real problem and current process first.",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard. You can now paste it into ChatGPT.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please select and copy the text manually.",
        variant: "destructive",
      });
    }
  };

  const prompt = generatePrompt();

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">What's Your Pattern?</CardTitle>
          <p className="text-sm text-muted-foreground">
            Step 2: Transformation Prompt (5 min) - Fill in your details to generate a custom prompt for ChatGPT
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="real-problem">Your Real Problem</Label>
            <Input
              id="real-problem"
              value={realProblem}
              onChange={(e) => setRealProblem(e.target.value)}
              placeholder="e.g., Spending visibility and compliance"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current-process">Current Process</Label>
            <Textarea
              id="current-process"
              value={currentProcess}
              onChange={(e) => setCurrentProcess(e.target.value)}
              placeholder="e.g., Manual expense reporting with receipts, approval workflows, and monthly reconciliation"
              className="min-h-[100px]"
              rows={4}
            />
          </div>

          {prompt && (
            <div className="space-y-2">
              <Label>Generated Prompt</Label>
              <div className="relative">
                <Textarea
                  value={prompt}
                  readOnly
                  className="min-h-[120px] pr-12"
                  rows={5}
                />
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Copy this prompt and paste it into ChatGPT to get your 3 alternative approaches.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="gpt-response">ChatGPT Response</Label>
            <Textarea
              id="gpt-response"
              value={gptResponse}
              onChange={(e) => setGptResponse(e.target.value)}
              placeholder="Paste the response you received from ChatGPT here..."
              className="min-h-[150px]"
              rows={6}
            />
            <p className="text-sm text-muted-foreground">
              After getting your response from ChatGPT, paste it here to complete the exercise.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}