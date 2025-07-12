import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourseProgress, type Exercise } from "../contexts/CourseProgressContext";
import { FileText, ExternalLink, Download } from "lucide-react";

import TokenPrediction from "./TokenPrediction";
import PromptAnatomy from "./PromptAnatomy";
import QuickDecisionPrompt from "./QuickDecisionPrompt";
import RisePrompt from "./RisePrompt";
import RagStep1 from "./RagStep1";
import RagStep2 from "./RagStep2";
import RagTestQuestions from "./RagTestQuestions";
import AgentDesignStep1 from "./AgentDesignStep1";
import AgentDesignStep2 from "./AgentDesignStep2";
import ModelComparison from "./ModelComparison";
import TransformationPrompt from "./TransformationPrompt";
import PDFLink from "./PDFLink";
import { WorkflowRedesignWizard } from "./WorkflowRedesignWizard";

interface ExerciseFormProps {
  exercise: Exercise;
  lessonId: number;
  subLessonId: string;
}

export default function ExerciseForm({ exercise, lessonId, subLessonId }: ExerciseFormProps) {
  const { updateExerciseAnswer, updateFollowUpAnswer, updateStepAnswer } = useCourseProgress();

  const generatePlanHTML = (exercise: Exercise) => {
    if (!exercise.steps) return '';
    
    const isThirtyDayPlan = exercise.label === "30 Day Plan";
    const isSixtyDayPlan = exercise.label === "60 Day Plan";
    const isNinetyDayPlan = exercise.label === "90 Day Plan";
    const planTitle = isThirtyDayPlan ? "30 Day AI Foundation Plan" : 
                     isSixtyDayPlan ? "60 Day AI Influence Plan" : 
                     "90 Day Organizational Impact Plan";
    const planSubtitle = isThirtyDayPlan ? "Your personalized roadmap to AI mastery" : 
                        isSixtyDayPlan ? "Grow your influence and expand AI adoption" :
                        "Impact the organization and demonstrate business value";

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${planTitle}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.3;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px 15px;
            background-color: #fafafa;
            color: #333;
            font-size: 13px;
          }
          .header {
            text-align: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #2563eb;
          }
          .header h1 {
            color: #1e40af;
            font-size: 1.8em;
            margin: 0;
            font-weight: 700;
          }
          .header p {
            color: #6b7280;
            font-size: 0.9em;
            margin: 5px 0 0 0;
          }
          .section-row {
            margin-bottom: 25px;
          }
          .row-title {
            color: #1e40af;
            font-size: 1.1em;
            font-weight: 700;
            margin: 0 0 12px 0;
            padding: 8px 0;
            border-bottom: 2px solid #e5e7eb;
          }
          .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr 1fr;
            gap: 12px;
            margin-bottom: 15px;
          }
          .section {
            background: white;
            padding: 12px;
            border-radius: 6px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            border-left: 3px solid #2563eb;
            break-inside: avoid;
            margin-bottom: 15px;
          }
          .section-title {
            color: #1e40af;
            font-size: 0.95em;
            font-weight: 600;
            margin: 0 0 8px 0;
            display: flex;
            align-items: center;
            line-height: 1.2;
          }
          .success-badge {
            background: #10b981;
            color: white;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 0.6em;
            margin-right: 6px;
            font-weight: 500;
            flex-shrink: 0;
          }
          .question {
            color: #4b5563;
            font-size: 0.8em;
            margin: 4px 0;
            font-weight: 500;
            line-height: 1.2;
          }
          .answer {
            background: #f8fafc;
            padding: 8px;
            border-radius: 4px;
            margin: 6px 0 0 0;
            border-left: 2px solid #e5e7eb;
            color: #1f2937;
            font-size: 0.85em;
            word-wrap: break-word;
            line-height: 1.3;
          }
          .empty-answer {
            color: #9ca3af;
            font-style: italic;
          }
          .date-answer {
            color: #7c3aed;
            font-weight: 500;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 0.8em;
            grid-column: 1 / -1;
          }
          @media print {
            body { 
              background-color: white;
              font-size: 11px;
              padding: 10px;
            }
            .section { 
              box-shadow: none; 
              border: 1px solid #e5e7eb;
              padding: 8px;
              margin-bottom: 10px;
            }
            .content-grid {
              gap: 10px;
            }
          }
          @media (max-width: 1100px) {
            .content-grid {
              grid-template-columns: 1fr 1fr 1fr;
            }
          }
          @media (max-width: 800px) {
            .content-grid {
              grid-template-columns: 1fr 1fr;
            }
          }
          @media (max-width: 500px) {
            .content-grid {
              grid-template-columns: 1fr;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🚀 ${planTitle}</h1>
          <p>${planSubtitle}</p>
        </div>
        
        ${(() => {
          let sections = [];
          
          if (isThirtyDayPlan) {
            const examSteps = exercise.steps.filter(step => 
              step.label?.includes('Target Score') || 
              step.label?.includes('Exam Date') || 
              step.label?.includes('Potential Blocker') || 
              step.label?.includes('My Workaround')
            );
            
            const successFactor1Steps = exercise.steps.filter(step => 
              step.label?.includes('Success Factor 1') || 
              step.label?.includes('My Action for Success Factor 1') || 
              step.label?.includes('By When (Success Factor 1)')
            );
            
            const successFactor2Steps = exercise.steps.filter(step => 
              step.label?.includes('Success Factor 2') || 
              step.label?.includes('My Action for Success Factor 2') || 
              step.label?.includes('By When (Success Factor 2)')
            );
            
            const workflow1Steps = exercise.steps.filter(step => 
              step.label?.includes('Workflow #1') || 
              step.label?.includes('Pain Points (Workflow #1)') || 
              step.label?.includes('Potential AI Solution (Workflow #1)')
            );
            
            const workflow2Steps = exercise.steps.filter(step => 
              step.label?.includes('Workflow #2') || 
              step.label?.includes('Friction Points (Workflow #2)') || 
              step.label?.includes('Potential AI Solution (Workflow #2)')
            );
            
            sections = [
              { steps: examSteps, title: '📝 Exam Preparation' },
              { steps: successFactor1Steps, title: '🎯 Success Factor 1' },
              { steps: successFactor2Steps, title: '🎯 Success Factor 2' },
              { steps: workflow1Steps, title: '⚙️ Workflow 1' },
              { steps: workflow2Steps, title: '⚙️ Workflow 2' }
            ];
          } else if (isSixtyDayPlan) {
            const workflowSteps = exercise.steps.filter(step => 
              step.label?.includes('Selected Workflow') || 
              step.label?.includes('Measurable Improvement Target') || 
              step.label?.includes('Quantitative Gain') || 
              step.label?.includes('Validation Partner') || 
              (step.label?.includes('Potential Blocker') && !step.label?.includes('EDGE')) || 
              (step.label?.includes('My Workaround') && !step.label?.includes('EDGE'))
            );
            
            const successFactor3Steps = exercise.steps.filter(step => 
              step.label?.includes('Success Factor 3') || 
              step.label?.includes('My Action for Success Factor 3') || 
              step.label?.includes('By When (Success Factor 3)')
            );
            
            const successFactor4Steps = exercise.steps.filter(step => 
              step.label?.includes('Success Factor 4') || 
              step.label?.includes('My Action for Success Factor 4') || 
              step.label?.includes('By When (Success Factor 4)')
            );
            
            const edgeSteps = exercise.steps.filter(step => 
              step.label?.includes('Meeting Date') || 
              step.label?.includes('Champion') || 
              step.label?.includes('Decision Maker') || 
              step.label?.includes('Skeptic') || 
              (step.label?.includes('Potential Blocker') && step.label?.includes('EDGE')) || 
              (step.label?.includes('My Workaround') && step.label?.includes('EDGE'))
            );
            
            sections = [
              { steps: workflowSteps, title: '⚙️ Workflow Redesign' },
              { steps: successFactor3Steps, title: '🎯 Success Factor 3' },
              { steps: successFactor4Steps, title: '🎯 Success Factor 4' },
              { steps: edgeSteps, title: '🎤 EDGE™ Pitch Planning' }
            ];
          } else if (isNinetyDayPlan) {
            const edgePitchSteps = exercise.steps.filter(step => 
              step.label?.includes('Presentation Date') || 
              step.label?.includes('Exponential') || 
              step.label?.includes('Disruptive') || 
              step.label?.includes('Generative') || 
              step.label?.includes('Emergent') || 
              step.label?.includes('Follow-up Tracker Update') || 
              step.label?.includes('Expected Reaction') || 
              step.label?.includes('Next Steps')
            );
            
            const successFactor5Steps = exercise.steps.filter(step => 
              step.label?.includes('Success Factor 5') || 
              step.label?.includes('My Action for Success Factor 5') || 
              step.label?.includes('By When (Success Factor 5)')
            );
            
            const successFactor6Steps = exercise.steps.filter(step => 
              step.label?.includes('Success Factor 6') || 
              step.label?.includes('My Action for Success Factor 6') || 
              step.label?.includes('By When (Success Factor 6)')
            );
            
            const successFactor7Steps = exercise.steps.filter(step => 
              step.label?.includes('Success Factor 7') || 
              step.label?.includes('My Action for Success Factor 7') || 
              step.label?.includes('By When (Success Factor 7)')
            );
            
            const businessImpactSteps = exercise.steps.filter(step => 
              step.label?.includes('Time Saved From') || 
              step.label?.includes('Time Saved To') || 
              step.label?.includes('Quality Gains') || 
              step.label?.includes('Cost Reduction') || 
              step.label?.includes('Report Format') || 
              step.label?.includes('Present To')
            );
            
            sections = [
              { steps: edgePitchSteps, title: '🎤 EDGE™ Pitch Delivery' },
              { steps: successFactor5Steps, title: '🎯 Success Factor 5' },
              { steps: successFactor6Steps, title: '🎯 Success Factor 6' },
              { steps: successFactor7Steps, title: '🎯 Success Factor 7' },
              { steps: businessImpactSteps, title: '📊 Business Impact Demonstration' }
            ];
          }
          
          const renderSteps = (steps, title) => `
            <div class="section-row">
              <h2 class="row-title">${title}</h2>
              <div class="content-grid">
                ${steps.map(step => {
                  const answer = step.answer || '';
                  const answerStr = Array.isArray(answer) ? answer.join(', ') : String(answer);
                  const hasAnswer = answerStr.trim() !== '';
                  const isDateField = step.type === 'date';
                  const hasSuccessBadge = step.label?.includes('✅');
                  
                  return `
                    <div class="section">
                      <div class="section-title">
                        ${hasSuccessBadge ? '<span class="success-badge">✅</span>' : ''}
                        ${step.label?.replace(/✅[^-]*-\s*/, '') || 'Untitled'}
                      </div>
                      ${step.description ? `<div class="question">${step.description}</div>` : ''}
                      <div class="answer ${!hasAnswer ? 'empty-answer' : ''} ${isDateField && hasAnswer ? 'date-answer' : ''}">
                        ${hasAnswer ? 
                          (isDateField ? 
                            new Date(answerStr).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }) : 
                            answerStr.replace(/\n/g, '<br>')
                          ) : 
                          'Not completed yet'
                        }
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          `;
          
          return sections.map(section => renderSteps(section.steps, section.title)).join('');
        })()}
        
        <div class="footer">
          <p>Generated on ${new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          })}</p>
        </div>
      </body>
      </html>
    `;

    return htmlContent;
  };

  const handleExportPlan = () => {
    const htmlContent = generatePlanHTML(exercise);
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    
    // Clean up the object URL after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const handleAnswerChange = (value: string | string[]) => {
    updateExerciseAnswer(lessonId, subLessonId, exercise.id, value);
  };

  const handleFollowUpAnswerChange = (value: string) => {
    updateFollowUpAnswer(lessonId, subLessonId, exercise.id, value);
  };

  const handleStepAnswerChange = (stepId: string, value: string) => {
    updateStepAnswer(lessonId, subLessonId, exercise.id, stepId, value);
  };

  const renderFormField = () => {
    switch (exercise.type) {
      case 'text':
        const textPlaceholder = exercise.id === 'discussion-5' 
          ? "Enter your response..."
          : "Enter your answer...";
        return (
          <Input
            value={exercise.answer as string || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder={textPlaceholder}
            className="mt-2"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            value={exercise.answer as string || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Enter your response..."
            className="mt-2 min-h-[100px]"
            rows={4}
          />
        );

      case 'date':
        return (
          <Input
            type="date"
            value={exercise.answer as string || ''}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="mt-2"
          />
        );

      case 'select':
        return (
          <Select value={exercise.answer as string || ''} onValueChange={(value) => handleAnswerChange(value)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {exercise.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'radio':
        return (
          <RadioGroup
            value={exercise.answer as string || ''}
            onValueChange={(value) => handleAnswerChange(value)}
            className="mt-2 space-y-3"
          >
            {exercise.options?.map((option, index) => (
              <div key={index} className="flex items-start space-x-2">
                <RadioGroupItem value={option} id={`${exercise.id}-${index}`} className="mt-1" />
                <Label 
                  htmlFor={`${exercise.id}-${index}`} 
                  className="text-sm leading-relaxed cursor-pointer flex-1"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        const handleCheckboxChange = (option: string, checked: boolean) => {
          const currentAnswers = Array.isArray(exercise.answer) ? exercise.answer : [];
          if (checked) {
            if (!currentAnswers.includes(option)) {
              handleAnswerChange([...currentAnswers, option]);
            }
          } else {
            handleAnswerChange(currentAnswers.filter(item => item !== option));
          }
        };

        return (
          <div className="mt-2 space-y-3">
            {exercise.options?.map((option, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Checkbox
                  id={`${exercise.id}-${index}`}
                  checked={Array.isArray(exercise.answer) && exercise.answer.includes(option)}
                  onCheckedChange={(checked) => handleCheckboxChange(option, !!checked)}
                  className="mt-1"
                />
                <Label 
                  htmlFor={`${exercise.id}-${index}`} 
                  className="text-sm leading-relaxed cursor-pointer flex-1"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'radio-with-text':
        return (
          <div className="mt-2 space-y-4">
            <RadioGroup
              value={exercise.answer as string || ''}
              onValueChange={(value) => handleAnswerChange(value)}
              className="space-y-3"
            >
              {exercise.options?.map((option, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <RadioGroupItem value={option} id={`${exercise.id}-${index}`} className="mt-1" />
                  <Label 
                    htmlFor={`${exercise.id}-${index}`} 
                    className="text-sm leading-relaxed cursor-pointer flex-1"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <Label className="text-sm font-medium text-foreground mb-2 block">
                {exercise.followUpLabel || "Follow-up:"}
              </Label>
              {exercise.followUpDescription && (
                <p 
                  className="text-xs text-muted-foreground mb-3"
                  dangerouslySetInnerHTML={{ __html: exercise.followUpDescription }}
                />
              )}
              <Textarea
                value={exercise.followUpAnswer || ''}
                onChange={(e) => handleFollowUpAnswerChange(e.target.value)}
                placeholder="Share your thoughts and examples..."
                className="min-h-[100px]"
                rows={4}
              />
            </div>
          </div>
        );

      case 'multi-step':
        return (
          <div className="mt-2 space-y-4">
            {exercise.steps?.map((step, index) => (
              <div key={step.id} className="border-l-4 border-blue-200 dark:border-blue-700 pl-4 py-2">
                <h4 className="font-medium text-sm text-foreground mb-2">{step.label}</h4>
                {step.description && (
                  <p 
                    className="text-xs text-muted-foreground mb-3 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: step.description }}
                  />
                )}
                {/* Special handling for Step 1 quick decision prompt */}
                {step.id === 'step-1' && exercise.id === 'exercise-11' ? (
                  <QuickDecisionPrompt 
                    lessonId={lessonId}
                    subLessonId={subLessonId}
                    exerciseId={exercise.id}
                    stepId={step.id}
                  />
                ) : /* Special handling for Step 2a anatomy component */
                step.id === 'step-2a' && exercise.id === 'exercise-11' ? (
                  <PromptAnatomy 
                    lessonId={lessonId}
                    subLessonId={subLessonId}
                    exerciseId={exercise.id}
                    stepId={step.id}
                  />
                ) : /* Special handling for Step 2b RISE prompt component */
                step.id === 'step-2b' && exercise.id === 'exercise-11' ? (
                  <RisePrompt 
                    lessonId={lessonId}
                    subLessonId={subLessonId}
                    exerciseId={exercise.id}
                    stepId={step.id}
                  />
                ) : /* Special handling for Step 3 model comparison */
                step.id === 'step-3' && exercise.id === 'exercise-11' ? (
                  <ModelComparison 
                    lessonId={lessonId}
                    subLessonId={subLessonId}
                    exerciseId={exercise.id}
                    stepId={step.id}
                  />
                ) : /* Special handling for Exercise 13 Step 1 RAG testing */
                step.id === 'step-1' && exercise.id === 'exercise-13' ? (
                  <RagStep1 
                    lessonId={lessonId}
                    subLessonId={subLessonId}
                    exerciseId={exercise.id}
                    stepId={step.id}
                  />
                ) : /* Special handling for Exercise 13 Step 2 RAG comparison */
                step.id === 'step-2' && exercise.id === 'exercise-13' ? (
                  <RagStep2 
                    lessonId={lessonId}
                    subLessonId={subLessonId}
                    exerciseId={exercise.id}
                    stepId={step.id}
                  />
                ) : /* Special handling for Exercise 13 Test Questions */
                step.id === 'test-questions' && exercise.id === 'exercise-13' ? (
                  <RagTestQuestions 
                    lessonId={lessonId}
                    subLessonId={subLessonId}
                    exerciseId={exercise.id}
                    stepId={step.id}
                  />
                ) : step.type === 'multi-step' ? (
                  <div className="ml-4 space-y-3">
                    {step.steps?.map((subStep) => (
                      <div key={subStep.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-3 py-1">
                        <Label className="text-xs font-medium text-foreground mb-1 block">{subStep.label}</Label>
                        {subStep.type === 'link' ? (
                          <div className="p-2 border border-primary/20 rounded bg-primary/5">
                            {subStep.link?.endsWith('.pdf') ? (
                              <PDFLink
                                href={subStep.link}
                                title={subStep.label}
                                variant="link"
                              />
                            ) : (
                              <a 
                                href={subStep.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-primary/90 transition-colors"
                              >
                                <FileText className="h-3 w-3" />
                                {subStep.label}
                              </a>
                            )}
                          </div>
                        ) : (
                          <Input
                            value={subStep.answer as string || ''}
                            onChange={(e) => handleStepAnswerChange(subStep.id, e.target.value)}
                            placeholder="Enter your answer..."
                            className="text-xs"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : step.type === 'link' ? (
                  <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
                    <PDFLink
                      href={step.link || ''}
                      title={step.label}
                      variant="button"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      {step.label}
                    </PDFLink>
                  </div>
                ) : step.type === 'textarea' ? (
                  <Textarea
                    value={step.answer as string || ''}
                    onChange={(e) => handleStepAnswerChange(step.id, e.target.value)}
                    placeholder="Enter your response..."
                    className="min-h-[80px]"
                    rows={3}
                  />
                ) : step.type === 'date' ? (
                  <Input
                    type="date"
                    value={step.answer as string || ''}
                    onChange={(e) => handleStepAnswerChange(step.id, e.target.value)}
                  />
                ) : step.type === 'radio' ? (
                  <RadioGroup
                    value={step.answer as string || ''}
                    onValueChange={(value) => handleStepAnswerChange(step.id, value)}
                    className="mt-2 space-y-2"
                  >
                    {step.options?.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`${step.id}-${option}`} />
                        <Label htmlFor={`${step.id}-${option}`} className="text-sm font-normal">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : step.type === 'select' ? (
                  <Select value={step.answer as string || ''} onValueChange={(value) => handleStepAnswerChange(step.id, value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select an option..." />
                    </SelectTrigger>
                    <SelectContent>
                      {step.options?.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    value={step.answer as string || ''}
                    onChange={(e) => handleStepAnswerChange(step.id, e.target.value)}
                    placeholder="Enter your answer..."
                  />
                )}
              </div>
            ))}
            
            {/* Add export button for all Day Plans */}
            {(exercise.label === "30 Day Plan" || exercise.label === "60 Day Plan" || exercise.label === "90 Day Plan") && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button 
                  onClick={handleExportPlan}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition-colors duration-200"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Export {exercise.label} (View & Print)
                </Button>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Opens a beautifully formatted view of your plan in a new tab
                </p>
              </div>
            )}
          </div>
        );
      
      case 'component':
        if (exercise.component === 'TokenPrediction') {
          return <TokenPrediction />;
        }
        if (exercise.component === 'TransformationPrompt') {
          return <TransformationPrompt 
            lessonId={lessonId} 
            subLessonId={subLessonId} 
            exerciseId={exercise.id} 
            stepId="" 
          />;
        }
        if (exercise.component === 'WorkflowRedesignWizard') {
          return <WorkflowRedesignWizard 
            lessonId={lessonId.toString()} 
            subLessonId={subLessonId} 
          />;
        }
        return null;

      case 'link':
        // Check if it's a PDF file or external URL
        const isPDF = exercise.link?.endsWith('.pdf');
        const isExternal = exercise.link?.startsWith('http');
        const isInternalExercise = exercise.link?.startsWith('/exercise/');
        
        // For internal exercise links, append lesson and sub-lesson context
        let linkHref = exercise.link;
        if (isInternalExercise && lessonId && subLessonId) {
          linkHref = `${exercise.link}/${lessonId}/${subLessonId}`;
        }
        
        return (
          <div className="p-4 border border-primary/20 rounded-lg bg-primary/5">
            {isPDF ? (
              <PDFLink
                href={linkHref || ''}
                title={exercise.label || 'Document'}
                variant="link"
              />
            ) : (
              <a 
                href={linkHref}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                {isExternal ? <ExternalLink className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                {isInternalExercise ? "Start Exercise" : exercise.label}
              </a>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // For component types, render without Card wrapper
  if (exercise.type === 'component') {
    return renderFormField();
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">{exercise.label}</CardTitle>
        {exercise.description && (
          <CardDescription 
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: exercise.description }}
          />
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {renderFormField()}
      </CardContent>
    </Card>
  );
}