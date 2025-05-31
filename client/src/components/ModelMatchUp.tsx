import { useState, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UseCase {
  id: string;
  title: string;
  helpTip: string;
  selectedTags: string[];
  input: string;
  output: string;
}

const USE_CASES_DATA = [
  {
    id: "netflix",
    title: "Netflix Recommendations",
    helpTip: "Think about how past behavior influences future suggestions. This is a classic pattern-learning use case (ML) where the more you interact, the more the model adapts."
  },
  {
    id: "facial",
    title: "Facial Recognition",
    helpTip: "Deep Learning thrives on image data. This system learns to match patterns in facial features from large datasets of labeled images."
  },
  {
    id: "chatgpt",
    title: "ChatGPT / LLMs",
    helpTip: "LLMs use embeddings, transformers, and self-attention to generate text. This is deep learning—multiple layers interpreting complex language patterns."
  },
  {
    id: "translate",
    title: "Google Translate",
    helpTip: "This uses ML and DL under the hood, especially for context-aware translations. Think about the sequence of tokens and meaning representations."
  },
  {
    id: "autonomous",
    title: "Autonomous Vehicles",
    helpTip: "This is deep learning in action: it takes in real-time sensor inputs and outputs decisions like steering or braking. Pattern recognition at speed."
  },
  {
    id: "fraud",
    title: "Fraud Detection in Banking",
    helpTip: "Machine Learning systems here learn from millions of transactions to spot abnormal behavior. You may not need images—just lots of labeled behavior data."
  },
  {
    id: "aiart",
    title: "AI Art Generation (e.g., DALL·E)",
    helpTip: "This is generative DL. A text input leads to a totally new image output, combining vision and language models."
  },
  {
    id: "voice",
    title: "Smart Home Voice Assistant",
    helpTip: "This blends ML for intent recognition and sometimes DL for speech processing. It uses your voice as input, actions or answers as output."
  },
  {
    id: "medical",
    title: "Medical Imaging Diagnostics",
    helpTip: "A prime DL use case—models learn from thousands of X-rays or scans to predict diagnoses. High-volume, high-accuracy image classification."
  },
  {
    id: "captioning",
    title: "Real-Time Language Captioning",
    helpTip: "DL models process audio inputs and convert them into text in real time. Consider the data type (sound) and required speed."
  }
];

const TAGS = ["AI", "ML", "DL"];

export default function ModelMatchUp() {
  const [useCases, setUseCases] = useState<UseCase[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("modelMatchUpData");
    if (saved) {
      setUseCases(JSON.parse(saved));
    } else {
      // Initialize with empty data
      setUseCases(USE_CASES_DATA.map(uc => ({
        ...uc,
        selectedTags: [],
        input: "",
        output: ""
      })));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (useCases.length > 0) {
      localStorage.setItem("modelMatchUpData", JSON.stringify(useCases));
    }
  }, [useCases]);

  const updateUseCase = (id: string, updates: Partial<UseCase>) => {
    setUseCases(prev => prev.map(uc => 
      uc.id === id ? { ...uc, ...updates } : uc
    ));
  };

  const toggleTag = (useCaseId: string, tag: string) => {
    const useCase = useCases.find(uc => uc.id === useCaseId);
    if (!useCase) return;

    const newTags = useCase.selectedTags.includes(tag)
      ? useCase.selectedTags.filter(t => t !== tag)
      : [...useCase.selectedTags, tag];

    updateUseCase(useCaseId, { selectedTags: newTags });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Exercise 5: Model Match-Up
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Sort real-world use cases into AI/ML/DL categories and define their inputs/outputs.
        </p>
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Instructions:</strong> For each use case, select one or more categories (AI, ML, DL), 
            then describe what kind of input the system uses and what output it produces. 
            Click the help icon for hints about each use case.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {useCases.map((useCase) => (
          <Card key={useCase.id} className="relative h-full">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg pr-8">{useCase.title}</CardTitle>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-4 right-4 h-6 w-6 p-0 rounded-full bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
                    >
                      <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm">{useCase.helpTip}</p>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Tag Selection */}
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Category (select all that apply):
                </Label>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={useCase.selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/80"
                      onClick={() => toggleTag(useCase.id, tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Input Field */}
              <div>
                <Label htmlFor={`${useCase.id}-input`} className="text-sm font-medium">
                  What kind of input does this use?
                </Label>
                <Input
                  id={`${useCase.id}-input`}
                  value={useCase.input}
                  onChange={(e) => updateUseCase(useCase.id, { input: e.target.value })}
                  placeholder="e.g., user data, images, past behaviors"
                  className="mt-1"
                />
              </div>

              {/* Output Field */}
              <div>
                <Label htmlFor={`${useCase.id}-output`} className="text-sm font-medium">
                  What kind of output does this produce?
                </Label>
                <Input
                  id={`${useCase.id}-output`}
                  value={useCase.output}
                  onChange={(e) => updateUseCase(useCase.id, { output: e.target.value })}
                  placeholder="e.g., suggestions, alerts, actions"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-sm text-muted-foreground">
          💾 Your progress is automatically saved. You can return to this exercise anytime to continue working.
        </p>
      </div>
    </div>
  );
}