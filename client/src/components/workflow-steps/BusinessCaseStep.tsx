import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Copy, Mail, CheckCircle2, Clock, DollarSign, TrendingUp, Shield, Users, Calendar, Target, AlertTriangle, Settings } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import jsPDF from 'jspdf';
import type { WorkflowWizardData } from "../WorkflowRedesignWizard";

interface BusinessCaseStepProps {
  wizardData: WorkflowWizardData;
  data: {
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
  onUpdate: (data: any) => void;
  onComplete: () => void;
  onBack?: () => void;
}

export function BusinessCaseStep({ wizardData, data, onUpdate, onComplete, onBack }: BusinessCaseStepProps) {
  const [copied, setCopied] = useState(false);
  const [emailDraftOpen, setEmailDraftOpen] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  useEffect(() => {
    // Auto-generate business case on mount
    if (!data.summary) {
      generateBusinessCase();
    }
  }, []);

  const generateBusinessCase = async () => {
    const selectedStep = wizardData.currentWorkflow.steps.find(
      (s) => s.id === wizardData.painPointAnalysis.selectedStep
    );

    // Calculate time savings
    const avgTimeSavings = wizardData.stepBreakdown.subSteps.reduce(
      (acc, step) => acc + step.timeSavings,
      0
    ) / wizardData.stepBreakdown.subSteps.length;

    // Convert time wasted to minutes for calculation
    let baseTimeInMinutes = 60; // default
    if (wizardData.painPointAnalysis.timeWasted) {
      const { value, unit } = wizardData.painPointAnalysis.timeWasted;
      switch (unit) {
        case 'minutes':
          baseTimeInMinutes = value;
          break;
        case 'hours':
          baseTimeInMinutes = value * 60;
          break;
        case 'days':
          baseTimeInMinutes = value * 60 * 8; // 8 hour work day
          break;
      }
    }
    
    // Calculate annual frequency
    let annualFrequency = 12; // default monthly
    if (wizardData.painPointAnalysis.frequency) {
      const { value, unit } = wizardData.painPointAnalysis.frequency;
      switch (unit) {
        case 'daily':
          annualFrequency = value * 260; // 260 working days per year
          break;
        case 'weekly':
          annualFrequency = value * 52;
          break;
        case 'monthly':
          annualFrequency = value * 12;
          break;
        case 'quarterly':
          annualFrequency = value * 4;
          break;
        case 'yearly':
          annualFrequency = value;
          break;
      }
    }
    const annualTimeSaved = (baseTimeInMinutes * annualFrequency * (avgTimeSavings / 100)) / 60; // Convert to hours

    // Generate implementation phases based on AI approach
    const approach = wizardData.painPointAnalysis.aiApproach;
    let phase1 = "";
    let phase2 = "";
    let phase3 = "";

    if (approach === "prompt") {
      phase1 = "Select and configure LLM provider, create initial prompts, test with sample data (1-2 weeks)";
      phase2 = "Refine prompts based on feedback, integrate with existing tools, train team (2-3 weeks)";
      phase3 = "Full deployment, monitor performance, continuous optimization (Ongoing)";
    } else if (approach === "rag") {
      phase1 = "Set up vector database, prepare and index knowledge base, initial testing (2-3 weeks)";
      phase2 = "Implement retrieval pipeline, fine-tune relevance, integrate with workflow (3-4 weeks)";
      phase3 = "Scale to full dataset, monitor accuracy, expand knowledge sources (Ongoing)";
    } else if (approach === "agentic") {
      phase1 = "Design agent architecture, define tools and permissions, prototype core functions (3-4 weeks)";
      phase2 = "Implement multi-step workflows, add error handling, extensive testing (4-6 weeks)";
      phase3 = "Production deployment, add advanced features, scale automation (Ongoing)";
    }

    // Generate AI-enhanced content
    const aiContent = await generateAIContent(selectedStep, approach, wizardData);

    const businessCaseData = {
      summary: `This AI quick win for "${selectedStep?.description}" offers a low-risk opportunity to save ${Math.round(
        annualTimeSaved
      )} hours annually while building organizational AI capability. This focused ${approach} pilot demonstrates AI value, creates reusable patterns, and establishes a foundation for broader workflow automation initiatives.`,
      businessNeed: aiContent.businessNeed,
      currentProcess: aiContent.currentProcess,
      proposedSolution: aiContent.proposedSolution,
      timeSaved: `${Math.round(annualTimeSaved)} hours/year`,
      costReduction: `Learning opportunity - no major investment required`,
      qualityImprovements: aiContent.qualityImprovements,
      strategicValue: aiContent.strategicValue,
      securityConsiderations: aiContent.securityConsiderations,
      implementationSupport: aiContent.implementationSupport,
      timelineNeeds: aiContent.timelineNeeds,
      workflowContext: aiContent.workflowContext,
      implementation: {
        phase1,
        phase2,
        phase3,
      },
    };

    onUpdate(businessCaseData);
  };

  const generateAIContent = async (selectedStep: any, approach: string, wizardData: WorkflowWizardData) => {
    try {
      const prompt = `Generate content for an AI quick win business case focused on learning and capability building.

Workflow: ${wizardData.currentWorkflow.name}
Target Step: ${selectedStep?.description}
Pain Point: ${wizardData.painPointAnalysis.painDetails}
AI Approach: ${approach}

Generate content emphasizing this as a LEARNING OPPORTUNITY and QUICK WIN:
1. Business Need (frame as learning opportunity, building AI confidence, low-risk testing)
2. Current Process (focus on manual inefficiencies that limit learning and growth)
3. Proposed Solution (quick win that builds capability for future automation)
4. Quality Improvements (learning benefits, skill building, confidence gains)
5. Strategic Value (capability building, team readiness, proof of concept value)
6. Security Considerations (low-risk pilot approach, controlled testing environment)
7. Implementation Support (learning resources, skill development, knowledge transfer)
8. Timeline Needs (urgency for learning and capability building)
9. Workflow Context (stepping stone to broader AI adoption and workflow transformation)

Focus on compound benefits, team learning, confidence building, and how small wins lead to bigger opportunities.

Format as JSON with keys: businessNeed, currentProcess, proposedSolution, qualityImprovements, strategicValue, securityConsiderations, implementationSupport, timelineNeeds, workflowContext`;

      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          context: 'business case generation'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI content');
      }

      const data = await response.json();
      
      try {
        return JSON.parse(data.response);
      } catch {
        // Fallback to default content if AI response isn't valid JSON
        return {
          businessNeed: `This quick win addresses ${wizardData.painPointAnalysis.painDetails} in ${selectedStep?.description} while providing a low-risk opportunity to build AI capabilities and demonstrate value to stakeholders.`,
          currentProcess: `Current manual approach limits learning opportunities and creates inefficiencies that prevent the team from exploring more advanced automation possibilities.`,
          proposedSolution: `Start with focused ${approach} AI assistance for this specific sub-step to learn, iterate, and build organizational confidence for broader AI adoption.`,
          qualityImprovements: "Builds team AI literacy, creates reusable patterns, improves confidence with AI tools, establishes best practices for future initiatives",
          strategicValue: "Develops organizational AI readiness, proves concept value, creates foundation for scaling AI adoption, builds change management experience",
          securityConsiderations: "Low-risk pilot with controlled scope, existing data security measures, gradual rollout minimizes potential issues while maximizing learning",
          implementationSupport: "Learning-focused approach with skill development opportunities, knowledge sharing sessions, and iterative improvement based on team feedback",
          timelineNeeds: "Quick implementation allows rapid learning cycles and demonstrates AI value before larger initiatives, building momentum for future projects",
          workflowContext: "This quick win establishes AI capability and confidence as a stepping stone to comprehensive workflow transformation and broader automation initiatives."
        };
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      // Return fallback content
      return {
        businessNeed: `This quick win addresses ${wizardData.painPointAnalysis.painDetails} in ${selectedStep?.description} while providing a low-risk opportunity to build AI capabilities and demonstrate value to stakeholders.`,
        currentProcess: `Current manual approach limits learning opportunities and creates inefficiencies that prevent the team from exploring more advanced automation possibilities.`,
        proposedSolution: `Start with focused ${approach} AI assistance for this specific sub-step to learn, iterate, and build organizational confidence for broader AI adoption.`,
        qualityImprovements: "Builds team AI literacy, creates reusable patterns, improves confidence with AI tools, establishes best practices for future initiatives",
        strategicValue: "Develops organizational AI readiness, proves concept value, creates foundation for scaling AI adoption, builds change management experience",
        securityConsiderations: "Low-risk pilot with controlled scope, existing data security measures, gradual rollout minimizes potential issues while maximizing learning",
        implementationSupport: "Learning-focused approach with skill development opportunities, knowledge sharing sessions, and iterative improvement based on team feedback",
        timelineNeeds: "Quick implementation allows rapid learning cycles and demonstrates AI value before larger initiatives, building momentum for future projects",
        workflowContext: "This quick win establishes AI capability and confidence as a stepping stone to comprehensive workflow transformation and broader automation initiatives."
      };
    }
  };

  const copyToClipboard = async () => {
    const businessCase = formatBusinessCaseAsText();
    await navigator.clipboard.writeText(businessCase);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatBusinessCaseAsText = () => {
    return `AI Quick Win Business Case

Workflow: ${wizardData.currentWorkflow.name}

Executive Summary:
${data.summary}

Learning Opportunity:
${data.businessNeed || 'This quick win provides a low-risk way to build AI capabilities and demonstrate value to stakeholders.'}

Current Challenge:
${data.currentProcess || 'Manual processes limit learning opportunities and prevent exploration of advanced automation possibilities.'}

Quick Win Solution:
${data.proposedSolution || 'Start with focused AI assistance to learn, iterate, and build organizational confidence for broader AI adoption.'}

Immediate Impact:
• Time Savings: ${data.timeSaved}
• Learning Value: Builds team AI confidence and creates reusable patterns
• Quality Improvements: ${data.qualityImprovements || 'Faster response times, consistent quality, reduced manual effort'}

Compound Benefits:
• ${data.strategicValue || 'Develops organizational AI readiness and proves concept value'}
• Creates foundation for scaling AI adoption
• Builds change management experience
• Identifies next automation opportunities

Risk Mitigation:
${data.securityConsiderations || 'Low-risk pilot with controlled scope and gradual rollout minimizes issues while maximizing learning'}

Implementation Approach:
${data.implementationSupport || 'Learning-focused approach with skill development and knowledge sharing opportunities'}

Timeline & Urgency:
${data.timelineNeeds || 'Quick implementation allows rapid learning cycles and builds momentum for future projects'}

Implementation Path:

Phase 1 - Pilot & Learn (Weeks 1-2):
${data.implementation.phase1}

Phase 2 - Refine & Expand (Weeks 3-6):
${data.implementation.phase2}

Phase 3 - Scale & Prepare Next (Ongoing):
${data.implementation.phase3}

Strategic Context:
${data.workflowContext || 'This quick win establishes AI capability as a stepping stone to comprehensive workflow transformation.'}

Next Steps:
1. Approve 2-week pilot test
2. Assemble learning-focused team
3. Begin Phase 1 with feedback collection
4. Document lessons learned for next initiatives
5. Plan broader AI adoption roadmap`;
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, y: number, fontSize: number = 10, fontStyle: string = 'normal') => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', fontStyle);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, margin, y);
      return y + (lines.length * fontSize * 0.4) + 5;
    };

    // Title
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('AI Quick Win Business Case', margin, 18);
    
    yPosition = 35;
    doc.setTextColor(0, 0, 0);

    // Workflow name
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Workflow: ${wizardData.currentWorkflow.name}`, margin, yPosition);
    yPosition += 15;

    // Executive Summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Executive Summary', margin, yPosition);
    yPosition += 8;
    yPosition = addWrappedText(data.summary, yPosition);

    // Learning Opportunity
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Learning Opportunity', margin, yPosition);
    yPosition += 8;
    yPosition = addWrappedText(data.businessNeed || 'This quick win provides a low-risk way to build AI capabilities.', yPosition);

    // Quick Win Solution
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Quick Win Solution', margin, yPosition);
    yPosition += 8;
    yPosition = addWrappedText(data.proposedSolution || 'Start with focused AI assistance to learn and build confidence.', yPosition);

    // Immediate Impact
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Immediate Impact', margin, yPosition);
    yPosition += 8;
    yPosition = addWrappedText(`• Time Savings: ${data.timeSaved}`, yPosition);
    yPosition = addWrappedText('• Learning Value: Builds team AI confidence and creates reusable patterns', yPosition);
    yPosition = addWrappedText(`• Quality Improvements: ${data.qualityImprovements || 'Faster response times, consistent quality'}`, yPosition);

    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = margin;
    }

    // Compound Benefits
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Compound Benefits', margin, yPosition);
    yPosition += 8;
    yPosition = addWrappedText('• Develops organizational AI readiness and proves concept value', yPosition);
    yPosition = addWrappedText('• Creates foundation for scaling AI adoption', yPosition);
    yPosition = addWrappedText('• Builds change management experience', yPosition);
    yPosition = addWrappedText('• Identifies next automation opportunities', yPosition);

    // Implementation Approach
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Implementation Approach', margin, yPosition);
    yPosition += 8;
    yPosition = addWrappedText(data.implementationSupport || 'Learning-focused approach with skill development opportunities.', yPosition);

    // Save the PDF
    const fileName = `ai-quick-win-${wizardData.currentWorkflow.name.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    doc.save(fileName);
  };

  const generateEmailDraft = () => {
    const subject = `AI Quick Win Proposal: ${wizardData.currentWorkflow.name}`;
    const body = `Subject: ${subject}

Dear [Stakeholder Name],

I hope this message finds you well. I'm writing to propose a quick AI implementation that could provide immediate value while building our organizational AI capabilities.

${formatBusinessCaseAsText()}

I'd appreciate the opportunity to discuss this proposal with you. This quick win approach allows us to test AI capabilities with minimal risk while demonstrating tangible value.

Please let me know when we can schedule a brief discussion about moving forward with this initiative.

Best regards,
[Your Name]
[Your Title]
[Contact Information]`;

    return body;
  };

  const copyEmailDraft = async () => {
    const emailText = generateEmailDraft();
    await navigator.clipboard.writeText(emailText);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const createEmailDraft = () => {
    setEmailDraftOpen(true);
  };

  // Prepare data for learning progression visualization
  const learningProgressionData = [
    { phase: 'Quick Win', value: 20, color: '#22c55e' },
    { phase: 'Expanded Use', value: 45, color: '#3b82f6' },
    { phase: 'Full Adoption', value: 80, color: '#8b5cf6' },
  ];

  const impactTimelineData = [
    { week: 'Week 1', impact: 5, confidence: 60 },
    { week: 'Week 4', impact: 15, confidence: 75 },
    { week: 'Week 8', impact: 25, confidence: 85 },
    { week: 'Week 12', impact: 35, confidence: 90 },
  ];

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-gray-900">Quick Win Business Case</h3>
        </div>
        <p className="text-sm text-gray-600">
          Position this AI enhancement as a learning opportunity to build capability and demonstrate value for future initiatives.
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Executive Summary */}
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-indigo-600" />
              <h4 className="font-semibold text-gray-900">Executive Summary</h4>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
          </div>

          {/* Business Need */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <h4 className="font-semibold text-orange-900">Learning Opportunity</h4>
            </div>
            <p className="text-sm text-orange-800 leading-relaxed">{data.businessNeed || 'This quick win provides a low-risk way to test AI capabilities and build organizational confidence for larger initiatives.'}</p>
          </div>

          {/* Current Process */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="h-4 w-4 text-red-600" />
              <h4 className="font-semibold text-red-900">Current Challenge</h4>
            </div>
            <p className="text-sm text-red-800 leading-relaxed">{data.currentProcess || 'Manual processes create bottlenecks, inconsistent outcomes, and limit our ability to scale efficiently.'}</p>
          </div>

          {/* Proposed Solution */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <h4 className="font-semibold text-green-900">Quick Win Solution</h4>
            </div>
            <p className="text-sm text-green-800 leading-relaxed">{data.proposedSolution || 'Start with focused AI assistance for this specific sub-step to learn, iterate, and build toward broader automation.'}</p>
          </div>

          {/* Learning Progression Chart */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              AI Capability Building Path
            </h4>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={learningProgressionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="phase" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}% capability`, 'Progress']} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-600 mt-2">Start small, learn fast, scale confidently</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Quick Win Impact */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Immediate Impact</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-sm text-blue-700">Time Savings</p>
                <p className="text-lg font-bold text-blue-800">{data.timeSaved}</p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Efficiency Gain</p>
                <p className="text-lg font-bold text-blue-800">25-40%</p>
              </div>
            </div>
            <p className="text-sm text-blue-800">{data.qualityImprovements || 'Faster response times, consistent quality, reduced manual effort'}</p>
          </div>

          {/* Compound Benefits */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <h4 className="font-semibold text-purple-900">Compound Benefits</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm text-purple-800">Builds team AI confidence</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm text-purple-800">Creates reusable AI patterns</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm text-purple-800">Identifies next automation opportunities</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm text-purple-800">Proves AI value to stakeholders</p>
              </div>
            </div>
          </div>

          {/* Impact Over Time */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-600" />
              Growing Impact & Confidence
            </h4>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={impactTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="impact" stroke="#22c55e" strokeWidth={2} name="Impact %" />
                <Line yAxisId="right" type="monotone" dataKey="confidence" stroke="#3b82f6" strokeWidth={2} name="Confidence %" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-600 mt-2">Green: Impact increases, Blue: Team confidence grows</p>
          </div>

          {/* Next Steps */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-indigo-600" />
              <h4 className="font-semibold text-indigo-900">Implementation Approach</h4>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <p className="text-sm text-indigo-800">Start with 2-week pilot test</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <p className="text-sm text-indigo-800">Gather feedback and metrics</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <p className="text-sm text-indigo-800">Refine and expand gradually</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                <p className="text-sm text-indigo-800">Plan next AI opportunities</p>
              </div>
            </div>
          </div>

          {/* Security & Support */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4 text-yellow-600" />
              <h4 className="font-semibold text-yellow-900">Risk Mitigation</h4>
            </div>
            <p className="text-sm text-yellow-800 leading-relaxed">{data.securityConsiderations || 'Low-risk pilot with existing data, proper access controls, and gradual rollout minimizes potential issues while maximizing learning.'}</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Download className="h-4 w-4 text-gray-600" />
          <h4 className="font-semibold text-gray-900">Share Your Quick Win Case</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button variant="outline" className="justify-start" onClick={copyToClipboard}>
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Text
              </>
            )}
          </Button>
          <Button variant="outline" className="justify-start" onClick={downloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Dialog open={emailDraftOpen} onOpenChange={setEmailDraftOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="justify-start" onClick={createEmailDraft}>
                <Mail className="h-4 w-4 mr-2" />
                Email Draft
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Email Draft - AI Quick Win Proposal</DialogTitle>
                <DialogDescription>
                  Copy this email draft to send to stakeholders
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="bg-gray-50 border rounded-lg p-4">
                  <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800 leading-relaxed">
                    {generateEmailDraft()}
                  </pre>
                </div>
                <div className="flex gap-3">
                  <Button onClick={copyEmailDraft} className="flex-1">
                    {emailCopied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Email Draft
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setEmailDraftOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Alert className="bg-green-50 border-green-200">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription>
          <strong>Ready to move forward!</strong> You've created a compelling case for this AI quick win that focuses on learning, building capability, and demonstrating value for future initiatives.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onComplete}>Complete Exercise</Button>
      </div>
    </div>
  );
}