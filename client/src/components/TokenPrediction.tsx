import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TokenPredictionState {
  userTokens: string[];
  currentSentence: string;
  currentToken: string;
  isComplete: boolean;
  targetTokens: number;
  aiCompletion: string;
  isLoadingAI: boolean;
}

const STARTER_PROMPT = "The CEO stormed in... The meeting was";
const MODEL_COMPLETION = "The CEO stormed in... The meeting was tense and everyone could feel the urgency in the air.";
const MAX_TOKENS = 8;

export default function TokenPrediction() {
  const [state, setState] = useState<TokenPredictionState>(() => {
    const saved = localStorage.getItem("tokenPredictionState");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall back to initial state
      }
    }
    return {
      userTokens: [],
      currentSentence: STARTER_PROMPT,
      currentToken: "",
      isComplete: false,
      targetTokens: MAX_TOKENS,
      aiCompletion: "",
      isLoadingAI: false
    };
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("tokenPredictionState", JSON.stringify(state));
  }, [state]);

  const handleSubmitToken = () => {
    if (!state.currentToken.trim()) return;

    const newTokens = [...state.userTokens, state.currentToken.trim()];
    const newSentence = state.currentSentence + " " + state.currentToken.trim();
    const isComplete = newTokens.length >= state.targetTokens;

    setState({
      ...state,
      userTokens: newTokens,
      currentSentence: newSentence,
      currentToken: "",
      isComplete
    });
  };

  const handleReset = () => {
    setState({
      userTokens: [],
      currentSentence: STARTER_PROMPT,
      currentToken: "",
      isComplete: false,
      targetTokens: MAX_TOKENS,
      aiCompletion: "",
      isLoadingAI: false
    });
  };

  const fetchAICompletion = async () => {
    setState(prev => ({ ...prev, isLoadingAI: true }));
    
    try {
      const response = await fetch('/api/openrouter-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: "Finish the sentence with 6-8 tokens - The CEO stormed in... The meeting was "
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI completion');
      }

      const data = await response.json();
      setState(prev => ({ 
        ...prev, 
        aiCompletion: data.completion,
        isLoadingAI: false 
      }));
    } catch (error) {
      console.error('Error fetching AI completion:', error);
      setState(prev => ({ 
        ...prev, 
        aiCompletion: "Error: Could not get AI response",
        isLoadingAI: false 
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitToken();
    }
  };

  return (
    <div className="space-y-4">
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Exercise 9: Be the Model – Token-by-Token Prediction</CardTitle>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Experience how language models predict text one token at a time. 
            Continue the sentence by predicting what word comes next.
          </p>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
          {/* Current Sentence Display - Terminal Style */}
          <div className="bg-black p-6 rounded-lg border-2 border-green-500/30 font-mono">
            <Label className="text-xs font-medium text-green-400 uppercase tracking-wider">Current Sentence:</Label>
            <p className="text-green-400 mt-3 leading-relaxed text-lg">
              {state.currentSentence}
              {!state.isComplete && <span className="animate-pulse text-green-400 ml-1">{'>>'}</span>}
            </p>
          </div>

          {/* Token Input */}
          {!state.isComplete && (
            <div className="space-y-3">
              <Label htmlFor="token-input" className="text-sm font-medium">
                Predict the next word (Token {state.userTokens.length + 1} of {state.targetTokens}):
              </Label>
              <div className="flex gap-3">
                <Input
                  id="token-input"
                  value={state.currentToken}
                  onChange={(e) => setState({ ...state, currentToken: e.target.value })}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your prediction..."
                  className="flex-1"
                  autoFocus
                />
                <Button 
                  onClick={handleSubmitToken}
                  disabled={!state.currentToken.trim()}
                >
                  Submit Token
                </Button>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Progress:</span>
            {Array.from({ length: state.targetTokens }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < state.userTokens.length 
                    ? 'bg-blue-500' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* Completion and Comparison */}
          {state.isComplete && (
            <div className="space-y-4">
              <Separator />
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Sentence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed">{state.currentSentence}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Model's Sentence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {!state.aiCompletion && !state.isLoadingAI && (
                        <Button 
                          onClick={fetchAICompletion}
                          variant="outline"
                          className="w-full"
                        >
                          Get AI Completion
                        </Button>
                      )}
                      {state.isLoadingAI && (
                        <div className="flex items-center justify-center p-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                          <span className="ml-2 text-muted-foreground">Getting AI response...</span>
                        </div>
                      )}
                      {state.aiCompletion && (
                        <p className="leading-relaxed">{state.aiCompletion}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center">
                <Button onClick={handleReset} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Token History */}
          {state.userTokens.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Your Tokens:</Label>
              <div className="flex flex-wrap gap-2">
                {state.userTokens.map((token, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm"
                  >
                    {index + 1}: {token}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        💾 Your progress is automatically saved and will persist between sessions.
      </div>
    </div>
  );
}