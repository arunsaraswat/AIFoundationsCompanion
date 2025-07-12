import type { Lesson } from '../../../client/src/contexts/CourseProgressContext';

export const lesson4: Lesson = {
  id: 4,
  title: "Workflow Redesign + Implementation",
  subLessons: [
    {
      id: "4.1",
      title: "4.1 Workflow Improvement Process",
      completed: false,
      exercises: [
        {
          id: "exercise-21",
          type: "textarea",
          label: "Make a Sandwich",
          description:
            'Group Discussion: At your table, take turns explaining how you make your favorite sandwich - step by step in 30 seconds or less.<br><br><strong>Be specific:</strong><br>• "Open the fridge. Get the bread. Toast it..."<br>• "Spread mayo on one side. Stack turkey. Add pickles..."<br><br>Write down the step-by-step process for making your favorite sandwich:',
          component: "ModelComparison",
        },
        {
          id: "exercise-22",
          type: "link",
          label: "AI Workflow Enhancement Tool",
          description:
            "Interactive workflow redesign activity using the AI Workflow Enhancer tool to identify and enhance your processes with AI integration points.",
          link: "/exercise/workflow-enhancer",
        },
        {
          id: "exercise-23",
          type: "textarea",
          label: "Journal",
          description:
            "Think about a work process you perform regularly - perhaps preparing reports, onboarding new team members, or handling customer requests. Before today's exercise, how clearly could you have described every step, decision point, and handoff in that process? Now that you've experienced mapping workflows step-by-step, what surprised you most about the \"invisible\" complexity in work you thought you knew well? Write about one specific insight you gained about the gap between how you thought a process worked versus how it actually works.",
          answer: "",
        },
      ],
    },
    {
      id: "4.2",
      title: "4.2 Making The Business Case",
      completed: false,
      exercises: [
        {
          id: "reality-check",
          type: "checkbox",
          label: "Reality Check",
          description:
            "Group Discussion (5 min): Raise your hands if any of these sound familiar:",
          options: [
            '"Great idea, but who\'s going to build it?"',
            '"We don\'t have budget for that"',
            '"Legal will never approve external tools"',
            '"Sounds nice, but prove the ROI first"',
          ],
          answer: [],
        },
        {
          id: "4.2.workflow-tool",
          type: "link",
          label: "AI Workflow Enhancement Tool",
          description:
            "Interactive workflow redesign activity using the AI Workflow Enhancer tool to identify and enhance your processes with AI integration points.",
          link: "/exercise/workflow-enhancer",
        },
        {
          id: "journal-4-2",
          type: "textarea",
          label: "Journal",
          description:
            "Think about your current organization and a specific AI use case you'd like to implement. Which organizational type best describes your workplace: high-control, hybrid, or high-autonomy? What concerns or objections would your manager most likely raise about your AI proposal? Write about one specific conversation you could have in the next two weeks and what you'd need to prepare to increase your chances of getting a \"yes.\"",
          answer: "",
        },
      ],
    },
    {
      id: "4.3",
      title: "4.3 Transformational Thinking",
      completed: false,
      exercises: [
        {
          id: "4.3.1",
          type: "textarea",
          label: "The Wool Problem?",
          description:
            "What's the difference between the herder's thinking and what most people would do?",
          answer: "",
        },
        {
          id: "4.3.2",
          type: "textarea",
          label: "The Wool Question Challenge",
          description:
            'Step 1: Find Your "Wool" - Look at your 4.1 workflow. Forget the process steps. <br>Ask: "What is this workflow actually trying to accomplish?"<br>Examples:<br />"Expense reporting" → "Spending visibility and compliance"<br /> "Team meetings" → "Coordination and problem-solving"<br /> "Customer emails" → "Customer success and issue resolution"<br /><br />Write: "The real problem we\'re solving is..."',
          answer: "",
        },
        {
          id: "4.3.3",
          type: "link",
          label: "What's Your Pattern?",
          description:
            "Interactive transformational thinking exercise to explore new approaches to business problems",
          link: "https://transformational-thinking.replit.app/",
        },
        {
          id: "4.3.4",
          type: "textarea",
          label: "Journal",
          description:
            'Think of a routine business process in your organization that everyone accepts as "just how we do things." Write down: What is the real problem this process is trying to solve? If you could ignore all current constraints and reimagine the solution from scratch, what would be possible? What assumptions about "how work gets done" might be limiting your thinking?',
          answer: "",
        },
      ],
    },
  ],
};