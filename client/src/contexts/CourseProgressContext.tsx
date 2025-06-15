import { createContext, useContext, useEffect, useState } from "react";
import { loadCourseData, saveCourseData } from "../utils/storage";

export interface SubLesson {
  id: string;
  title: string;
  completed: boolean;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  type:
    | "text"
    | "textarea"
    | "radio"
    | "checkbox"
    | "multi-step"
    | "radio-with-text"
    | "component"
    | "link";
  label: string;
  description?: string;
  options?: string[];
  steps?: Exercise[];
  answer?: string | string[];
  followUpAnswer?: string;
  followUpLabel?: string;
  followUpDescription?: string;
  component?: string;
  link?: string;
}

export interface Lesson {
  id: number;
  title: string;
  subLessons: SubLesson[];
}

interface CourseProgressContextType {
  lessons: Lesson[];
  updateSubLessonStatus: (
    lessonId: number,
    subLessonId: string,
    completed: boolean,
  ) => void;
  updateExerciseAnswer: (
    lessonId: number,
    subLessonId: string,
    exerciseId: string,
    answer: string | string[],
  ) => void;
  updateFollowUpAnswer: (
    lessonId: number,
    subLessonId: string,
    exerciseId: string,
    answer: string,
  ) => void;
  updateStepAnswer: (
    lessonId: number,
    subLessonId: string,
    exerciseId: string,
    stepId: string,
    answer: string,
  ) => void;
  getOverallProgress: () => {
    completed: number;
    total: number;
    percentage: number;
  };
  getLessonProgress: (lessonId: number) => {
    completed: number;
    total: number;
    isCompleted: boolean;
  };
  exportData: () => string;
  importData: (data: string) => void;
}

const CourseProgressContext = createContext<
  CourseProgressContextType | undefined
>(undefined);

const initialLessons: Lesson[] = [
  {
    id: 1,
    title: "EDGE+ AI-Native Foundations",
    subLessons: [
      {
        id: "1.1",
        title: "1.1 Welcome & Orientation",
        completed: false,
        exercises: [
          {
            id: "1.1.1",
            type: "textarea",
            label: "What Kind of Change Are You Feeling?",
            description:
              'Go around table with introductions. Share: Name, role, location. Complete: "Ever since ChatGPT went viral, the world is..."',
            component: "ModelComparison",
          },
          {
            id: "1.1.2",
            type: "radio-with-text",
            label: "EDGE Reaction Line-Up",
            description:
              "Go stand by the sign that's had the biggest impact on their role or industry.",
            options: [
              "Exponential - Things are speeding up way faster than expected",
              "Disruptive - Our old ways of doing things are suddenly not working",
              "Generative - New tools are helping create things we used to do manually",
              "Emergent - Stuff is happening that we didn't plan for—and don't fully understand yet",
            ],
            component: "ModelComparison",
            followUpAnswer: "",
            followUpLabel: "Discussion Questions:",
            followUpDescription:
              '"Why did you pick this one?" "Where have you seen it in action?"',
          },
          {
            id: "1.1.3",
            type: "textarea",
            label: "Journal Entry",
            description:
              "Which of the four EDGE forces—Exponential, Disruptive, Generative, or Emergent—do you feel most personally in your current role? Write about a specific example from your work where you've experienced this force, and describe what it means for how you need to think or act differently going forward.",
            component: "ModelComparison",
          },
        ],
      },
      {
        id: "1.2",
        title: "1.2 Introduction to AI-Native",
        completed: false,
        exercises: [
          {
            id: "1.2.1",
            type: "textarea",
            label: "What Comes to Mind?",
            description:
              'Pair discussion about "AI-Native" phrase. First thoughts and feelings. No wrong answers',
            component: "ModelComparison",
          },
          {
            id: "1.2.2",
            type: "textarea",
            label: "What AI-Native Means to Me",
            description:
              'Each person answers: "What does it look like to relentlessly embed AI in my work?" "What\'s one example of how my organization could structurally bake in AI?"',
            component: "ModelComparison",
          },
          {
            id: "1.2.4",
            type: "textarea",
            label: "Journal: AI-First Mindset",
            description:
              'Think about a task you completed yesterday. Write about how your approach might change if you automatically asked "How can AI help with this?" before starting. What would shift in your process, timeline, or outcomes?',
            component: "ModelComparison",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "AI Technical Foundations",
    subLessons: [
      {
        id: "2.1",
        title: "2.1 AI Basics",
        completed: false,
        exercises: [
          {
            id: "2.1.1",
            type: "textarea",
            label: "Explain It to Someone's Grandparent",
            description:
              "How would you explain what AI is to someone's grandparent?",
            component: "ModelComparison",
          },
          {
            id: "2.1.2",
            type: "link",
            label: "Model Match-Up",
            description:
              "Interactive exercise to sort real-world use cases into AI/ML/DL/Gen AI categories and define their inputs/outputs.",
            link: "/exercise/model-match-up",
            component: "ModelComparison",
          },
          {
            id: "2.1.3",
            type: "textarea",
            label: "Journal: What Changed Your Mind?",
            description:
              "Before this session, how would you have explained AI to someone who knew nothing about it? Now write down one key distinction between human and machine intelligence that you'd emphasize differently. What surprised you most about how AI, ML, deep learning, and generative AI relate to each other?",
            component: "ModelComparison",
          },
        ],
      },
      {
        id: "2.2",
        title: "2.2 Data",
        completed: false,
        exercises: [
          {
            id: "discussion-4",
            type: "textarea",
            label: "Data as a Design Decision",
            description:
              "You're building a music playlist generator for a global audience.<br>Questions to Consider: <br> - If your training data only includes English-language songs, what experience will users in Brazil or Korea get? <br> - What happens if all the data comes from people aged 20-30?",
          },
          {
            id: "exercise-7",
            type: "link",
            label: "Bad Data Risk Assessment",
            description:
              "Analyze the Real-World Use Cases from 2.1 (Ex. Netflix Recommendations) <br>Answer these two questions:<br> - Would this still work if it had half the data?<br> - What assumptions is this model making about the user or context?",
            link: "/exercise/model-match-up",
          },
          {
            id: "exercise-8",
            type: "textarea",
            label: "Journal",
            description:
              'Think about a recent AI tool you\'ve used (ChatGPT, Netflix recommendations, etc.). What assumptions might that AI be making about you based on limited or biased data? Write down one example where "garbage in, garbage out" could impact a decision that matters to you personally or professionally.',
          },
        ],
      },
      {
        id: "2.3",
        title: "2.3 Large Language Models",
        completed: false,
        exercises: [
          {
            id: "discussion-5",
            type: "text",
            label: "Language Challenges for Machines",
            description:
              "What's something humans do with language when they communicate that's hard for a machine to replicate?",
            component: "ModelComparison",
          },
          {
            id: "exercise-9",
            type: "component",
            label: "Be the Model – Token-by-Token Prediction",
            description:
              "Experience how language models predict text one token at a time.",
            component: "TokenPrediction",
          },
          {
            id: "exercise-10",
            type: "textarea",
            label: "Journal: Why Context Is Everything",
            description:
              'Think back to the "Be the Model" activity. What did you notice about how you predicted the next word? In 2 minutes, write about what this taught you about how LLMs work—and how your own assumptions shaped the prediction process.',
          },
        ],
      },
      {
        id: "2.4",
        title: "2.4 Prompting + Safe Use",
        completed: false,
        exercises: [
          {
            id: "discussion-6",
            type: "textarea",
            label: "Prompt Insights",
            description:
              "Have you ever typed something into ChatGPT or another AI tool and been disappointed or impressed by what you got back?",
            component: "ModelComparison",
          },
          {
            id: "exercise-11",
            type: "multi-step",
            label: "Build a Real Prompt for a Real Decision",
            description:
              "Multi-step activity to create and test decision support prompts",
            steps: [
              {
                id: "step-1",
                type: "textarea",
                label: "Step 1: Quick Decision Prompt (2-3 min)",
                description:
                  'Write your own quick decision prompt using this format: "I\'m a [your role]. I need to make a decision about [brief issue]. What are 3 options I should consider, and what are the trade-offs of each from my point of view?"',
                component: "ModelComparison",
              },
              {
                id: "step-2a",
                type: "multi-step",
                label: "Step 2: Fill in the Anatomy of a Problem (3 min)",
                description: "Now add real context. Fill in each of these:",
                steps: [
                  {
                    id: "role",
                    type: "text",
                    label: "Role: [your role]",
                    component: "ModelComparison",
                  },
                  {
                    id: "who-involved",
                    type: "text",
                    label: "Who is involved?",
                    component: "ModelComparison",
                  },
                  {
                    id: "challenge",
                    type: "text",
                    label: "What is the challenge or decision?",
                    component: "ModelComparison",
                  },
                  {
                    id: "where-happening",
                    type: "text",
                    label: "Where is it happening (team, system, etc.)?",
                    component: "ModelComparison",
                  },
                  {
                    id: "when-happening",
                    type: "text",
                    label:
                      "When is this happening or when is a decision needed?",
                    component: "ModelComparison",
                  },
                  {
                    id: "why-matters",
                    type: "text",
                    label: "Why does this matter (what's at stake)?",
                    component: "ModelComparison",
                  },
                  {
                    id: "output-format",
                    type: "text",
                    label:
                      "Preferred output format (pros/cons, table, ranked options, recommendation, etc.)",
                    component: "ModelComparison",
                  },
                ],
              },
              {
                id: "step-2b",
                type: "textarea",
                label: "Step 3: Using a Prompt Framework (RISE) ",
                description:
                  'Copy-Paste This Prompt into GPT: "Using the information below, generate a clear and effective prompt using the RISE format. Don\'t lose any important context. The output should have 4 labeled sections: Role, Input, Steps, and Expectation." Then paste your context from Step 2a.',
                component: "ModelComparison",
              },
              {
                id: "step-3",
                type: "component",
                label: "Step 4: Test your prompt in two different models",
                description:
                  "Run the RISE prompt in 2 different models and compare",
                component: "ModelComparison",
              },
            ],
          },
          {
            id: "exercise-12",
            type: "textarea",
            label: "Journal",
            description:
              "Think about a time when an AI gave you a response that felt off. In 2 minutes, write what you think went wrong—was it the prompt, the model, or your expectations? How will you approach prompting differently now?",
            answer: "",
          },
        ],
      },
      {
        id: "2.5",
        title: "2.5 RAG",
        completed: false,
        exercises: [
          {
            id: "discussion-7",
            type: "textarea",
            label: "Can ChatGPT Answer This?",
            description:
              "How well do you think ChatGPT can answer these, without help? <br> - What's our internal PTO policy? <br> - What is the difference between LLM and RAG? <br> - Who leads cybersecurity here?",
            component: "ModelComparison",
          },
          {
            id: "exercise-13",
            type: "multi-step",
            label: "GPT vs RAG on Employee Handbook",
            description:
              "Multi-step activity comparing GPT responses with and without RAG",
            steps: [
              {
                id: "step-1",
                type: "textarea",
                label: "Step 1: Ask GPT (without RAG)",
                description:
                  'Prompt: "I work at the Venue Network inc. Do I have to get supervisor approval for PTO? Only tell me what you know for certain and where I can find it in the employee handbook."',
                component: "ModelComparison",
              },
              {
                id: "step-2",
                type: "textarea",
                label:
                  "Step 2: Ask the same question in a RAG-enabled GPT which has access to the employee handbook.",
                description:
                  "Use the same prompt in Step 1 with a GPT that has the Venue Network, Inc. employee handbook RAG-enabled",
                component: "ModelComparison",
              },
              {
                id: "handbook-link",
                type: "link",
                label: "Venue Network, Inc. Employee Policy Manual",
                description: "Reference document for the RAG exercise",
                link: "/src/assets/venue-network-employee-handbook.pdf",
                component: "ModelComparison",
              },
              {
                id: "step-3",
                type: "textarea",
                label: "Step 3: Discuss the differences",
                description:
                  "Which version gave actual policy details? Did either include source references or cite page numbers? Which answer would you rely on if you were making a decision as an employee or manager?",
                component: "ModelComparison",
              },
            ],
          },
          {
            id: "exercise-14",
            type: "textarea",
            label: "Journal",
            description:
              'Think about the difference between a model that "knows" vs. one that "looks it up." In 2 minutes, write about a work scenario where relying on outdated or general AI knowledge could create risk—and how RAG could help solve that.',
            answer: "",
          },
        ],
      },
      {
        id: "2.6",
        title: "2.6 AI Agents",
        completed: false,
        exercises: [
          {
            id: "discussion-8",
            type: "textarea",
            label: "Helpful AI or Robot",
            description:
              "Can you think of a time in a film or TV series when a helpful AI or robot really supported someone in a meaningful way?",
            component: "ModelComparison",
          },
          {
            id: "exercise-15",
            type: "multi-step",
            label: "Design Your AI Assistant",
            description: "Individual Activity (Prepare: 5 min)",
            steps: [
              {
                id: "step-1",
                type: "multi-step",
                label: "Step 1: Identify the Role",
                description: "",
                steps: [
                  {
                    id: "step-1a",
                    type: "text",
                    label: "What kind of teammate is this agent?",
                    description: "",
                    component: "ModelComparison",
                  },
                  {
                    id: "step-1b",
                    type: "text",
                    label:
                      "What problem space will it 'live' in (e.g., backlog grooming, meeting prep, stakeholder reporting)?",
                    description: "",
                    component: "ModelComparison",
                  },
                ],
              },
              {
                id: "step-2",
                type: "multi-step",
                label: 'Step 2: Design the Agent\'s "Brain"',
                description: "",
                steps: [
                  {
                    id: "step-2a",
                    type: "text",
                    label:
                      "Goal: What decision or goal will it be responsible for?",
                    description: "",
                    component: "ModelComparison",
                  },
                  {
                    id: "step-2b",
                    type: "text",
                    label: "Inputs: What info does it need to operate?",
                    description: "",
                    component: "ModelComparison",
                  },
                  {
                    id: "step-2c",
                    type: "text",
                    label:
                      "Process Logic: What kind of reasoning or automation does it apply?",
                    description: "",
                    component: "ModelComparison",
                  },
                  {
                    id: "step-2d",
                    type: "text",
                    label: "Outputs: What does it produce or decide?",
                    description: "",
                    component: "ModelComparison",
                  },
                ],
              },
              {
                id: "step-3",
                type: "multi-step",
                label: "Step 3: Plan for Autonomy",
                description: "",
                steps: [
                  {
                    id: "step-3a",
                    type: "text",
                    label: "What decisions can it make on its own?",
                    description: "",
                    component: "ModelComparison",
                  },
                  {
                    id: "step-3b",
                    type: "text",
                    label: "Where should it ask for human input or feedback?",
                    description: "",
                    component: "ModelComparison",
                  },
                  {
                    id: "step-3c",
                    type: "text",
                    label: "What boundaries should be in place?",
                    description: "",
                    component: "ModelComparison",
                  },
                ],
              },
            ],
          },
          {
            id: "exercise-scale-multi-agent",
            type: "multi-step",
            label: "Scale It to Multi-Agent",
            description: "Prepare: 10 Minutes",
            steps: [
              {
                id: "step-1",
                type: "textarea",
                label: "Step 1: Define the Workflow (Group)",
                description: "As a table, identify high-level steps in planning and booking a vacation based on your group size. Each person claims one step to own.<br><br>Examples: Choose destination, set budget/dates, research accommodations, book travel, coordinate itinerary.",
                answer: "",
              },
              {
                id: "step-2",
                type: "multi-step",
                label: "Step 2: Design Your Step's Agent (Solo)",
                description: "",
                steps: [
                  {
                    id: "inputs",
                    type: "text",
                    label: "Inputs: What does it need to know?",
                    answer: "",
                  },
                  {
                    id: "process-logic",
                    type: "text",
                    label: "Process Logic: How does it work?",
                    answer: "",
                  },
                  {
                    id: "outputs",
                    type: "text",
                    label: "Outputs: What does it produce?",
                    answer: "",
                  },
                  {
                    id: "boundaries",
                    type: "text",
                    label: "Boundaries: What shouldn't it do?",
                    answer: "",
                  },
                  {
                    id: "name-personality",
                    type: "text",
                    label: "Give it a name and personality!",
                    answer: "",
                  },
                ],
              },
              {
                id: "step-3",
                type: "textarea",
                label: "Step 3: Orchestrate the System (Group Discussion)",
                description: "How will they function as a coordinated system?<br><br>Discuss & Map:<br>• Handoffs: What data gets passed?<br>• Dependencies: What needs to happen when?<br>• Decisions: Where do agents need feedback or loops?<br>• Oversight: Where do humans step in?",
                answer: "",
              },
            ],
          },
          {
            id: "exercise-16",
            type: "textarea",
            label: "Journal",
            description:
              "Think about a recent work situation where you felt overwhelmed by repetitive tasks or complex coordination. What would change about how you approach your work if you shifted from being someone who uses AI tools to someone who directs AI agents? Write about this transition—what excites you most, and what concerns would you want to address about maintaining the right balance between human judgment and agent autonomy?",
            answer: "",
          },
        ],
      },
      {
        id: "2.7",
        title: "2.7 Frontiers in AI",
        completed: false,
        exercises: [
          {
            id: "discussion-9",
            type: "multi-step",
            label: "Where Are We Headed?",
            description: "Class Discussion (5 min)",
            steps: [
              {
                id: "phone-past",
                type: "textarea",
                label:
                  "Think about your phone: What's something it can do now that felt experimental or futuristic just a few years ago?",
                description: "",
                component: "ModelComparison",
              },
              {
                id: "phone-future",
                type: "textarea",
                label:
                  "What do you imagine it might be able to do five years from now?",
                description: "",
                component: "ModelComparison",
              },
            ],
          },
          {
            id: "exercise-17",
            type: "multi-step",
            label: "Extra! Extra! Read All About It! - IRL",
            description: "Group Activity (5 min)",
            steps: [
              {
                id: "step-1",
                type: "text",
                label: "Step 1: Pick any future year — realistic or bold.",
                description: "",
                component: "ModelComparison",
              },
              {
                id: "step-2",
                type: "text",
                label:
                  "Step 2: Write a Headline that starts with: The year is [____]... and AI has become our everyday partner in __________.",
                description: "",
                component: "ModelComparison",
              },
              {
                id: "step-3",
                type: "multi-step",
                label: "Step 3: Bring Your Story to Life (Visually!)",
                description:
                  "Under your headline, draw or sketch a simple visual story that shows the world this AI has helped shape. Include:",
                steps: [
                  {
                    id: "step-3a",
                    type: "textarea",
                    label: "How has it changed people's lives or work?",
                    description: "",
                    component: "ModelComparison",
                  },
                  {
                    id: "step-3b",
                    type: "textarea",
                    label:
                      "Any surprising outcomes, innovations, or new needs that emerged?",
                    description: "",
                    component: "ModelComparison",
                  },
                ],
              },
              {
                id: "step-4",
                type: "textarea",
                label: "Step 4: Share Out",
                description:
                  'Each group presents their headline and "breaking news" to the room.',
                component: "ModelComparison",
              },
            ],
          },
          {
            id: "exercise-18",
            type: "textarea",
            label: "Journal",
            description:
              "Consider an AI capability you're currently using or considering for your work. Based on what you learned about the three horizons, honestly assess where this capability sits today: Is it Stable (ready for full reliance), Evolving (worth experimenting with), or Frontier (experimental only)? Write down how this classification should change your approach and expectations when using it.",
            answer: "",
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: "The AI-Native Operating Model",
    subLessons: [
      {
        id: "3.1",
        title:
          "3.1 The AI-Native Success Factors",
        completed: false,
        exercises: [
          {
            id: "discussion-10",
            type: "textarea",
            label: "How are we actually using AI?",
            description:
              'If someone asked your organization today, "How are we actually using AI?"—what would your answer be?',
            component: "ModelComparison",
          },
          {
            id: "exercise-19",
            type: "multi-step",
            label: "Personalizing the Playbook",
            description:
              "Multi-step activity to apply AI-Native Success Factors",
            steps: [
              {
                id: "pick-factor",
                type: "radio",
                label: "Pick a Success Factor",
                description:
                  "Review the 7 AI-Native Success Factors. Which one feels most within your control to start living out in your day-to-day work?",
                options: [
                  "Upskill Relentlessly",
                  "Tell the Full Story",
                  "Embed AI into the Everyday",
                  "Leadership Buy-in",
                  "Experimentation Culture",
                  "Cross-functional Collaboration",
                  "Continuous Learning Mindset",
                ],
                component: "ModelComparison",
              },
              {
                id: "define-application",
                type: "textarea",
                label: "Define How You'll Apply It",
                description:
                  "What would it look like if you started modeling this success factor in how you work or lead right now?<br/>Examples: <ul><li> - Upskill Relentlessly → Block 1 hour/month for hands-on AI learning and share notes with team<li> - Tell the Full Story → Start adding use-case evidence to every AI recommendation <li> - Embed AI into the Everyday → Automate 1 report or feedback loop using a simple GenAI tool</ul>",
                component: "ModelComparison",
              },
              {
                id: "micro-plan",
                type: "multi-step",
                label: "Create a Micro-Plan",
                description:
                  "What's your first move? Who needs to know? How will you track if it's working?",
                steps: [
                  {
                    id: "action",
                    type: "text",
                    label: "Action (What I'll do)",
                    component: "ModelComparison",
                  },
                  {
                    id: "start-date",
                    type: "text",
                    label: "Start Date",
                    component: "ModelComparison",
                  },
                  {
                    id: "who-helps",
                    type: "text",
                    label: "Who It Helps",
                    component: "ModelComparison",
                  },
                  {
                    id: "success-looks",
                    type: "text",
                    label: "What Success Looks Like",
                    component: "ModelComparison",
                  },
                ],
              },
              {
                id: "share-plan",
                type: "textarea",
                label: "Share Your Plan with your table",
                description: "Invite a few volunteers to share theirs",
                component: "ModelComparison",
              },
            ],
          },
          {
            id: "exercise-20",
            type: "textarea",
            label: "Journal",
            description:
              "Look back at the 7 AI-Native Success Factors and consider your current work environment. Which Success Factor feels like the biggest gap or opportunity in your organization right now? Write about why this particular factor stood out to you and what it would look like if your team or organization truly embodied this factor. What would change in how people work, make decisions, or approach challenges?",
            answer: "",
          },
        ],
      },
    ],
  },
  {
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
            label: "Exercise 22: AI Workflow Enhancement Tool",
            description:
              "Interactive workflow redesign activity using the AI Workflow Enhancer tool to identify and enhance your processes with AI integration points.",
            link: "/exercise/workflow-enhancer",
            component: "ModelComparison",
          },
        ],
      },
      { id: "4.2", title: "4.2 Operate & Reinforce", completed: false },
      { id: "4.3", title: "4.3 Document & Share", completed: false },
    ],
  },
  {
    id: 5,
    title: "Opportunity Assessment + Roadmapping",
    subLessons: [
      { id: "5.1", title: "5.1 AI Opportunity Jumpstart", completed: false },
      { id: "5.2", title: "5.2 30-60-90 Roadmap", completed: false },
    ],
  },
  {
    id: 6,
    title: "Advocacy + Influence",
    subLessons: [
      { id: "6.1", title: "6.1 Pitch Crafting", completed: false },
      {
        id: "6.2",
        title: "6.2 Pitch Rehearsal + Marketplace",
        completed: false,
      },
    ],
  },
];

export function CourseProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = loadCourseData();
    return saved || initialLessons;
  });

  useEffect(() => {
    saveCourseData(lessons);
  }, [lessons]);

  const updateSubLessonStatus = (
    lessonId: number,
    subLessonId: string,
    completed: boolean,
  ) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              subLessons: lesson.subLessons.map((subLesson) =>
                subLesson.id === subLessonId
                  ? { ...subLesson, completed }
                  : subLesson,
              ),
            }
          : lesson,
      ),
    );
  };

  const updateExerciseAnswer = (
    lessonId: number,
    subLessonId: string,
    exerciseId: string,
    answer: string | string[],
  ) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              subLessons: lesson.subLessons.map((subLesson) =>
                subLesson.id === subLessonId
                  ? {
                      ...subLesson,
                      exercises: subLesson.exercises?.map((exercise) =>
                        exercise.id === exerciseId
                          ? { ...exercise, answer }
                          : exercise,
                      ),
                    }
                  : subLesson,
              ),
            }
          : lesson,
      ),
    );
  };

  const updateFollowUpAnswer = (
    lessonId: number,
    subLessonId: string,
    exerciseId: string,
    answer: string,
  ) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              subLessons: lesson.subLessons.map((subLesson) =>
                subLesson.id === subLessonId
                  ? {
                      ...subLesson,
                      exercises: subLesson.exercises?.map((exercise) =>
                        exercise.id === exerciseId
                          ? { ...exercise, followUpAnswer: answer }
                          : exercise,
                      ),
                    }
                  : subLesson,
              ),
            }
          : lesson,
      ),
    );
  };

  const updateStepAnswer = (
    lessonId: number,
    subLessonId: string,
    exerciseId: string,
    stepId: string,
    answer: string,
  ) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              subLessons: lesson.subLessons.map((subLesson) =>
                subLesson.id === subLessonId
                  ? {
                      ...subLesson,
                      exercises: subLesson.exercises?.map((exercise) =>
                        exercise.id === exerciseId
                          ? {
                              ...exercise,
                              steps: exercise.steps?.map((step) =>
                                step.id === stepId ? { ...step, answer } : step,
                              ),
                            }
                          : exercise,
                      ),
                    }
                  : subLesson,
              ),
            }
          : lesson,
      ),
    );
  };

  const getOverallProgress = () => {
    const total = lessons.reduce(
      (acc, lesson) => acc + lesson.subLessons.length,
      0,
    );
    const completed = lessons.reduce(
      (acc, lesson) =>
        acc + lesson.subLessons.filter((sub) => sub.completed).length,
      0,
    );
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const getLessonProgress = (lessonId: number) => {
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return { completed: 0, total: 0, isCompleted: false };

    const total = lesson.subLessons.length;
    const completed = lesson.subLessons.filter((sub) => sub.completed).length;
    const isCompleted = completed === total;

    return { completed, total, isCompleted };
  };

  const exportData = () => {
    // Include all exercise-specific data
    const exerciseData = {
      modelMatchUpData: localStorage.getItem("modelMatchUpData"),
      modelMatchUpTask2: localStorage.getItem("modelMatchUpTask2"),
      modelMatchUpTask3: localStorage.getItem("modelMatchUpTask3"),
      tokenPredictionState: localStorage.getItem("tokenPredictionState"),
    };

    return JSON.stringify(
      {
        lessons,
        exerciseData,
      },
      null,
      2,
    );
  };

  const importData = (data: string) => {
    try {
      const parsed = JSON.parse(data);

      // Import lesson data
      if (parsed.lessons && Array.isArray(parsed.lessons)) {
        setLessons(parsed.lessons);
        saveCourseData(parsed.lessons);
      } else {
        throw new Error("Invalid data format");
      }

      // Import exercise-specific data
      if (parsed.exerciseData) {
        if (parsed.exerciseData.modelMatchUpData) {
          localStorage.setItem(
            "modelMatchUpData",
            parsed.exerciseData.modelMatchUpData,
          );
        }
        if (parsed.exerciseData.modelMatchUpTask2) {
          localStorage.setItem(
            "modelMatchUpTask2",
            parsed.exerciseData.modelMatchUpTask2,
          );
        }
        if (parsed.exerciseData.modelMatchUpTask3) {
          localStorage.setItem(
            "modelMatchUpTask3",
            parsed.exerciseData.modelMatchUpTask3,
          );
        }
        if (parsed.exerciseData.tokenPredictionState) {
          localStorage.setItem(
            "tokenPredictionState",
            parsed.exerciseData.tokenPredictionState,
          );
        }
      }
    } catch (error) {
      throw new Error("Failed to import data: Invalid JSON format");
    }
  };

  return (
    <CourseProgressContext.Provider
      value={{
        lessons,
        updateSubLessonStatus,
        updateExerciseAnswer,
        updateFollowUpAnswer,
        updateStepAnswer,
        getOverallProgress,
        getLessonProgress,
        exportData,
        importData,
      }}
    >
      {children}
    </CourseProgressContext.Provider>
  );
}

export function useCourseProgress() {
  const context = useContext(CourseProgressContext);
  if (context === undefined) {
    throw new Error(
      "useCourseProgress must be used within a CourseProgressProvider",
    );
  }
  return context;
}
