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
            answer: "",
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
            answer: "",
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
              'Individual reflection: "One question I hope this course answers..."',
            answer: "",
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
            label: "Discussion 2: What Comes to Mind?",
            description:
              'Pair discussion about "AI-Native" phrase. First thoughts and feelings. No wrong answers',
            answer: "",
          },
          {
            id: "1.2.2",
            type: "multi-step",
            label: "Exercise 3: What AI-Native Means to Me",
            description:
              "Multi-step activity: Translate the Definition (Individual then Affinity Group)",
            steps: [
              {
                id: "1.2.2.1",
                type: "textarea",
                label: "Step 1: Individual Reflection",
                description:
                  'Each person answers: "What does it look like to relentlessly embed AI in my work?" "What\'s one example of how my org could structurally bake in AI?" Write 1 sticky note per definition (Professional & Org) for your domain.',
                answer: "",
              },
              {
                id: "1.2.2.2",
                type: "textarea",
                label: "Step 2: Find the Patterns",
                description:
                  "In your group, affinity group your organizational sticky notes and identify and share patterns you see across your organizations.",
                answer: "",
              },
            ],
            answer: "",
          },
          {
            id: "1.2.4",
            type: "text",
            label: "Exercise 4: One Word Check-In",
            description:
              "Write one word about AI-Native feelings. Hold up sticky note. 2-3 volunteers share reasoning",
            answer: "",
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
            label: 'Discussion 3: "Explain It to Someone\'s Grandparent"',
            description:
              "Pair up and explain AI, ML, DL to each other. Take 1-2 minutes each person. Make it simple and clear. Flag confusing or technical terms.",
            answer: "",
          },
          {
            id: "2.1.2",
            type: "link",
            label: 'Exercise 5: "Model Match-Up" (AI Basics)',
            description:
              "Interactive card-based exercise to sort real-world use cases into AI/ML/DL categories and define their inputs/outputs.",
            link: "/exercise/model-match-up",
            answer: "",
          },
          {
            id: "2.1.3",
            type: "radio-with-text",
            label: 'Exercise 6: "What Changed Your Mind?" (AI Basics)',
            description:
              "Reflect on what you would explain differently about AI concepts after the exercises.",
            options: [
              "I would explain AI concepts much more simply",
              "I would focus more on real-world examples",
              "I would emphasize the differences between AI/ML/DL more clearly",
              "I would address common misconceptions first",
              "I wouldn't change my approach much",
            ],
            answer: "",
            followUpAnswer: "",
            followUpLabel: "Table Synthesis:",
            followUpDescription:
              "What collective insight would you share about explaining AI concepts?",
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
            label: 'Discussion 4: "Data as a Design Decision"',
            description:
              "Objective: Explore how the quality, scope, and inclusivity of data profoundly shape the performance and fairness of AI systems — and how every design decision is also a data decision. \nScenario: You're designing an AI-powered global music playlist generator. The system recommends personalized playlists to users based on their listening history, preferences, and behaviors. \nDesign Constraints: • Your training data comes exclusively from English-language music sources. • The user sample skews heavily toward people aged 20–30 in North America.",
          },
          {
            id: "exercise-7",
            type: "link",
            label: 'Exercise 7: "Bad Data Risk Assessment"',
            description:
              "Task 3: Mark any 'bad data' risk point on the card (e.g., skewed inputs, noisy training data, missing labels). Facilitator circulates, prompting questions: 'Would this still work if it had half the data?' 'What assumptions is this model making about the user or context?'",
            link: "/exercise/model-match-up",
          },
          {
            id: "exercise-8",
            type: "textarea",
            label: 'Exercise 8: "Where Bad Data Hurts Most"',
            description:
              "Individual reflection on your work. Identify 2-3 high-impact bad data areas. Record answers in workbook.",
          },
        ],
      },
      {
        id: "2.3",
        title: "2.3 LLMs – The Mind Behind the Curtain",
        completed: false,
        exercises: [
          {
            id: "discussion-5",
            type: "text",
            label: 'Discussion 5: "What\'s Hard About Language for Machines?"',
            description:
              "What's something humans do with language that machines struggle to replicate?",
            answer: "",
          },
          {
            id: "exercise-9",
            type: "component",
            label: "Exercise 9: Be the Model – Token-by-Token Prediction",
            description:
              "Experience how language models predict text one token at a time.",
            component: "TokenPrediction",
          },
          {
            id: "exercise-10",
            type: "multi-step",
            label: "Exercise 10: Why Context Is Everything",
            description:
              "Reflect on the token prediction exercise and what it reveals about language understanding.",
            steps: [
              {
                id: "helped-hurt",
                type: "textarea",
                label: "What helped or hurt your predictions?",
                answer: "",
              },
              {
                id: "assumptions",
                type: "textarea",
                label:
                  "What assumptions did you make about tone, style, or purpose?",
                answer: "",
              },
              {
                id: "misunderstanding",
                type: "textarea",
                label:
                  "What could go wrong if the model misunderstood your intent?",
                answer: "",
              },
            ],
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
            label: 'Discussion 6: "Prompt Autopsy"',
            description:
              'Pairs share prompt wins and fails. Discuss what made the difference. Capture on board as "Wins" and "Fails".',
            answer: "",
          },
          {
            id: "exercise-11",
            type: "multi-step",
            label: 'Exercise 11: "Decision Support Prompt Lab"',
            description:
              "Multi-step activity to create and test decision support prompts",
            steps: [
              {
                id: "step-1",
                type: "textarea",
                label: "Step 1: Quick Decision Prompt (2-3 min)",
                description:
                  'Write your own quick decision prompt using this format: "I\'m a [your role]. I need to make a decision about [brief issue]. What are 3 options I should consider, and what are the trade-offs of each from my point of view?"',
                answer: "",
              },
              {
                id: "step-2a",
                type: "multi-step",
                label: "Step 2a: Fill in the Anatomy of a Problem (3 min)",
                description: "Now add real context. Fill in each of these:",
                steps: [
                  {
                    id: "role",
                    type: "text",
                    label: "Role: [your role]",
                    answer: "",
                  },
                  {
                    id: "who-involved",
                    type: "text",
                    label: "Who is involved?",
                    answer: "",
                  },
                  {
                    id: "challenge",
                    type: "text",
                    label: "What is the challenge or decision?",
                    answer: "",
                  },
                  {
                    id: "where-happening",
                    type: "text",
                    label: "Where is it happening (team, system, etc.)?",
                    answer: "",
                  },
                  {
                    id: "when-happening",
                    type: "text",
                    label:
                      "When is this happening or when is a decision needed?",
                    answer: "",
                  },
                  {
                    id: "why-matters",
                    type: "text",
                    label: "Why does this matter (what's at stake)?",
                    answer: "",
                  },
                  {
                    id: "output-format",
                    type: "text",
                    label:
                      "Preferred output format (pros/cons, table, ranked options, recommendation, etc.)",
                    answer: "",
                  },
                ],
              },
              {
                id: "step-2b",
                type: "textarea",
                label: "Step 2b: GPT Prompt – Turn It into a RISE Prompt",
                description:
                  'Copy-Paste This Prompt into GPT: "Using the information below, generate a clear and effective prompt using the RISE format. Don\'t lose any important context. The output should have 4 labeled sections: Role, Input, Steps, and Expectation." Then paste your context from Step 2a.',
                answer: "",
              },
              {
                id: "step-3",
                type: "textarea",
                label: "Step 3: Model Testing",
                description:
                  "Test Your Optimized RISE Prompt in Two Models: GPT-4 (ChatGPT) and compare outputs based on: Clarity (Which one was clearer and easier to understand?), Relevance (Which response fit your real situation better?), Usefulness (Which gave more practical or insightful solutions?), Tone & Confidence (Which sounded more trustworthy or professional in delivery?)",
                answer: "",
              },
            ],
          },
          {
            id: "exercise-12",
            type: "textarea",
            label: 'Exercise 12: "Next Time I Prompt..."',
            description:
              'Solo reflection: What will you do differently? Table share improvements. Group capture under "Smarter Prompts = ___"',
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
            label: 'Discussion 7: "Can ChatGPT Answer This?"',
            description:
              "Consider company-specific prompts. Discuss: Can ChatGPT answer well without help? Set up need for RAG",
            answer: "",
          },
          {
            id: "exercise-13",
            type: "multi-step",
            label: 'Exercise 13: "GPT vs RAG on Employee Handbook"',
            description:
              "Multi-step activity comparing GPT responses with and without RAG",
            steps: [
              {
                id: "step-1",
                type: "textarea",
                label: "Step 1: Ask GPT (without RAG)",
                description:
                  'Prompt: "What is the parental leave policy at The Venue Network?" Observe the output: Does it confidently guess? Is it vague, overly generic, or inaccurate?',
                answer: "",
              },
              {
                id: "step-2",
                type: "textarea",
                label:
                  "Step 2: Ask the same question in a RAG-enabled environment",
                description:
                  'Load the employee handbook (RAG mode). Ask: "What is the parental leave policy at The Venue Network?"',
                answer: "",
              },
              {
                id: "step-3",
                type: "textarea",
                label: "Step 3: Compare",
                description:
                  "Which version gave actual policy details? Did either include source references or cite page numbers? Which answer would you rely on if you were making a decision as an employee or manager?",
                answer: "",
              },
              {
                id: "test-questions",
                type: "textarea",
                label: "Test Questions from the Handbook",
                description:
                  "(These are designed to trip up a vanilla model unless it's paired with the handbook.) What benefits does The Venue Network provide after 90 days of employment? How much PTO can be carried over at the end of the fiscal year? What is the bereavement leave policy for a domestic partner's child? What are the rules around ending employment with unused PTO? Under what conditions will COBRA benefits be offered to former employees?",
                answer: "",
              },
            ],
          },
          {
            id: "exercise-14",
            type: "textarea",
            label: 'Exercise 14: "What Data Do You Need to RAG?"',
            description:
              "Solo reflection: What content would create value if connected to AI? Table share RAG-worthy data. Group capture examples",
            answer: "",
          },
        ],
      },
      {
        id: "2.6",
        title: "2.6 Agentic Workflow Primer",
        completed: false,
        exercises: [
          {
            id: "discussion-8",
            type: "textarea",
            label: 'Discussion 8: "If You Had a Team of You..."',
            description:
              "Table discussion: Clone yourself into 3 AI assistants. What would you assign them? Think beyond simple automation",
            answer: "",
          },
          {
            id: "exercise-15",
            type: "link",
            label: 'Exercise 15: "Design Your Agent Assistant"',
            description:
              "Multi-step activity: Build a Human + 1 Agent Workflow (16-18 min)",
            link: "/exercise/agent-design",
            answer: "",
          },
          {
            id: "exercise-16",
            type: "textarea",
            label: 'Exercise 16: "If This Worked Perfectly..."',
            description:
              "Solo reflection: How would your week change? Gallery walk: Share examples per group. Debrief speed gains, risk reduction, team impact",
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
            type: "textarea",
            label:
              "Discussion 9: \"What's Coming That You Can't Stop Thinking About?\"",
            description:
              'Share AI hopes that feel "not quite real". Capture under "Frontier Desires"',
            answer: "",
          },
          {
            id: "exercise-17",
            type: "textarea",
            label: 'Exercise 17: "Postcard from the Future"',
            description:
              'At your table, imagine a moment in the future—any year you choose. On a flipchart, write a postcard-style message beginning with: "The year is [____] and here\'s what AI is doing in our world..." That could be: • Helping you onboard teammates before they\'re hired • Designing your product strategy while you sleep • Making wild mistakes you now laugh about • Or... quietly running everything in the background. Be as practical or ambitious as you want—what\'s changed in your workflows, your company, or even your industry? Keep it short, fun, and bold. Then post your "future postcard" on the wall. Optional share-out: One volunteer reads a favorite line.',
            answer: "",
          },
          {
            id: "exercise-18",
            type: "textarea",
            label: 'Exercise 18: "From Vision to Value"',
            description:
              "Room discussion: How do organizations turn vision into value?",
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
          "3.1 The AI-Native Operating Model — A Playbook for Getting Real Value from AI",
        completed: false,
        exercises: [
          {
            id: "discussion-10",
            type: "textarea",
            label: "Discussion 10: Current State Check (5 min)",
            description:
              'Table discussion: "How are we actually using AI?" Be honest about reality vs aspiration. Optional whiteboard capture',
            answer: "",
          },
          {
            id: "exercise-19",
            type: "multi-step",
            label: "Exercise 19: Success Factor Application (15 min)",
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
                answer: "",
              },
              {
                id: "define-application",
                type: "textarea",
                label: "Define How You'll Apply It",
                description:
                  "What would it look like if you started modeling this success factor in how you work or lead right now?<br/>Examples: <ul><li> - Upskill Relentlessly → Block 1 hour/month for hands-on AI learning and share notes with team<li> - Tell the Full Story → Start adding use-case evidence to every AI recommendation <li> - Embed AI into the Everyday → Automate 1 report or feedback loop using a simple GenAI tool</ul>",
                answer: "",
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
                    answer: "",
                  },
                  {
                    id: "start-date",
                    type: "text",
                    label: "Start Date",
                    answer: "",
                  },
                  {
                    id: "who-helps",
                    type: "text",
                    label: "Who It Helps",
                    answer: "",
                  },
                  {
                    id: "success-looks",
                    type: "text",
                    label: "What Success Looks Like",
                    answer: "",
                  },
                ],
              },
              {
                id: "share-plan",
                type: "textarea",
                label: "Share Your Plan with your table",
                description: "Invite a few volunteers to share theirs",
                answer: "",
              },
            ],
          },
          {
            id: "exercise-20",
            type: "textarea",
            label: "Exercise 20: Room Debrief (5 min)",
            description:
              "2-3 volunteers share with group. Share chosen Success Factor and specific move. Listen for creative applications and insights",
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
        title: "4.1 Workflow Baseline Lab & Redesign with AI Step",
        completed: false,
        exercises: [
          {
            id: "exercise-21",
            type: "textarea",
            label: "Exercise 21: Make a Sandwich - Workflow Baseline (5 min)",
            description: "Group Discussion: At your table, take turns explaining how you make your favorite sandwich - step by step in 30 seconds or less.<br><br><strong>Be specific:</strong><br>• \"Open the fridge. Get the bread. Toast it...\"<br>• \"Spread mayo on one side. Stack turkey. Add pickles...\"<br><br>Write down the step-by-step process for making your favorite sandwich:",
            answer: ""
          },
          {
            id: "exercise-22",
            type: "link",
            label: "Exercise 22: AI Workflow Enhancement Tool",
            description: "Interactive workflow redesign activity using the AI Workflow Enhancer tool to identify and enhance your processes with AI integration points.",
            link: "/exercise/workflow-enhancer",
            answer: ""
          }
        ]
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
