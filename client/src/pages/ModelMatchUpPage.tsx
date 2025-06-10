import { useState, useEffect } from "react";
import { HelpCircle, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
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
  dataRisks: string;
  dataAssumptions: string;
}

const USE_CASES_DATA = [
  {
    id: "netflix",
    title: "Netflix Recommendations",
    helpTip: "What patterns might a system look for if it's trying to predict what you'll enjoy next? What kind of behavior could be useful?"
  },
  {
    id: "facial",
    title: "Facial Recognition",
    helpTip: "Consider how a system might learn to tell people apart just by looking. What kind of data would it need—and what makes this task complex?"
  },
  {
    id: "chatgpt",
    title: "ChatGPT / LLMs",
    helpTip: "How might a machine know what word should come next in a sentence? What clues would it rely on from earlier in the conversation?"
  },
  {
    id: "translate",
    title: "Google Translate",
    helpTip: "If you're trying to go from one language to another, what challenges come up in keeping meaning, tone, and grammar aligned?"
  },
  {
    id: "autonomous",
    title: "Autonomous Vehicles",
    helpTip: "What kinds of decisions need to happen in real time to drive safely? Think about how fast things change on the road—and what's required to keep up."
  },
  {
    id: "fraud",
    title: "Fraud Detection in Banking",
    helpTip: "What signs might tip off a system that something is suspicious? How could past examples help it know when something looks 'off'?"
  },
  {
    id: "aiart",
    title: "AI Art Generation (e.g., DALL·E)",
    helpTip: "Imagine describing a scene and having a picture appear. What do you think the system has to understand about both words and visuals to do that?"
  },
  {
    id: "voice",
    title: "Smart Home Voice Assistant",
    helpTip: "If you're talking to a system, what has to happen before it can act? Think about the path from sound to understanding to response."
  },
  {
    id: "medical",
    title: "Medical Imaging Diagnostics",
    helpTip: "If you're reviewing an X-ray or scan, what patterns are you looking for—and how might a machine learn to recognize them?"
  },
  {
    id: "captioning",
    title: "Real-Time Language Captioning",
    helpTip: "How could a system turn live speech into accurate written words fast enough to keep up? What makes this challenging?"
  }
];

const TAGS = ["AI", "ML", "DL", "Gen AI"];

export default function ModelMatchUpPage() {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [task1Complete, setTask1Complete] = useState(true);
  const [task2Complete, setTask2Complete] = useState(false);
  const [task3Complete, setTask3Complete] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("modelMatchUpData");
    const savedTask2State = localStorage.getItem("modelMatchUpTask2");
    const savedTask3State = localStorage.getItem("modelMatchUpTask3");
    
    if (saved) {
      try {
        setUseCases(JSON.parse(saved));
      } catch {
        // If parsing fails, initialize with fresh data
        initializeFreshData();
      }
    } else {
      initializeFreshData();
    }

    if (savedTask2State) {
      setTask2Complete(JSON.parse(savedTask2State));
    }

    if (savedTask3State) {
      setTask3Complete(JSON.parse(savedTask3State));
    }
  }, []);

  const initializeFreshData = () => {
    setUseCases(USE_CASES_DATA.map(uc => ({
      ...uc,
      selectedTags: [],
      input: "",
      output: "",
      dataRisks: "",
      dataAssumptions: ""
    })));
  };

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (useCases.length > 0) {
      localStorage.setItem("modelMatchUpData", JSON.stringify(useCases));
    }
  }, [useCases]);

  // Save task 2 state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("modelMatchUpTask2", JSON.stringify(task2Complete));
  }, [task2Complete]);

  // Save task 3 state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("modelMatchUpTask3", JSON.stringify(task3Complete));
  }, [task3Complete]);

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
      {/* Header with back button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lesson
        </Button>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Model Match-Up
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Sort real-world use cases into AI/ML/DL/Gen AI categories and define their inputs/outputs.
        </p>
      </div>

      {/* Task Progress */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Checkbox 
              checked={task1Complete} 
              disabled={true}
              className="flex-shrink-0"
            />
            <div>
              <h3 className="font-medium text-foreground">Task 1: Category Classification</h3>
              <p className="text-sm text-muted-foreground">Sort each use case into AI, ML, DL, or Gen AI categories</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox 
              checked={task2Complete}
              onCheckedChange={(checked) => setTask2Complete(checked as boolean)}
              className="flex-shrink-0"
            />
            <div>
              <h3 className="font-medium text-foreground">Task 2: Input/Output Analysis</h3>
              <p className="text-sm text-muted-foreground">Define what kind of inputs and outputs each system uses</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox 
              checked={task3Complete}
              onCheckedChange={(checked) => setTask3Complete(checked as boolean)}
              className="flex-shrink-0"
            />
            <div>
              <h3 className="font-medium text-foreground">Task 3: Bad Data Risk Assessment</h3>
              <p className="text-sm text-muted-foreground">Mark any 'bad data' risk points and assess data quality concerns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="absolute top-4 right-4 h-6 w-6 p-0 rounded-full bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-800/30"
                    >
                      <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-900 dark:text-amber-100">{useCase.helpTip}</p>
                  </PopoverContent>
                </Popover>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Tag Selection - Always visible */}
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

              {/* Input/Output Fields - Only visible when Task 2 is selected */}
              {task2Complete && (
                <>
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
                </>
              )}

              {/* Task 3: Bad Data Risk Assessment */}
              {task3Complete && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`${useCase.id}-risks`} className="text-sm font-medium">
                        What 'bad data' risks do you see here?
                      </Label>
                      <Input
                        id={`${useCase.id}-risks`}
                        value={useCase.dataRisks}
                        onChange={(e) => updateUseCase(useCase.id, { dataRisks: e.target.value })}
                        placeholder="e.g., skewed inputs, noisy training data, missing labels"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${useCase.id}-assumptions`} className="text-sm font-medium">
                        What assumptions is this model making?
                      </Label>
                      <Input
                        id={`${useCase.id}-assumptions`}
                        value={useCase.dataAssumptions}
                        onChange={(e) => updateUseCase(useCase.id, { dataAssumptions: e.target.value })}
                        placeholder="e.g., about the user, context, or data quality"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </>
              )}
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